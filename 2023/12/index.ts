import { lineByLine, printResults, sum } from "../utils/utils.ts";

const part = +Deno.args[0] || 1;

async function run() {
  if (part === 1) {
    await lineByLine("./input.txt", part1);
    const result = process1();
    printResults(8270, result);
  } else {
    await lineByLine("./input.txt", part1);
    const result = process1();
    printResults(648458253817, result);
  }
}

interface Spring {
  list: string;
  nums: number[]
}
const springs: Spring[] = [];
function part1(line: string) {
  const [list, nums] = line.split(' ')

  const spring = {
    list,
    nums: nums.split(',').map(n=>+n)
  }

  springs.push(spring)
}

function process1() {
  const counts: number[] = [];

  for (let i = 0; i < springs.length; i++) {
    const element = springs[i];

    counts.push(countOptions(element))
  }

  return counts
}

function fill(arr: number[][], before: number[], len: number, fillWith: number) {
  if (len <= 1) {
    const nextBefore = [...before, fillWith]
    arr.push(nextBefore)
  } else {
    const nexLen = len - 1

    let l = fillWith
    while (l >= 0) {
      const nextBefore = [...before, l]
      fill(arr, nextBefore, nexLen, fillWith - l)
      l--
    }
  }
}

function countOptions({list, nums}: Spring) {
  const fullLength = list.length
  const between = nums.length - 1
  const minLength = sum(nums) + between
  const placesToInsert = between + 2
  const dotsToPlay = fullLength - minLength
  const options = new Set()

  if (fullLength === minLength) {
    return 1
  }

  const base = nums.map(n => getMultipleSigns('#', n)).map((d, id) => id ? "." + d : d)

  const filles: number[][] = []
  fill(filles, [], placesToInsert, dotsToPlay);

  for (let i = 0; i < filles.length; i++) {
    const fill = filles[i].map(f => getMultipleSigns('.', f));
    const a = zip(fill, base)

    const p = a.join('');

    if (validateOption(p, list)) {
      options.add(p)
    }
  }

  return options.size
}

function validateOption(proposition: string, list: string) {
  if (proposition.length === list.length) {
    for (let i = 0; i < proposition.length; i++) {
      const dp = proposition[i];
      const dl = list[i];

      if (dp !== dl && dl !== "?") {
        return false
      }
    }

    return true
  }

  return false
}

function getMultipleSigns(sign: string, times: number) {
  let signs = ""
  for (let i = 0; i < times; i++) {
    signs += sign;
  }

  return signs
}

function zip(arr1: any[], arr2: any[]) {
  const arr = []
  for (let i = 0; i < arr1.length; i++) {
    const e1 = arr1[i];
    const e2 = arr2[i];

    arr.push(e1)

    if(e2) {
      arr.push(e2)
    }
  }

  return arr
}


run();
