#!/usr/bin/env bash
# Downloads the Typst binary into v2/.engines/ (gitignored).
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p .engines
OS=$(uname -s); ARCH=$(uname -m)
case "$OS-$ARCH" in
  Darwin-arm64)  TYPST=typst-aarch64-apple-darwin.tar.xz ;;
  Darwin-x86_64) TYPST=typst-x86_64-apple-darwin.tar.xz ;;
  Linux-x86_64)  TYPST=typst-x86_64-unknown-linux-musl.tar.xz ;;
  *) echo "unsupported platform $OS-$ARCH"; exit 1 ;;
esac
tmp=$(mktemp -d)

if [ ! -x .engines/typst ]; then
  echo "→ typst"
  curl -fsSL "https://github.com/typst/typst/releases/latest/download/$TYPST" -o "$tmp/typst.tar.xz"
  tar -xJf "$tmp/typst.tar.xz" -C "$tmp"
  mv "$tmp"/typst-*/typst .engines/typst
fi

rm -rf "$tmp"
.engines/typst --version
