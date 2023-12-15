#!/bin/bash

cd "$1"
bun --watch run index.ts "$2" "$3"