import {
  factorial,
  lineByLine,
  multiply,
  printResults,
  sum,
  zip,
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
    // printResults(8270, result);
    printResults(21, result);
  } else {
    await lineByLine(file, part2);
    const result = process1();
    printResults(525152, result);
    // printResults(16384, result);
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

    if (i !== 1) {
      // continue
    }

    const opts = countOptions(spring);
    console.log("STEP:", i, opts, spring.list + " " + spring.nums.join(","));

    counts.push(opts || 1);
  }

  return counts;
}

function countOptions(spring: Spring) {
  const { list, nums } = spring;

  const opti = preOpti(spring);
  if (opti) {
    return opti;
  }

  //* // TRY TO FILL QUICKER 3.0
  const filles3: string[] = [];
  const r = fill3(0, list, nums);

  return r;
  //*/

  /* // TRY TO FILL QUICKER
  const base = nums.map((n) => getMultipleSigns("#", n)).map((d, id) =>
    id ? "." + d : d
  );
  const fullLength = list.length;
  const between = nums.length - 1;
  const minLength = sum(nums) + between;
  const placesToInsert = between + 2;
  const dotsToPlay = fullLength - minLength;

  const minOption = base.join('');
  const filles2: string[] = [];
  const hashes = sum(nums)
  const dots = fullLength - hashes
  fill2(filles2, list, minOption, dots, hashes, "");
  // console.log("countOptions", {minOption, fullLength, list}, filles2.length);
  return filles2.length;
  //*/

  /* // LONGER FILL
  const validate = (fillArray: number[]) => {
    const fill = fillArray.map((f) => getMultipleSigns(".", f));
    const a = zip(fill, base);

    const p = a.join("");

    // return true
    return validateOption(p, list);
  };

  const filles: number[][] = [];
  fill(filles, [], placesToInsert, dotsToPlay, validate);

  console.log("countOptions", {minOption, fullLength, list}, filles.length);

  return filles.length;
  //*/
}

function fill3(
  count: number,
  list: string,
  nums: number[],
  hashes = 0,
): number {
  const first = list[0];
  const nextList = list.slice(1);

  switch (first) {
    case ".": {
      const firstGroup = nums[0];

      if (hashes === 0) {
        return fill3(count, nextList, nums, hashes);
      } else if (hashes === firstGroup) {
        return fill3(count, nextList, nums.slice(1), 0);
      }

      return 0;
    }

    case "#": {
      return fill3(count, nextList, nums, hashes + 1);
    }

    case "?": {
      const withDot = "." + nextList;
      const withDotSum = fill3(count, withDot, nums, hashes);

      const withHash = "#" + nextList;
      const withHashSum = fill3(count, withHash, nums, hashes);

      return withDotSum + withHashSum;
    }

    default: {
      const finish = list === "" && nums.length === 0 && hashes === 0;
      const hashFinish = list === "" && nums.length === 1 && nums[0] === hashes;

      if (finish || hashFinish) {
        return 1;
      }

      return 0;
    }
  }
}

function fill2(
  arr: string[],
  list: string,
  minOption: string,
  maxDots: number,
  maxHashes: number,
  txt: string,
  fillWith = "",
  dots = 0,
  hashes = 0,
) {
  txt += fillWith;

  if (txt.length === list.length) {
    if (hashes === maxHashes && validateFull(txt, list)) {
      // console.log("VALID", txt, txt.length);
      arr.push(txt);
    } else {
      // console.log("NOT VALID", txt, list);
    }
  } else {
    const nextD = list[txt.length];

    if (nextD === "?") {
      // if (hashes + 1 > maxHashes) {
      //   console.log("to much hashes", txt + "#");
      // }

      if (hashes + 1 <= maxHashes && validateFromStart(txt + "#", minOption)) {
        fill2(
          arr,
          list,
          minOption,
          maxDots,
          maxHashes,
          txt,
          "#",
          dots,
          hashes + 1,
        );
        // console.log("1. valid", txt + "#");
      } else {
        // console.log('1. not valid', txt + "#");
      }

      // if (dots + 1 > maxDots) {
      //   console.log("to much dots", txt + ".", {maxDots}, dots + 1);
      // }

      if (dots + 1 <= maxDots && validateFromStart(txt + ".", minOption)) {
        fill2(
          arr,
          list,
          minOption,
          maxDots,
          maxHashes,
          txt,
          ".",
          dots + 1,
          hashes,
        );
        // console.log("2. valid", txt + ".");
      } else {
        // console.log("2. not valid", txt + ".");
      }
    } else {
      // console.log("will next with", nextD);
      const dplus = nextD === "." ? 1 : 0;
      const hplus = dplus ? 0 : 1;
      fill2(
        arr,
        list,
        minOption,
        maxDots,
        maxHashes,
        txt,
        nextD,
        dots + dplus,
        hashes + hplus,
      );
    }
  }
}

function validateFull(proposition: string, line: string) {
  for (let i = 0; i < proposition.length; i++) {
    const dp = proposition[i];
    const dl = line[i];

    if (dp !== dl && dl !== "?") {
      return false;
    }
  }

  // console.log(proposition, line);

  return true;
}

function validateFromStart(proposition: string, minOption: string) {
  const trimmedProposition = trimList(proposition);

  if (trimmedProposition.length === 0) {
    return true;
  }

  for (let i = 0; i < trimmedProposition.length; i++) {
    const dp = trimmedProposition[i];
    const dl = minOption[i];

    if (dp !== dl && dl !== "?") {
      // console.log('X. not valid', proposition, trimmedProposition);
      return false;
    } else {
      // console.log('valid', trimmedProposition);
    }
  }

  // console.log('valid', proposition);

  return true;
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

function preOpti(spring: Spring) {
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

const reg1 = /\.+/g;
const reg2 = /^\.+/g;
const reg3 = /\.+$/g;
function trimList(list: string) {
  return list
    .replace(reg1, ".")
    .replace(reg2, "")
    .replace(reg3, "");
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

run();
