#!/bin/bash


if [ ! -d "$1" ]; then
  echo "directory $1 not exists"

  cp -r _ $1
fi

cd "$1"

bun --watch run index.ts