#!/bin/bash

dayOFmonth=$(date +%d)
day=${1:-$dayOFmonth}

if [ ! -d "$day" ]; then
  echo "directory $day not exists"

  cp -r _ $day
fi

cd "$day"

bun --watch index.ts