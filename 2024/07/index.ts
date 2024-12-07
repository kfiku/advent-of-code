import { byLine } from '../../utils/files'
import { sum } from '../../utils/numbers'
import { type Answers, run } from '../../utils/run'

const answers: Answers = {
  test1: 3749,
  input1: 932137732557,
  test2: 11387,
  input2: 661823605105500,
}

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string) {
  const lints = byLine(input)
    .map((l) => {
      const [r, n] = l.split(': ')
      const result = +r
      const numbers = n.split(' ').map((v) => +v)
      const results = getResults(numbers)
      const isOK = results.some((r) => r === result)

      return {
        result,
        isOK,
      }
    })
    .filter((r) => r.isOK)
    .map((r) => r.result)

  return sum(lints)
}

function getResults(numbers: number[]) {
  const results: number[] = []

  for (let i = 0; i < numbers.length; i++) {
    const n = numbers[i]
    const len = results.length

    for (let oi = 0; oi < len; oi++) {
      let o = results[oi]
      results[oi] = o * n
      results.push(o + n)
    }

    if (results.length === 0) {
      results.push(n)
    }
  }

  return results
}

function runSecondPart(input: string) {
  const lints = byLine(input)
    .map((l) => {
      const [r, n] = l.split(': ')
      const result = +r
      const numbers = n.split(' ').map((v) => +v)
      const results = getResultsPlus(numbers)
      const isOK = results.some((r) => r === result)

      return {
        result,
        isOK,
      }
    })
    .filter((r) => r.isOK)
    .map((r) => r.result)

  return sum(lints)
}

function getResultsPlus(numbers: number[]) {
  const results: number[] = []

  for (let i = 0; i < numbers.length; i++) {
    const n = numbers[i]
    const len = results.length

    for (let oi = 0; oi < len; oi++) {
      let o = results[oi]
      results[oi] = o * n
      results.push(o + n)
      results.push(+(o + '' + n))
    }

    if (results.length === 0) {
      results.push(n)
    }
  }

  return results
}

// I cant read :P options with validating the math way
function getOptions(numbers: number[]) {
  const options: string[] = []

  for (let i = 0; i < numbers.length; i++) {
    const n = numbers[i]
    const len = options.length

    for (let oi = 0; oi < len; oi++) {
      let o = options[oi]
      options[oi] = o + '*' + n
      options.push(o + '+' + n)
    }

    if (options.length === 0) {
      options.push(n.toString())
    }
  }

  return options
}

function isValid(options: string[], expected: number) {
  for (let i = 0; i < options.length; i++) {
    const element = options[i]
    const result = eval(element)
    const isEqual = result === expected

    if (isEqual) {
      console.log('VALID', expected, element)
      return true
    }
    console.log('FALSE', expected, element)
  }
}
