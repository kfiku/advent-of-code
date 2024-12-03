import { printResults } from '../utils/utils.ts'
import { readFileLineByLine } from '../utils/denoUtils.ts'

const numbers: number[] = []
const part = +Deno.args[0] || 1

let cards = 0

async function run() {
  if (part === 1) {
    await readFileLineByLine('./input.txt', part1)

    printResults(13, numbers)
  } else {
    await readFileLineByLine('./input.txt', part2)

    printResults(30, [cards])
  }
}

function part1(line: string) {
  const { winnings, numbers } = lineToObj(line)
  const result = getResult1(numbers, winnings)

  numbers.push(result)
}

const duplicates: number[] = []
function part2(line: string) {
  cards++
  const { nr, winnings, numbers } = lineToObj(line)
  const wins = getResult2(numbers, winnings)

  addDuplicates(wins, nr)
  processDuplicates(nr, wins)
}

function processDuplicates(nr: number, wins: number) {
  const lineDuplicates = duplicates[nr] || 0
  for (let i = 0; i < lineDuplicates; i++) {
    addDuplicates(wins, nr)
    cards++
  }
}

function addDuplicates(wins: number, nr: number) {
  for (let i = 0; i < wins; i++) {
    const duplicateNr = nr + i + 1
    if (!duplicates[duplicateNr]) {
      duplicates[duplicateNr] = 0
    }

    duplicates[duplicateNr]++
  }
}

function getResult1(numbers: number[], winnings: number[]) {
  return numbers.reduce((acc, curr) => {
    const win = isWinningSymbol(curr, winnings)
    return win ? (acc === 0 ? 1 : acc * 2) : acc
  }, 0)
}

function getResult2(numbers: number[], winnings: number[]) {
  return numbers.reduce((acc, curr) => {
    const win = isWinningSymbol(curr, winnings)
    return win ? acc + 1 : acc
  }, 0)
}

function isWinningSymbol(sym: number, winnings: number[]) {
  return winnings.includes(sym)
}

function lineToObj(line: string) {
  const nr = +line.split(':')[0].split('Card ')[1]
  const [winnings, numbers] = line
    .replaceAll('  ', ' ')
    .split(': ')[1]
    .split(' | ')
    .map((numbersString) => numbersString.split(' ').map((numberString) => +numberString))

  return { nr, winnings, numbers }
}

run()
