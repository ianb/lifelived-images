#!/usr/bin/env bash

set -e

ls ~/Downloads/ai\ work/lifelived-bgs
mv ~/Downloads/ai\ work/lifelived-bgs/* test/
node build.js
open index.html
