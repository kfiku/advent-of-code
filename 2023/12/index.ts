import {
  factorial,
  lineByLine,
  multiply,
  printResults,
  sum,
} from "../utils/utils.ts";

// ??????????? 3,2,2 => l:12, m:9, miejsc do wstawienia: 4
// (4 + 3 - 1)!
// ------------------
// 3! * ((4 + 3 - 1) - 3)!

const part = +Deno.args[0] || 1;
const file = Deno.args[1] || "./input.txt";

async function run() {
  if (part === 1) {
    await lineByLine(file, part1);
    const result = process1();
    printResults(8270, result);
    printResults(21, result);
  } else {
    await lineByLine(file, part2);
    const result = process1();
    printResults(525152, result);
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

function process1() {
  const counts: number[] = [];

  for (let i = 0; i < springs.length; i++) {
    const spring = springs[i];
    const opts = countOptions(spring);
    console.log(
      "STEP:",
      i,
      opts,
      spring.list + " " + spring.nums.join(","),
      // "; org:",
      // lines[i],
    );

    if (opts === 0) {
      console.log("ERROR", springs[i], lines[i]);
    }

    counts.push(opts || 1);
  }

  return counts;
}

function trimList(list: string) {
  return list
    .replace(/\.+/g, ".")
    .replace(/^\.+/g, "")
    .replace(/\.+$/g, "");
}

function fill(
  arr: number[][],
  before: number[],
  len: number,
  fillWith: number,
  validate: (fillArray: number[]) => boolean,
) {
  if (len <= 1) {
    const nextBefore = [...before, fillWith];
    if (validate(nextBefore)) {
      arr.push(nextBefore);
    }
  } else {
    const nexLen = len - 1;

    let l = fillWith;
    while (l >= 0) {
      const nextBefore = [...before, l];
      fill(arr, nextBefore, nexLen, fillWith - l, validate);
      l--;
    }
  }
}

function countOptions(spring: Spring) {
  const { list, nums } = spring;
  const fullLength = list.length;
  const between = nums.length - 1;
  const minLength = sum(nums) + between;
  const placesToInsert = between + 2;
  const dotsToPlay = fullLength - minLength;

  if (fullLength === minLength) {
    return 1;
  }

  const optionsToCheck = countAllQuestionMarks(spring);

  if (list === getMultipleSigns("?", fullLength)) {
    return optionsToCheck;
  }

  const partsResult = countByPartsIfPossible(spring);
  if (partsResult) {
    return partsResult;
  }

  const partsResult2 = countByPartsIfPossible2(spring);
  if (partsResult2) {
    return partsResult2;
  }

  const partsResult3 = countByPartsIfPossible3(spring);
  if (partsResult3) {
    return partsResult3;
  }

  const partsResult4 = countByPartsIfPossible4(spring);
  if (partsResult4) {
    return partsResult4;
  }

  const base = nums.map((n) => getMultipleSigns("#", n)).map((d, id) =>
    id ? "." + d : d
  );

  const validate = (fillArray: number[]) => {
    const fill = fillArray.map((f) => getMultipleSigns(".", f));
    const a = zip(fill, base);

    const p = a.join("");

    // return true
    return validateOption(p, list);
  };

  const filles: number[][] = [];
  fill(filles, [], placesToInsert, dotsToPlay, validate);

  return filles.length;
}

function validateOption(proposition: string, list: string) {
  if (proposition.length === list.length) {
    for (let i = 0; i < proposition.length; i++) {
      const dp = proposition[i];
      const dl = list[i];

      if (dp !== dl && dl !== "?") {
        return false;
      }
    }

    return true;
  }

  return false;
}

function getMultipleSigns(sign: string, times: number) {
  let signs = "";
  for (let i = 0; i < times; i++) {
    signs += sign;
  }

  return signs;
}

function zip(arr1: any[], arr2: any[]) {
  const arr = [];
  for (let i = 0; i < arr1.length; i++) {
    const e1 = arr1[i];
    const e2 = arr2[i];

    arr.push(e1);

    if (e2) {
      arr.push(e2);
    }
  }

  return arr;
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

function countByPartsIfPossible2({ list, nums }: Spring) {
  const largest = Math.max(...nums);
  const largest2 = Math.max(...nums.filter((n) => n !== largest));
  const diff = largest2 + 1;
  const toAdd = largest - diff;
  const lt = getMultipleSigns("#", diff);
  if (!lt) {
    return undefined;
  }
  const largestL = nums.filter((n) => n === largest).length;
  const reg = new RegExp(
    "[#?]{0," + toAdd + "}" + lt + "[#?]{0," + toAdd + "}",
    "g",
  );
  const ltMatches = list.match(reg) || [];
  const ltl = ltMatches.length;

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

function countByPartsIfPossible3({ list, nums }: Spring) {
  const largest = Math.max(...nums);
  const largest2 = Math.max(...nums.filter((n) => n !== largest));
  const diff = largest2 + 1;
  if (diff < 3) {
    return undefined;
  }
  const largestL = nums.filter((n) => n === largest).length;
  const txt = "." + "#[#?]{" + (largest - 2) + "}#" + ".";
  const reg = new RegExp(txt, "g");
  const ltMatches = list.match(reg) || [];
  const ltl = ltMatches.length;

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

function countByPartsIfPossible4({ list, nums }: Spring) {
  for (let i = 0; i < nums.length; i++) {
    const cn = nums[i];
    const lt = getMultipleSigns("#", cn);
    const reg = new RegExp("\\." + lt + "\\.", "g");
    const ll = (list.match(reg) || []).length;
    const nl = nums.filter((n) => n === cn).length;

    if (ll === nl) {
      console.log(ll, nl);

      const la = list.split(reg);
      const na = nums.join("").split(cn + "").map((n) =>
        n.split("").map((n2) => +n2)
      );

      const sr: number[] = la.map((l, id) => {
        const n = na[id];

        return countOptions({ list: l, nums: n }) || 1;
      });

      return multiply(sr);
    }
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

  // console.log(list + " " + nums.join(',') + " => l:" + fullLength + " m:" + minLength + " miejsc do wstawienia:" + placesToInsert)
  // console.log(
  //   "(" + placesToInsert + " + " + diff + " - " + 1 + ")!" +
  //   "\n" +
  //   "----------------" +
  //   "\n" +
  //   "(" + diff + "!" + " * " + "(" + placesToInsert + " + " + diff + " - " + 1  + " - " + diff + ")!" +  ")",
  // );

  // ?????????? 3,2,2 => l:12, m:9, miejsc do wstawienia: 4
  // (4 + 3 - 1)!
  // ------------------
  // 3! * ((4 + 3 - 1) - 3)!

  return Math.round(up / down);
}

run();
