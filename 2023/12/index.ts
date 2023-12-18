import { printResults } from "../utils/utils.ts";
import { file, part, readFileLineByLine } from "../utils/bunUtils.ts";
import { runInWorker } from "../utils/runInWorker.ts";

async function run() {
  if (part === 1) {
    await readFileLineByLine(file, part1);
    const result = await process1();

    printResults(8270, result);
  } else {
    await readFileLineByLine(file, part2);
    const result = await process1();

    printResults(204640299929836, result);
  }
}

export interface Spring {
  list: string;
  nums: number[];
}
const lines: string[] = [];
const springs: Spring[] = [];

function part1(line: string) {
  const { list, nums } = minimize(line);

  const spring = {
    list,
    nums,
  };

  springs.push(spring);
}

function part2(line: string) {
  const [l, n] = line.split(" ");
  const nn = n.split(",").map((n) => +n);

  const line5 = [l, l, l, l, l].join("?") + " " +
    [nn, nn, nn, nn, nn].flat().join(",");
  const { list, nums } = minimize(line5);

  const spring = {
    list,
    nums,
  };

  springs.push(spring);
}

async function process1() {
  const countsPromises: Promise<any>[] = [];

  for (let i = 0; i < springs.length; i++) {
    countsPromises.push(runInWorker(springs[i]));
  }

  const counts = await Promise.all(countsPromises);

  return counts;
}

function minimize(line: string) {
  lines.push(line);
  const [l, n] = line.split(" ");
  const nn = n.split(",").map((n) => +n);

  const { list: l1, nums: n1 } = minimizeOptions(l, [...nn]);
  const { list, nums } = minimizeReverse(l1, [...n1]);

  return { list, nums };
}

function minimizeOptions(l: string, nums: number[]) {
  let list = trimList(l);

  const toCheck = nums[0];
  const str = list.slice(0, toCheck + 2);

  if (str.slice(toCheck) === "#.") {
    nums.splice(0, 1);
    list = list.slice(toCheck + 1);

    return minimizeOptions(list, nums);
  }

  if (str[0] === "#") {
    nums.splice(0, 1);
    list = list.slice(toCheck + 1);

    return minimizeOptions(list, nums);
  }

  if (str[1] === "#" && str[toCheck] === "#") {
    nums.splice(0, 1);
    list = list.slice(toCheck + 2);

    return minimizeOptions(list, nums);
  }

  return {
    list,
    nums,
  };
}

function minimizeReverse(l: string, n: number[]) {
  const lr = stringReverse(l);
  const nr = arrayReverse(n);

  const { list, nums } = minimizeOptions(lr, nr);

  return {
    list: stringReverse(list),
    nums: arrayReverse(nums),
  };
}

function stringReverse(l: string) {
  let rl = "";
  const ll = l.length;

  for (let i = ll - 1; i >= 0; i--) {
    rl += l[i];
  }

  return rl;
}

function arrayReverse<T>(a: T[]) {
  const ra: T[] = [];
  const l = a.length;

  for (let i = 0; i < l; i++) {
    const element = a[i];
    ra[l - i - 1] = element;
  }

  return ra;
}

const reg1 = /\.+/g;
const reg2 = /^\.+/g;
const reg3 = /\.+$/g;
function trimList(list: string) {
  return list
    .replace(reg1, ".")
    .replace(reg2, "")
    .replace(reg3, "");
}

run();
