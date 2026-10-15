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
  Linux-aarch64|Linux-arm64) TYPST=typst-aarch64-unknown-linux-musl.tar.xz ;;
  *) echo "unsupported platform $OS-$ARCH"; exit 1 ;;
esac
tmp=$(mktemp -d)

if [ ! -x .engines/typst ]; then
  echo "→ typst"
  curl -fsSL "https://github.com/typst/typst/releases/latest/download/$TYPST" -o "$tmp/typst.tar.xz"
  tar -xJf "$tmp/typst.tar.xz" -C "$tmp"
  mv "$tmp"/typst-*/typst .engines/typst
fi

# Resume fonts (SIL Open Font License / Ubuntu Font Licence), from the Google Fonts repo.
# Variable fonts are fine: Typst picks the weight it needs.
FONTS_BASE=https://github.com/google/fonts/raw/main
FONTS=(
  "ofl/asap/Asap[wdth,wght].ttf" "ofl/asap/Asap-Italic[wdth,wght].ttf"
  "ufl/ubuntu/Ubuntu-Regular.ttf" "ufl/ubuntu/Ubuntu-Italic.ttf" "ufl/ubuntu/Ubuntu-Medium.ttf" "ufl/ubuntu/Ubuntu-Bold.ttf" "ufl/ubuntu/Ubuntu-BoldItalic.ttf"
  "ofl/inter/Inter[opsz,wght].ttf" "ofl/inter/Inter-Italic[opsz,wght].ttf"
  "ofl/sourcesans3/SourceSans3[wght].ttf" "ofl/sourcesans3/SourceSans3-Italic[wght].ttf"
  "ofl/sourceserif4/SourceSerif4[opsz,wght].ttf" "ofl/sourceserif4/SourceSerif4-Italic[opsz,wght].ttf"
  "ofl/ebgaramond/EBGaramond[wght].ttf" "ofl/ebgaramond/EBGaramond-Italic[wght].ttf"
  "ofl/lato/Lato-Regular.ttf" "ofl/lato/Lato-Italic.ttf" "ofl/lato/Lato-Bold.ttf" "ofl/lato/Lato-BoldItalic.ttf"
  "ofl/ibmplexsans/IBMPlexSans[wdth,wght].ttf" "ofl/ibmplexsans/IBMPlexSans-Italic[wdth,wght].ttf"
  "ofl/carlito/Carlito-Regular.ttf" "ofl/carlito/Carlito-Italic.ttf" "ofl/carlito/Carlito-Bold.ttf" "ofl/carlito/Carlito-BoldItalic.ttf"
)
mkdir -p .engines/fonts
for f in "${FONTS[@]}"; do
  name=$(basename "$f")
  [ -s ".engines/fonts/$name" ] && continue
  echo "→ $name"
  url="$FONTS_BASE/$(echo "$f" | sed 's/\[/%5B/g; s/\]/%5D/g')"
  curl -fsSL "$url" -o ".engines/fonts/$name"
done

rm -rf "$tmp"
.engines/typst --version
