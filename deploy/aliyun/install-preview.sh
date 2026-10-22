#!/usr/bin/env bash
# First installation only. Does not publish a public listener or change DNS.
set -Eeuo pipefail
[[ $(id -u) == 0 ]] || { echo 'Run this installer as root.'; exit 1; }
bundle_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
[[ $(uname -m) == x86_64 ]] || { echo 'Expected an x86_64 server.'; exit 1; }
/usr/local/bin/node -e 'if(Number(process.versions.node.split(".")[0]) < 24) process.exit(1)'
nginx -t
for target in /opt/learningwithrachel/current /etc/systemd/system/learningwithrachel.service /etc/nginx/conf.d/learningwithrachel-preview.conf; do
  [[ ! -e "$target" && ! -L "$target" ]] || { echo "Existing deployment found: $target. Stopping without changes."; exit 1; }
done
if ss -H -lnt '( sport = :3000 or sport = :8080 )' | grep -q .; then
  echo 'Port 3000 or 8080 is already in use. Stopping without changes.'; exit 1
fi
release_dir="/opt/learningwithrachel/releases/$(date -u +%Y%m%dT%H%M%SZ)"
created_link=0
created_unit=0
created_nginx=0
rollback() {
  echo 'Preview installation failed. Restoring configuration; the staged release is kept for inspection.'
  if [[ "$created_unit" == 1 ]]; then
    journalctl -u learningwithrachel -n 25 --no-pager || true
    systemctl disable --now learningwithrachel || true
    rm -f /etc/systemd/system/learningwithrachel.service
    systemctl daemon-reload
  fi
  if [[ "$created_nginx" == 1 ]]; then
    rm -f /etc/nginx/conf.d/learningwithrachel-preview.conf
    nginx -t && systemctl reload nginx || true
  fi
  if [[ "$created_link" == 1 ]]; then rm -f /opt/learningwithrachel/current; fi
}
trap rollback ERR
if ! id learning-site >/dev/null 2>&1; then
  useradd --system --user-group --no-create-home --shell /usr/sbin/nologin learning-site
fi
install -d -m 0755 /opt/learningwithrachel /opt/learningwithrachel/releases "$release_dir"
cp -a "$bundle_dir/server" "$bundle_dir/public" "$release_dir/"
chown -R root:root "$release_dir"
chmod -R u=rwX,go=rX "$release_dir"
ln -s "$release_dir" /opt/learningwithrachel/current
created_link=1
install -m 0644 "$bundle_dir/learningwithrachel.service" /etc/systemd/system/learningwithrachel.service
created_unit=1
systemctl daemon-reload
systemctl enable --now learningwithrachel
ready=0
for attempt in {1..20}; do
  if curl -fsS http://127.0.0.1:3000/ -o /dev/null; then ready=1; break; fi
  sleep 1
done
[[ "$ready" == 1 ]]
install -m 0644 "$bundle_dir/nginx-preview.conf" /etc/nginx/conf.d/learningwithrachel-preview.conf
created_nginx=1
nginx -t
systemctl reload nginx
curl -fsS http://127.0.0.1:8080/ -o /dev/null
curl -fsS http://127.0.0.1:8080/western-culture/index.html -o /dev/null
curl -fsS http://127.0.0.1:8080/release-version.json
printf '\n'
[[ $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8080/western-culture/assets/early-greece-lilies-background.png) == 307 ]]
systemctl is-active learningwithrachel nginx
trap - ERR
echo 'PREVIEW_READY: http://127.0.0.1:8080 (server-local only; public website unchanged)'
