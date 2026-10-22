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
curl -fsS -H 'Host: preview.negentropylearning.com.cn' http://127.0.0.1/release-version.json
printf '\n'
[[ $(curl -s -o /dev/null -w '%{http_code}' -H 'Host: preview.negentropylearning.com.cn' http://127.0.0.1/western-culture/assets/early-greece-lilies-background.png) == 307 ]]
trap - ERR
echo 'HTTP_PREVIEW_READY: waiting for preview DNS, ECS port 80 and HTTPS certificate'
