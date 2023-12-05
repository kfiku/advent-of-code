import { lineByLine, printResults } from "../utils/utils.ts";

async function run() {
  const numbers: number[] = [];

  await lineByLine("./input.txt", (line) => {
    const nr = processLine(line);

    numbers.push(nr);
  });

  printResults(13, numbers);
}

function processLine(line: string) {
  const {winnings, numbers} = lineToObj(line)
  const result = numbers.reduce((acc, curr)  => {
    const win = isWinningSymbol(curr, winnings)
    return win ? (acc === 0 ? 1 : acc * 2) : acc
  }, 0)

  return result;
}

function isWinningSymbol(sym: number, winnings: number[]) {
  return winnings.includes(sym);
}

function lineToObj(line: string) {
  const [winnings, numbers] = line
    .replaceAll("  ", " ")
    .split(': ')[1]
    .split(' | ')
    .map(numbersString => numbersString
      .split(' ')
      .map(numberString => +numberString)
    )

  return {winnings, numbers};
}

run();
