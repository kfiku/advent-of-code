import { lineByLine, printResults, sum } from "../utils/utils.ts";

const part = +Deno.args[0] || 1;

async function run() {
  if (part === 1) {
    await lineByLine("./input.txt", part1);
    const result = process();
    printResults(1877825184, result);
  } else {
    await lineByLine("./input.txt", part1);
    const result = process();

    printResults(18024643846273, result);
  }
}

const lines: number[][] = [];
function part1(line: string) {
  const values: number[] = line.split(" ").map((n) => +n);
  const nextValue = getNextValue(values);
  values.push(nextValue);

  lines.push(values);
}

function process() {
  const lastNumbers = lines.map((l) => l[l.length - 1]);

  return lastNumbers;
}

function getNextValue(values: number[], prevValues: number[][] = []) {
  const diffs: number[] = [];

  for (let i = 1; i < values.length; i++) {
    diffs.push(values[i] - values[i - 1]);
  }

  if (!isAllZeros(diffs)) {
    return getNextValue(diffs, [values, ...prevValues]);
  }

  const final = [diffs, values, ...prevValues].map((v) => v[v.length - 1]);

  return sum(final);
}

function isAllZeros(values: number[]) {
  return !values.some((v) => v !== 0);
}

run();
