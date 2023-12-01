import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";

async function run() {
  const f = await Deno.open("./input.txt");

  const numbers = [];

  for await (const line of readline(f)) {
    const textLine = new TextDecoder().decode(line);
    const nr = findNr(textLine);

    numbers.push(nr);
  }

  console.log(sum(numbers));

  f.close();
}

function sum(numbers: number[]) {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

const acceptedDigits = [
  ["one", '1'],
  ["two", '2'],
  ["three", '3'],
  ["four", '4'],
  ["five", '5'],
  ["six", '6'],
  ["seven", '7'],
  ["eight", '8'],
  ["nine", '9'],
] as const;


function findNr(line: string) {
  const twoNumbers = `${findFirst(line)}${findLast(line)}`;

  return +twoNumbers;
}

function findFirst(line: string) {
  for (let i = 0; i < line.length; i++) {
    const letter = line[i];

    if (+letter > 0) {
      return letter
    }

    for (let j = 0; j < acceptedDigits.length; j++) {
      const [text, nr] = acceptedDigits[j];
      const world = line.substring(i, i + text.length)

      if (world === text) {
        return +nr
      }
    }
  }
}

function findLast(line: string) {
  for (let i = line.length; i >= 0; i--) {
    const letter = line[i];

    if (+letter > 0) {
      return letter
    }

    for (let j = 0; j < acceptedDigits.length; j++) {
      const [text, nr] = acceptedDigits[j];
      const world = line.substring(i - text.length, i)

      if (world === text) {
        return +nr
      }
    }
  }
}

run();
