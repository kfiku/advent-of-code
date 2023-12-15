import { factorial, multiply, sum } from "../utils/utils.ts";
import { type Spring } from "./index.ts";

export function countOptions(spring: Spring) {
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

export function preOptimization(spring: Spring) {
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
