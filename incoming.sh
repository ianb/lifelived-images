#!/usr/bin/env bash

set -e

mv ~/Download/"ai work"/lifelived-bgs/* test/
node build.js
open index.html
