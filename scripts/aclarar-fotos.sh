#!/usr/bin/env bash
# Lighter service samples and barber portraits (R18, user's request of 2026-11-21: they read
# too dark once multiplied onto the bone ground). Each photo is rebuilt from its original in
# referencias/fotos-originales/ (out of git): resized to 1200 px wide as before, midtones
# lifted with a gamma of 1.45 and the black point raised to 10 %, so the studio white still
# melts into the ground and the deep blacks of the prompts open up. Running it twice gives
# the same files (it always starts from the originals).
# The originals were matched to the site files by comparing thumbnails (RMSE about 0.001
# against 0.34 or more for any other original).
# After running it, embed each file's provenance again (impeccable embed-prompt).
# Usage: scripts/aclarar-fotos.sh [originals dir] [output dir]
set -euo pipefail
originales="${1:-referencias/fotos-originales}"
salida="${2:-src/assets/fotos}"

declare -A ORIGEN=(
  [servicio-corte]=f7ptvpf7ptvpf7pt
  [servicio-corte-barba]=xj79e5xj79e5xj79
  [servicio-barba]=pg3mk5pg3mk5pg3m
  [servicio-afeitado]=grbon9grbon9grbo
  [servicio-infantil]=i66jvzi66jvzi66j
  [barbero-ramon]=e4brmhe4brmhe4br
  [barbero-leo]=kl81j2kl81j2kl81
  [barbero-jesus]=hw085vhw085vhw08
)

for nombre in "${!ORIGEN[@]}"; do
  original="$originales/Gemini_Generated_Image_${ORIGEN[$nombre]}.jpeg"
  magick "$original" -resize '1200x' -colorspace gray \
    -level 0%,100%,1.45 +level 10%,100% \
    -strip -quality 90 "$salida/$nombre.jpg"
  echo "$nombre.jpg ← $(basename "$original")"
done
