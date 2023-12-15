import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";

console.time("process");

export const part = +Deno.args[0] || 1;
export const file = Deno.args[1] || "./input.txt";

export function factorial(num: number) {
  if (num < 0) {
    return Infinity;
  }

  let fact = 1;
  for (let i = num; i > 1; i--) {
    fact *= i;
  }

  return fact;
}

export function printResults(expected: number, numbers: number[]) {
  const result = sum(numbers);

  if (expected === result) {
    console.log("OK", result);
  } else {
    console.log("WRONG", result + " !== " + expected);
  }

  console.timeEnd("process");
}

export async function lineByLine(
  file: string,
  callback: (line: string) => void,
) {
  const f = await Deno.open(file);

  for await (const line of readline(f)) {
    const textLine = new TextDecoder().decode(line);

    callback(textLine);
  }

  f.close();
}

export function sum(numbers: number[]) {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

export function sub(numbers: number[]) {
  return numbers.reduce((acc, curr) => curr - acc, 0);
}

export function multiply(numbers: number[]) {
  return numbers.reduce((acc, curr) => acc * curr, 1);
}

function gcd(a: number, b: number) {
  while (b != 0) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(a: number, b: number) {
  return (a * b) / gcd(a, b);
}

export function lcmOfArray(arr: number[]) {
  let currentLcm = arr[0];
  for (let i = 1; i < arr.length; i++) {
    currentLcm = lcm(currentLcm, arr[i]);
  }
  return currentLcm;
}

export function zip(arr1: any[], arr2: any[]) {
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
