#!/usr/bin/env bash
set -euo pipefail

source_file="public/audio-i-become-a-student.mp3"
output_dir="public/audio-sentences"
temporary_dir="$(mktemp -d)"
trap 'rm -rf "$temporary_dir"' EXIT

# Sentence boundaries were aligned to the narration waveform. The first 6.778
# seconds contain the title/author introduction and are intentionally omitted.
boundaries=(
  6.778 10.495 36.606 46.216 51.106 53.053 63.402 71.481 74.350 88.913
  96.965 106.790 111.876 120.624 134.383 142.921 159.554 169.038 171.056
  181.603 186.716 198.697 205.853 214.611 222.978 232.243 235.708 248.586
  250.478 261.315 294.526 305.262 308.643 325.501 327.971 339.423 343.580
  345.218 346.654 363.526 367.334
)

for index in $(seq 0 39); do
  number=$(printf '%02d' "$((index + 1))")
  ffmpeg -hide_banner -loglevel error -y \
    -ss "${boundaries[$index]}" -to "${boundaries[$((index + 1))]}" \
    -i "$source_file" -map_metadata -1 -codec:a libmp3lame -q:a 2 \
    "$temporary_dir/sentence-$number.mp3"
done

for clip in "$temporary_dir"/*.mp3; do
  mv "$clip" "$output_dir/$(basename "$clip")"
done

echo "Rebuilt 40 sentence clips from the full narration."
