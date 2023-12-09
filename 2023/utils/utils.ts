import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";

console.time("process");

export function printResults(expected: number, numbers: number[]) {
  const result = sum(numbers);

  if (result !== expected) {
    console.log(numbers);
  }

  console.log(expected === result, expected, "===", result);
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
