#!/usr/bin/env bash
# Downloads the Typst and Tectonic binaries into v2/.engines/ (gitignored).
# The HTML engine needs nothing extra — it drives your installed Google Chrome.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p .engines
OS=$(uname -s); ARCH=$(uname -m)
case "$OS-$ARCH" in
  Darwin-arm64)  TYPST=typst-aarch64-apple-darwin.tar.xz;   TECTONIC=aarch64-apple-darwin ;;
  Darwin-x86_64) TYPST=typst-x86_64-apple-darwin.tar.xz;    TECTONIC=x86_64-apple-darwin ;;
  Linux-x86_64)  TYPST=typst-x86_64-unknown-linux-musl.tar.xz; TECTONIC=x86_64-unknown-linux-musl ;;
  *) echo "unsupported platform $OS-$ARCH"; exit 1 ;;
esac
tmp=$(mktemp -d)

if [ ! -x .engines/typst ]; then
  echo "→ typst"
  curl -fsSL "https://github.com/typst/typst/releases/latest/download/$TYPST" -o "$tmp/typst.tar.xz"
  tar -xJf "$tmp/typst.tar.xz" -C "$tmp"
  mv "$tmp"/typst-*/typst .engines/typst
fi

if [ ! -x .engines/tectonic ]; then
  echo "→ tectonic"
  url=$(curl -fsSL https://api.github.com/repos/tectonic-typesetting/tectonic/releases/latest \
    | grep -o "https://[^\"]*tectonic-[0-9.]*-$TECTONIC\.tar\.gz" | head -1)
  curl -fsSL "$url" -o "$tmp/tectonic.tar.gz"
  tar -xzf "$tmp/tectonic.tar.gz" -C .engines
fi

rm -rf "$tmp"
.engines/typst --version
.engines/tectonic --version
