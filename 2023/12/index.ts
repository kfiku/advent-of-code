import {
  factorial,
  file,
  lineByLine,
  multiply,
  part,
  printResults,
  sum,
} from "../utils/utils.ts";

async function run() {
  if (part === 1) {
    await lineByLine(file, part1);
    const result = process1();

    printResults(8270, result);
  } else {
    await lineByLine(file, part2);
    const result = process1();

    printResults(204640299929836, result);
  }
}

interface Spring {
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

function process1() {
  const counts: number[] = [];

  for (let i = 0; i < springs.length; i++) {
    const opts = countOptions(springs[i]);

    counts.push(opts || 1);
  }

  return counts;
}

function countOptions(spring: Spring) {
  const { list, nums } = spring;

  const optimization = preOptimization(spring);
  if (optimization) {
    return optimization;
  }

  return fill(0, list, nums);
}

const fill3CacheMap = new Map<string, number>();

function fill(count: number, list: string, nums: number[], hashes = 0) {
  const cacheKey = list + " " + nums.join(",") + " " + hashes;
  const fromCache = fill3CacheMap.get(cacheKey);
  if (fromCache !== undefined) {
    return count + fromCache;
  }

  const first = list[0];
  const nextList = list.slice(1);
  let newCount = 0;

  switch (first) {
    case ".":
      {
        const firstGroup = nums[0];

        if (hashes === 0) {
          return fill(count, nextList, nums, hashes);
        } else if (hashes === firstGroup) {
          return fill(count, nextList, nums.slice(1), 0);
        }
      }
      break;

    case "#": {
      return fill(count, nextList, nums, hashes + 1);
    }

    case "?":
      {
        const withDot = "." + nextList;
        const withDotSum = fill(count, withDot, nums, hashes);

        const withHash = "#" + nextList;
        const withHashSum = fill(count, withHash, nums, hashes);

        newCount = withDotSum + withHashSum;
      }
      break;

    default:
      {
        const finish = list === "" && nums.length === 0 && hashes === 0;
        const hashFinish = list === "" && nums.length === 1 &&
          nums[0] === hashes;

        if (finish || hashFinish) {
          newCount = 1;
        }
      }
      break;
  }

  fill3CacheMap.set(cacheKey, newCount);

  return newCount;
}

function getMultipleSigns(sign: string, times: number) {
  let signs = "";
  for (let i = 0; i < times; i++) {
    signs += sign;
  }

  return signs;
}

function preOptimization(spring: Spring) {
  const { list, nums } = spring;
  const between = nums.length - 1;
  const fullLength = list.length;
  const minLength = sum(nums) + between;

  if (fullLength === minLength) {
    return 1;
  }

  if (list === getMultipleSigns("?", fullLength)) {
    return countAllQuestionMarks(spring);
  }

  // SPLIT OPTIONS
  const partsResult = countByPartsIfPossible(spring);
  if (partsResult) {
    return partsResult;
  }
}

function countByPartsIfPossible({ list, nums }: Spring) {
  const largest = Math.max(...nums);
  const largestL = nums.filter((n) => n === largest).length;
  const lt = getMultipleSigns("#", largest);
  if (!lt) {
    return undefined;
  }
  const reg = new RegExp("." + lt + ".", "g");
  const ltl = (list.match(reg) || []).length;

  if (largestL === ltl) {
    const la = list.split(reg);
    const na = nums.join("").split(largest + "").map((n) =>
      n.split("").map((n2) => +n2)
    );

    const sr: number[] = la.map((l, id) => {
      const n = na[id];

      return countOptions({ list: l, nums: n }) || 1;
    });

    return multiply(sr);
  }
}

function countAllQuestionMarks({ list, nums }: Spring) {
  const fullLength = list.length;
  const between = nums.length - 1;
  const minLength = sum(nums || []) + between;
  const placesToInsert = between + 2;
  const diff = fullLength - minLength;

  const upBase = placesToInsert + diff - 1;
  const up = factorial(upBase);
  const down = factorial(diff) * factorial(upBase - diff);

  return Math.round(up / down);
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
