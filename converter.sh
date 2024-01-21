#!/bin/bash

for webpfile in images/*.webp portraits/*.png; do
    # Skip if no .webp files are found
    if [[ ! -e "$webpfile" ]]; then
        continue
    fi

    # Construct the corresponding .jpg filename
    jpgfile="${webpfile%.webp}"
    jpgfile="${jpgfile%.png}.jpg"

    # Check if the .jpg file already exists
    if [[ ! -e "$jpgfile" ]]; then
        # Convert .webp to .jpg with specified quality
        convert "$webpfile" -quality 75 "$jpgfile"
        echo "Converted $webpfile to $jpgfile"
    else
        echo "$jpgfile already exists, skipping conversion."
    fi
done

node build.js
