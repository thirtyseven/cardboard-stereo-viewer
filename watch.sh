#!/bin/bash
while true; do
        files=$(inotifywait -e create images/ | cut -d' ' -f3)
        for file in $files; do
                convert images/$file -scale 1024x1024 images/$file
        done
done
