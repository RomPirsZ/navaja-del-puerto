#!/usr/bin/env bash
# The barbers' credit portraits as cut-outs (R20, user's request of 2026-11-21: no background,
# the bottom fading into the page). Each one is rebuilt from its original in
# referencias/fotos-originales/ (out of git):
# - Matte from the photo itself: the studio white is flood-filled from the top corners and
#   down both sides (the page's CSS mask fades the bottom edge). Settings per portrait:
#   Leo and Jesús stand on a graded studio white, so a 6 % fuzz takes it all. Ramón's white
#   jacket is as light as the wall, so his fill is tighter (3 %), stops above his shoulders
#   and runs over a dilated edge map that holds it at the contours. Where the jacket truly
#   matches the wall there is no edge to find; the duotone below prints white as --hueso,
#   the page ground, so such a leak does not show.
# - Duotone black → --carbon, white → --hueso (like the hero portrait), midtones lifted with
#   a gamma of 1.3 so the faces read on the bone ground.
# The colours repeat global.css tokens: update them if those tokens change.
# After running it, embed each file's provenance again (impeccable embed-prompt).
# Usage: scripts/retratos-barberos.sh [originals dir] [output dir]
set -euo pipefail
originales="${1:-referencias/fotos-originales}"
salida="${2:-src/assets/fotos}"
oscuro='#1c1c1c'
claro='#ede6d8'
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

# name = original id, fuzz, lowest seed row (fraction of the height), edge barrier (1/0)
declare -A ORIGEN=(
  [barbero-ramon]='e4brmhe4brmhe4br 3 2 1'
  [barbero-leo]='kl81j2kl81j2kl81 6 3 0'
  [barbero-jesus]='hw085vhw085vhw08 6 3 0'
)

for nombre in "${!ORIGEN[@]}"; do
  read -r id fuzz cuartos barrera <<<"${ORIGEN[$nombre]}"
  original="$originales/Gemini_Generated_Image_${id}.jpeg"
  magick "$original" -resize '1200x' -colorspace gray "$tmp/gris.png"
  tamano="$(magick identify -format '%w %h' "$tmp/gris.png")"
  w="${tamano% *}"
  h="${tamano#* }"
  semillas=()
  for ((c = 0; c <= cuartos; c++)); do
    y=$((h * c / 4))
    semillas+=(-draw "color 0,$y floodfill" -draw "color $((w - 1)),$y floodfill")
  done
  if [[ "$barrera" == 1 ]]; then
    magick "$tmp/gris.png" -canny 0x1.5+3%+10% -morphology Dilate Disk:2 -negate "$tmp/barrera.png"
    magick "$tmp/gris.png" "$tmp/barrera.png" -compose multiply -composite "$tmp/relleno.png"
  else
    cp "$tmp/gris.png" "$tmp/relleno.png"
  fi
  magick "$tmp/relleno.png" -alpha set -fuzz "$fuzz%" -fill none "${semillas[@]}" \
    -alpha extract -morphology Close Disk:3 -morphology Erode Disk:1 -blur 0x1.2 "$tmp/mate.png"
  magick "$tmp/gris.png" -level 0%,100%,1.3 +level-colors "$oscuro","$claro" "$tmp/duotono.png"
  magick "$tmp/duotono.png" "$tmp/mate.png" -alpha off -compose CopyOpacity -composite \
    -strip -quality 88 "$salida/$nombre.webp"
  echo "$nombre.webp ← $(basename "$original")"
done
