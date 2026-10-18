#!/usr/bin/env bash
# 靜態 build 後同步到 GCP VM（Caddy 從 /opt/stock-trends/blog-dist 提供 www.aaron-shih.com）
set -euo pipefail

VM="${VM:-allen@35.185.165.89}"
DEST="/opt/stock-trends/blog-dist/"

cd "$(dirname "$0")/.."

rm -rf .output
NODE_OPTIONS='--max-old-space-size=4096' pnpm generate

pages=$(find .output/public -name index.html | wc -l | tr -d ' ')
if [ "$pages" -lt 100 ]; then
  echo "只產生 $pages 個頁面，少於預期，停止部署" >&2
  exit 1
fi

rsync -az --delete .output/public/ "$VM:$DEST"
echo "已部署 $pages 個頁面 → https://www.aaron-shih.com"
