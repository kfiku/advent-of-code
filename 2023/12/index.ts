import { lineByLine, printResults, sum } from "../utils/utils.ts";

// ??????????? 3,2,2 => l:12, m:9, miejsc do wstawienia: 4
// (4 + 3 - 1)!
// ------------------
// 3! * ((4 + 3 - 1) - 3)!


const part = +Deno.args[0] || 1;

async function run() {
  if (part === 1) {
    await lineByLine("./input.txt", part1);
    const result = process1();
    printResults(8270, result);
    printResults(21, result);
  } else {
    await lineByLine("./input.txt", part2);
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
  const { list, nums } = minimize(line);

  const spring = {
    list: [list, list, list, list, list].join("?"),
    nums: nums.map((n) => [n, n, n, n, n]).flat(),
  };

  springs.push(spring);
}

function minimize(line: string) {
  lines.push(line);
  const [l, n] = line.split(" ");
  const nn = n.split(",").map((n) => +n);

  const { list: l1, nums: n1 } = minimizeOptions(l, [...nn]);
  const { list, nums } = minimizeReverse(l1, [...n1]);

  // if (nums.length !== nn.length) {
  //   console.log('OPTIMIZE', l, nn, '=>', list, nums);
  // } else {
  //   console.log(':(', list, nums);
  // }

  return { list, nums }
  return { list: l, nums: nn }
}

function minimizeOptions(l: string, nums: number[]) {
  let list = trimList(l);
  // console.log('l', list, nums);

  const toCheck = nums[0]
  const str = list.slice(0, toCheck + 2)

  if (str.slice(toCheck) === '#.') {
    // console.log('last # minimize', toCheck, list, '=>', list.slice(toCheck + 1));
    nums.splice(0, 1)
    list = list.slice(toCheck + 1)

    return minimizeOptions(list, nums)
  }

  if (str[0] === '#') {
    nums.splice(0, 1)
    list = list.slice(toCheck + 1)

    return minimizeOptions(list, nums)
  }

  // if (lParts[0].length === nums[0] + 1) {
    //   nums.splice(0, 1)
    //   list = list.slice(toCheck + 1)

    //   return minimizeOptions(list, nums)
    // }

  // const lParts = list.split('#.')
  // if (lParts.length > 1 && lParts.length === nums.length) {
  //   const group = {
  //     list: "",
  //     nums: [] as number[]
  //   }
  //   for (let i = 0; i < lParts.length; i++) {
  //     const { list: l1, nums: n1 } = minimizeOptions(lParts[i], [nums[i]]);
  //     const { list: l2, nums: n2 } = minimizeReverse(l1, [...n1]);

  //     group.list += l2
  //     group.nums = [...group.nums, ...n2]
  //   }

  //   // console.log({group});
  //   list = group.list
  //   nums = group.nums
  // }

  return {
    list,
    nums
  }
}

function minimizeReverse(l: string, n: number[]) {
  const lr = stringReverse(l);
  const nr = arrayReverse(n);

  const { list, nums } = minimizeOptions(lr, nr);

  return {
    list: stringReverse(list),
    nums: arrayReverse(nums)
  }
}

function stringReverse(l: string) {
  let rl = ""
  const ll = l.length

  for (let i = ll - 1; i >= 0; i--) {
    rl += l[i]
  }

  return rl
}

function arrayReverse<T>(a: T[]) {
  const ra: T[] = []
  const l = a.length

  for (let i = 0; i < l; i++) {
    const element = a[i];
    ra[l - i - 1] = element
  }

  return ra
}

function process1() {
  const counts: number[] = [];

  for (let i = 0; i < springs.length; i++) {
    if(i === 4) {

      console.log('STEP:', i, springs[i], lines[i]);
    }
    const opts = countOptions(springs[i]);

    if(opts === 0) {
      console.log('ERROR', springs[i], lines[i]);
    }

    counts.push(opts || 1);
  }

  return counts;
}

function trimList(list:string) {
  return list
    .replace(/\.+/g, '.')
    .replace(/^\.+/g, '')
    .replace(/\.+$/g, '')
}

function fill(
  arr: number[][],
  before: number[],
  len: number,
  fillWith: number,
  validate: (fillArray: number[]) => boolean
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

function countOptions({ list, nums }: Spring) {
  const fullLength = list.length;
  const between = nums.length - 1;
  const minLength = sum(nums) + between;
  const placesToInsert = between + 2;
  const dotsToPlay = fullLength - minLength;
  // const options = new Set();

  if (fullLength === minLength) {
    return 1;
  }

  const base = nums.map((n) => getMultipleSigns("#", n)).map((d, id) =>
    id ? "." + d : d
  );

  const validate = (fillArray: number[]) => {
    const fill = fillArray.map((f) => getMultipleSigns(".", f));
    const a = zip(fill, base);

    const p = a.join("");

    return validateOption(p, list);
  }

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

run();
