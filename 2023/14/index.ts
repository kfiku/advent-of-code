import { lineByLine, printResults, sum } from "../utils/utils.ts";

const part = +Deno.args[0] || 1;

async function run() {
  if (part === 1) {
    await lineByLine("./input.txt", part1);
    const result = process1();
    printResults(405, result);
  } else {
    await lineByLine("./input.txt", part1);
    const result = process1();
    printResults(400, result);
  }
}

const mirrors: string[][] = [[]];

function part1(line: string) {
  console.log(line);
}

function process1() {
  return [0]
}



run();
