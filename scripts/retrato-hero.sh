#!/usr/bin/env bash
# Hero portrait as a cut-out duotone (plan §9): the face goes in front of «PUERTO», as in the
# reference, which a multiplied photo cannot do (the black letters always win). The matte comes
# from the photo itself: the studio background is flood-filled from the four corners, then
# feathered. Duotone: black → --tinta, white → --funda (update both if those tokens change).
# Usage: scripts/retrato-hero.sh <original> src/assets/fotos/hero-retrato.webp
set -euo pipefail
original="$1"
salida="$2"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

magick "$original" -resize '1600x2000>' -colorspace gray -level 0%,96% "$tmp/gris.png"
tamano="$(magick identify -format '%w %h' "$tmp/gris.png")"
w="${tamano% *}"
h="${tamano#* }"
magick "$tmp/gris.png" -alpha set -fuzz 7% -fill none \
  -draw "color 0,0 floodfill" -draw "color $((w - 1)),0 floodfill" \
  -draw "color 0,$((h - 1)) floodfill" -draw "color $((w - 1)),$((h - 1)) floodfill" \
  -alpha extract -morphology Erode Disk:1.5 -blur 0x1.2 "$tmp/mate.png"
magick "$tmp/gris.png" +level-colors '#16120e','#f05a24' "$tmp/duotono.png"
magick "$tmp/duotono.png" "$tmp/mate.png" -alpha off -compose CopyOpacity -composite -strip -quality 90 "$salida"
