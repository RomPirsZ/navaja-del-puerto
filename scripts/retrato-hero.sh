#!/usr/bin/env bash
# Hero portrait as a cut-out duotone (plan §9): the barber stands in front of «NAVAJA», which a
# multiplied photo cannot do. The matte comes from the photo itself: the studio background is
# flood-filled from the four corners, then feathered. Duotone: black → a charcoal one step
# below --carbon (so the black t-shirt still reads against the hero and its red glow), white →
# --hueso. The colours repeat global.css tokens: update them if those tokens change.
# Usage: scripts/retrato-hero.sh <original> src/assets/fotos/hero-retrato.webp [dark] [light]
set -euo pipefail
original="$1"
salida="$2"
oscuro="${3:-#121212}"
claro="${4:-#ede6d8}"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

magick "$original" -resize '1600x2000>' -colorspace gray -level 0%,96% "$tmp/gris.png"
tamano="$(magick identify -format '%w %h' "$tmp/gris.png")"
w="${tamano% *}"
h="${tamano#* }"
magick "$tmp/gris.png" -alpha set -fuzz 7% -fill none \
  -draw "color 0,0 floodfill" -draw "color $((w - 1)),0 floodfill" \
  -draw "color 0,$((h - 1)) floodfill" -draw "color $((w - 1)),$((h - 1)) floodfill" \
  -alpha extract -morphology Erode Disk:3 -blur 0x1.4 "$tmp/mate.png"
magick "$tmp/gris.png" +level-colors "$oscuro","$claro" "$tmp/duotono.png"
magick "$tmp/duotono.png" "$tmp/mate.png" -alpha off -compose CopyOpacity -composite -strip -quality 90 "$salida"
