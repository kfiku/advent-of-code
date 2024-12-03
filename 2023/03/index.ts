import { readline } from 'https://deno.land/x/readline@v1.1.0/mod.ts'

async function run() {
  const f = await Deno.open('./input.txt')

  const numbers = []
  const lines = ['', '']

  for await (const line of readline(f)) {
    const textLine = new TextDecoder().decode(line)
    if (lines.length < 3) {
      lines.push(`.${textLine}.`)
    } else {
      lines.shift()
      lines.push(`.${textLine}.`)
      const nr = processLine(lines)
      numbers.push(nr)
    }
  }

  lines.shift()
  lines.push('')
  const nr = processLine(lines)
  numbers.push(nr)

  // console.log(numbers);
  const result = sum(numbers)
  console.log(467835 === result, 467835, result)

  f.close()
}

function processLine(lines: string[]) {
  const properNumbers = [0]
  for (let i = 0; i < lines[1].length; i++) {
    const d = lines[1][i]
    if (d === '*') {
      const n = findNumbers(lines, i)

      properNumbers.push(n)
    }
  }

  return sum(properNumbers)
}

function findNumbers(lines: string[], starPos: number) {
  let numbers: number[] = []

  numbers.push(...findInLine(lines[0], starPos))
  numbers.push(...findInLine(lines[1], starPos))
  numbers.push(...findInLine(lines[2], starPos))
  numbers = numbers.filter(Boolean)

  if (numbers.some((n) => n == 67)) {
    console.log(numbers)
  }
  if (numbers.length === 2) {
    // console.log(numbers);
    return numbers[0] * numbers[1]
  }

  return 0
}

function findInLine(line: string, pos: number) {
  const numbers: number[] = []
  const point = line[pos]
  const left = line[pos - 1]
  const right = line[pos + 1]

  if (Number.isInteger(+point)) {
    numbers.push(findInNrInLine(line, pos))
  } else {
    if (Number.isInteger(+left)) {
      numbers.push(findInNrInLine(line, pos - 1))
    }
    if (Number.isInteger(+right)) {
      numbers.push(findInNrInLine(line, pos + 1))
    }
  }

  return numbers
}

function findInNrInLine(line: string, pos: number, log = 0) {
  let i = pos
  let d = line[i]
  let num = ''
  log && console.log('R', d, i)

  while (Number.isInteger(+d)) {
    i--
    d = line[i]
  }

  i++
  d = line[i]
  while (Number.isInteger(+d)) {
    i++
    num += d
    d = line[i]
  }

  return +num || 0
}

function sum(numbers: number[]) {
  return numbers.reduce((acc, curr) => acc + curr, 0)
}

run()
