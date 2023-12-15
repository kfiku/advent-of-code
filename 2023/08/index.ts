import {
  lcmOfArray,
  multiply,
  printResults,
  sum,
} from "../utils/utils.ts";
import { readFileLineByLine } from "../utils/denoUtils.ts";

const part = +Deno.args[0] || 1;

async function run() {
  if (part === 1) {
    await readFileLineByLine("./input.txt", part1);
    const result = process();
    printResults(18727, [result]);
  } else {
    await readFileLineByLine("./input.txt", part1);
    const result = process2();

    printResults(18024643846273, [result]);
  }
}

let stepper: number[] = [];
const networks: Record<string, string[]> = {};
const firstKey = "AAA";
const lastKey = "ZZZ";

function part1(line: string) {
  if (line.trim() === "") {
    return;
  }

  if (!line.includes("=")) {
    stepper = line.split("").map((l) => l === "L" ? 0 : 1);
    return;
  }

  const [key, cords] = line.split(" = (");

  networks[key] = cords.replace(")", "").split(", ");
}

function process() {
  return processOne(firstKey, lastKey);
}

function process2() {
  const networkKeys = Object.keys(networks);
  const firstKeys = networkKeys.filter((k) => k.endsWith("A"));
  const lastKeys = networkKeys.filter((k) => k.endsWith("Z"));
  console.log(firstKeys, "->", lastKeys);

  const res: number[] = [];
  firstKeys.map((first) => {
    lastKeys.map((last) => {
      res.push(processOne(first, last));
    });
  });

  const finalSteps = res.filter((r) => r !== Infinity);

  return lcmOfArray(finalSteps);
}

function processOne(first: string, last: string) {
  let steps = 0;
  let key = first;
  let stepId = 0;
  const lastStepId = stepper.length - 1;

  while (key !== last) {
    key = networks[key][stepper[stepId]];
    stepId++;
    steps++;

    if (steps % 10_000_000 === 0) {
      console.log(steps, key);
    }

    if (stepId > lastStepId) {
      stepId = 0;
    }

    if (steps > 1_000_000) {
      return Infinity;
    }
  }

  return steps;
}

run();
