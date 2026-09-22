#!/bin/bash
set -euo pipefail

project_dir="$(cd "$(dirname "$0")" && pwd)"
bundled_node="${HOME}/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"

if [[ -x "$bundled_node" ]]; then
  preview_node="$bundled_node"
elif command -v node >/dev/null 2>&1; then
  preview_node="$(command -v node)"
else
  echo '未找到 Node.js。请安装 Node.js 22.13 或更高版本后重试。'
  read -r -p '按回车关闭此窗口。'
  exit 1
fi

if "$preview_node" "$project_dir/scripts/local-preview.mjs"; then
  /usr/bin/open 'http://127.0.0.1:5173/#text'
else
  read -r -p '启动未成功，按回车关闭此窗口。'
  exit 1
fi
