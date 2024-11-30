import { readFileSync } from "fs";

export function readFile(filePath: string) {
  return readFileSync(filePath).toString();
}

export function byLine(input: string) {
  return input.split('\n');
}
