#!/bin/bash

cd "$1"
deno run --allow-all --watch ./index.ts "$2" "$3"