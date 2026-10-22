#!/usr/bin/env bash
# DNS-01 can issue a production certificate before the public DNS cutover.
set -Eeuo pipefail
[[ $(id -u) == 0 ]] || { echo 'Run as root.' >&2; exit 1; }

apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y python3-certbot-dns-cloudflare
certbot plugins | grep -q dns-cloudflare || {
    echo 'The Cloudflare DNS plugin was not found.' >&2
    exit 1
}

credentials=/root/.secrets/certbot/cloudflare.ini
install -d -m 0700 /root/.secrets/certbot
if [[ ! -s "$credentials" ]]; then
    printf 'Paste the zone-scoped Cloudflare API token (input is hidden): ' >&2
    IFS= read -r -s cf_token
    printf '\n' >&2
    [[ -n $cf_token ]] || { echo 'No token entered.' >&2; exit 1; }
    umask 077
    printf 'dns_cloudflare_api_token = %s\n' "$cf_token" > "$credentials"
    unset cf_token
    chmod 0600 "$credentials"
fi

certbot certonly --dns-cloudflare \
    --dns-cloudflare-credentials "$credentials" \
    --dns-cloudflare-propagation-seconds 60 \
    --cert-name negentropylearning.com.cn \
    -d negentropylearning.com.cn \
    -d www.negentropylearning.com.cn \
    --dry-run --non-interactive --agree-tos

certbot certonly --dns-cloudflare \
    --dns-cloudflare-credentials "$credentials" \
    --dns-cloudflare-propagation-seconds 60 \
    --cert-name negentropylearning.com.cn \
    -d negentropylearning.com.cn \
    -d www.negentropylearning.com.cn \
    --non-interactive --agree-tos

test -s /etc/letsencrypt/live/negentropylearning.com.cn/fullchain.pem
test -s /etc/letsencrypt/live/negentropylearning.com.cn/privkey.pem
echo 'PRODUCTION_CERT_READY: certificate issued; public DNS is unchanged.'
