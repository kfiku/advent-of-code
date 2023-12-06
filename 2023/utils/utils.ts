import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";

console.time("process")

export function printResults(expected: number, numbers: number[]) {
  const result = sum(numbers);

  if (result !== expected) {
    console.log(numbers);
  }

  console.log(expected === result, expected, "===", result);
  console.timeEnd("process")
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
