import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";

async function run() {
  const f = await Deno.open("./input.txt");

  const numbers = [];

  for await (const line of readline(f)) {
    const textLine = new TextDecoder().decode(line);
    const nr = processLine(textLine);

    numbers.push(nr);
  }

  console.log(numbers);
  console.log(sum(numbers));

  f.close();
}

function sum(numbers: number[]) {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

// 12 red cubes, 13 green cubes, and 14 blue cubes
type C = {
  red: number;
  green: number;
  blue: number;
};

const c: C = {
  red: 12,
  green: 13,
  blue: 14,
};

function processLine(line: string) {
  const obj = lineToObj(line);
  // console.log("line", line, obj);

  /* part one
  if (isValid(obj)) {
    return obj.nr
  }

  return 0
  */

  // part dwo
  return findMinMultiply(obj);
}

function findMinMultiply(obj: ReturnType<typeof lineToObj>) {
  const min = obj.scores.reduce((acc, curr) => {
    return {
      red: Math.max(acc.red, curr.red) || acc.red,
      green: Math.max(acc.green, curr.green) || acc.green,
      blue: Math.max(acc.blue, curr.blue) || acc.blue,
    };
  }, { red: 0, green: 0, blue: 0 });

  return min.red * min.green * min.blue;
}

function findMin(obj: ReturnType<typeof lineToObj>) {
  return !obj.scores.map(isSingleValid).some((b) => !b);
}

function isValid(obj: ReturnType<typeof lineToObj>) {
  return !obj.scores.map(isSingleValid).some((b) => !b);
}

function isSingleValid(obj: Partial<C>) {
  return true &&
    (!obj.red || obj.red <= c.red) &&
    (!obj.green || obj.green <= c.green) &&
    (!obj.blue || obj.blue <= c.blue);
}

function lineToObj(line: string) {
  try {
    const res = line.match(/Game (\d+): (.+)/) || [];
    const scores = res[2].split("; ").map((s) => {
      return s.split(", ").map((ss) => ss.split(" "));
    }).map((score) => {
      return score.reduce((acc, cur) => {
        return {
          ...acc,
          [cur[1]]: +cur[0],
        };
      }, {});
    }) as C[];
    const nr = +res[1];

    return {
      nr,
      scores,
    };
  } catch (error) {
    console.log("err line", line);
    throw error;
  }
}

run();
