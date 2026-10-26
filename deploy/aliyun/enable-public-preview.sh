#!/usr/bin/env bash
# Publishes only the preview hostname over HTTP. Production DNS is untouched.
set -Eeuo pipefail
[[ $(id -u) == 0 ]] || { echo 'Run as root.'; exit 1; }
systemctl is-active --quiet learningwithrachel
systemctl is-active --quiet nginx
[[ -d /opt/learningwithrachel/current/public ]]
config=/etc/nginx/conf.d/learningwithrachel-public-preview.conf
[[ ! -e "$config" ]] || { echo "Already present: $config. No changes made."; exit 1; }
nginx -t
trap 'rm -f "$config"; nginx -t && systemctl reload nginx || true' ERR
cat > "$config" <<'NGINX'
server {
    listen 80;
    server_name preview.negentropylearning.com.cn;
    root /opt/learningwithrachel/current/public;
    index index.html;
    charset utf-8;
    client_max_body_size 2m;
    access_log /var/log/nginx/learningwithrachel-preview-access.log;
    error_log /var/log/nginx/learningwithrachel-preview-error.log;
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
preview_url=http://preview.negentropylearning.com.cn/release-version.json
preview_status=
for attempt in {1..20}; do
    preview_status=$(curl --noproxy '*' --resolve preview.negentropylearning.com.cn:80:127.0.0.1 -sS -o /dev/null -w '%{http_code}' "$preview_url" || true)
    if [[ "$preview_status" == 200 ]]; then break; fi
    sleep 0.5
done
if [[ "$preview_status" != 200 ]]; then
    echo "HTTP preview did not become ready (last status: $preview_status)." >&2
    nginx -T 2>&1 | grep -E 'learningwithrachel-public-preview|listen 80|server_name preview' >&2 || true
    tail -n 10 /var/log/nginx/learningwithrachel-preview-access.log /var/log/nginx/access.log /var/log/nginx/error.log >&2 || true
    false
fi
curl --noproxy '*' --resolve preview.negentropylearning.com.cn:80:127.0.0.1 -fsS "$preview_url"
printf '\n'
[[ $(curl --noproxy '*' --resolve preview.negentropylearning.com.cn:80:127.0.0.1 -s -o /dev/null -w '%{http_code}' http://preview.negentropylearning.com.cn/western-culture/assets/early-greece-lilies-background.png) == 307 ]]
trap - ERR
echo 'HTTP_PREVIEW_READY: waiting for preview DNS, ECS port 80 and HTTPS certificate'
