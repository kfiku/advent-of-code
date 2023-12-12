import { lineByLine, printResults } from "../utils/utils.ts";

const part = +Deno.args[0] || 1;
let expandRate = 1;

async function run() {
  if (part === 1) {
    await lineByLine("./input.txt", part1);
    const result = process1();
    printResults(374, result);
  } else {
    expandRate = 1_000_000 - 1
    await lineByLine("./input.txt", part1);
    const result = process1();
    printResults(648458253817, result);
  }
}


function part1(line: string) {
  console.log(line.split(''))
}

function process1() {
  return [0]
}


run();
