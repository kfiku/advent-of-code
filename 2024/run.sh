#!/bin/bash

dayOFmonth=$(date +%d)
day=${1:-$dayOFmonth}

if [ ! -d "$day" ]; then
  echo "directory $day not exists"

  cp -r _ $day
fi

cd "$day"

# time node --experimental-strip-types --experimental-transform-types index.ts
# time deno run --allow-read --unstable-sloppy-imports --watch index.ts
time bun index.ts