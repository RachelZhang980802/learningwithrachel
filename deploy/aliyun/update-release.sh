#!/usr/bin/env bash
# Replace an existing ECS release while keeping the previous one for rollback.
set -Eeuo pipefail
[[ $(id -u) == 0 ]] || { echo 'Run as root.' >&2; exit 1; }
bundle_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
base=/opt/learningwithrachel
current="$base/current"
[[ -L "$current" && -d "$bundle_dir/server" && -d "$bundle_dir/public" ]] || {
  echo 'Existing deployment or new release files are missing.' >&2; exit 1;
}
systemctl is-active --quiet learningwithrachel
systemctl is-active --quiet nginx
nginx -t
previous=$(readlink -f "$current")
release_dir="$base/releases/$(date -u +%Y%m%dT%H%M%SZ)"
[[ ! -e "$release_dir" ]] || { echo "Release already exists: $release_dir" >&2; exit 1; }
install -d -m 0755 "$release_dir"
cp -a "$bundle_dir/server" "$bundle_dir/public" "$release_dir/"
if [[ -f "$bundle_dir/deployment.json" ]]; then cp -a "$bundle_dir/deployment.json" "$release_dir/"; fi
chown -R root:root "$release_dir"
chmod -R u=rwX,go=rX "$release_dir"
switched=0
rollback() {
  if [[ "$switched" == 1 ]]; then
    echo "Update failed; restoring $previous" >&2
    ln -s "$previous" "$base/current.rollback"
    mv -Tf "$base/current.rollback" "$current"
    systemctl restart learningwithrachel || true
  fi
  echo "New files kept for inspection at $release_dir" >&2
}
trap rollback ERR
ln -s "$release_dir" "$base/current.next"
mv -Tf "$base/current.next" "$current"
switched=1
systemctl restart learningwithrachel
ready=0
for attempt in {1..30}; do
  if curl --noproxy '*' -fsS http://127.0.0.1:3000/ -o /dev/null; then ready=1; break; fi
  sleep 1
done
[[ "$ready" == 1 ]]
curl --noproxy '*' -fsS http://127.0.0.1:8080/western-culture/greece-rome.html | grep -F 'early-greece-lilies-background.webp' >/dev/null
curl --noproxy '*' --resolve negentropylearning.com.cn:443:127.0.0.1 -fsS https://negentropylearning.com.cn/ -o /dev/null
curl --noproxy '*' --resolve www.negentropylearning.com.cn:443:127.0.0.1 -fsS https://www.negentropylearning.com.cn/ -o /dev/null
systemctl is-active --quiet learningwithrachel
systemctl is-active --quiet nginx
trap - ERR
echo "UPDATE_READY: $release_dir"
echo "ROLLBACK_RELEASE: $previous"
