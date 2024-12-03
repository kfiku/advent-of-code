import { multiply, printResults } from '../utils/utils.ts'
import { readFileLineByLine } from '../utils/denoUtils.ts'

const part = +Deno.args[0] || 1

async function run() {
  if (part === 1) {
    await readFileLineByLine('./input.txt', part2)
    const result = process()

    printResults(114400, [result])
  } else {
    await readFileLineByLine('./input.txt', part1)
    const result = process()

    printResults(21039729, [result])
  }
}

let times: number[] = []
let records: number[] = []

function part1(line: string) {
  const [key, value] = line.split(':')

  const values = [+value.replace(/ +/g, '')]

  if (key === 'Time') {
    times = values
  } else {
    records = values
  }
}

function part2(line: string) {
  const [key, value] = line.split(':')

  const values = value
    .trim()
    .split(/ +/)
    .map((v) => +v.trim())

  if (key === 'Time') {
    times = values
  } else {
    records = values
  }
}

function process() {
  const wins: number[] = []

  for (let step = 0; step < times.length; step++) {
    let winCount = 0
    const time = times[step]
    const record = records[step]

    for (let i = 0; i < time; i++) {
      const dist = i * (time - i)
      const isWin = dist > record

      if (isWin) {
        winCount++
      }
    }

    wins.push(winCount)
  }

  return multiply(wins)
}

run()
