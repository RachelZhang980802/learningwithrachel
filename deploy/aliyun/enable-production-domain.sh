#!/usr/bin/env bash
# Prepare HTTPS for the production hostnames while public DNS still points to Vercel.
set -Eeuo pipefail

[[ $(id -u) == 0 ]] || { echo 'Run as root.' >&2; exit 1; }
systemctl is-active --quiet learningwithrachel
systemctl is-active --quiet nginx
[[ -d /opt/learningwithrachel/current/public ]] || { echo 'Website files are missing.' >&2; exit 1; }

cert_dir=/etc/letsencrypt/live/negentropylearning.com.cn
[[ -s "$cert_dir/fullchain.pem" && -s "$cert_dir/privkey.pem" ]] || {
    echo "First issue the certificate for both production hostnames: $cert_dir" >&2
    exit 1
}
config=/etc/nginx/conf.d/learningwithrachel-production.conf
[[ ! -e "$config" ]] || { echo "Already present: $config. No changes made." >&2; exit 1; }
nginx -t

trap 'rm -f "$config"; nginx -t && systemctl reload nginx || true' ERR
cat > "$config" <<'NGINX'
server {
    listen 80;
    server_name negentropylearning.com.cn www.negentropylearning.com.cn;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name negentropylearning.com.cn www.negentropylearning.com.cn;
    ssl_certificate /etc/letsencrypt/live/negentropylearning.com.cn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/negentropylearning.com.cn/privkey.pem;

    root /opt/learningwithrachel/current/public;
    index index.html;
    charset utf-8;
    client_max_body_size 2m;
    access_log /var/log/nginx/learningwithrachel-production-access.log;
    error_log /var/log/nginx/learningwithrachel-production-error.log;
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;

    # Vinext's public React Server Components endpoint is not a dotfile.
    location = /.rsc {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    location ~ /\. { deny all; }
    location / {
        try_files $uri $uri/index.html @learning_node;
    }
    location @learning_node {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX
chmod 0644 "$config"
nginx -t
systemctl reload nginx

for hostname in negentropylearning.com.cn www.negentropylearning.com.cn; do
    ready=0
    for attempt in {1..20}; do
        if curl --noproxy '*' --resolve "$hostname:443:127.0.0.1" -fsS \
            "https://$hostname/release-version.json" -o /dev/null; then
            ready=1
            break
        fi
        sleep 0.5
    done
    [[ $ready == 1 ]] || { echo "HTTPS failed locally for $hostname." >&2; false; }
    [[ $(curl --noproxy '*' --resolve "$hostname:80:127.0.0.1" -sS \
        -o /dev/null -w '%{http_code}' "http://$hostname/release-version.json") == 301 ]]
done

redirect_status=$(curl --noproxy '*' --resolve negentropylearning.com.cn:443:127.0.0.1 \
    -sS -o /dev/null -w '%{http_code}' \
    https://negentropylearning.com.cn/western-culture/assets/early-greece-lilies-background.png)
[[ $redirect_status == 307 ]] || {
    echo "Expected R2 asset redirect 307, got $redirect_status." >&2
    false
}
trap - ERR

hook=/etc/letsencrypt/renewal-hooks/deploy/learningwithrachel-nginx-reload
if [[ ! -e "$hook" ]]; then
    cat > "$hook" <<'HOOK'
#!/usr/bin/env bash
set -e
nginx -t
systemctl reload nginx
HOOK
    chmod 0755 "$hook"
fi

echo 'PRODUCTION_ORIGIN_READY: both HTTPS hosts work locally; public DNS is unchanged.'
