import { readFile } from './files'

export interface Answers {
  test1: number
  input1: number
  test2: number
  input2: number
}

export async function run(runFirstPart, runSecondPart, answers: Answers) {
  try {
    const inputLines = readFile('./input.txt')
    const test1Lines = readFile('./test1.txt')
    const test2Lines = readFile('./test2.txt')

    const test1result = runFirstPart(test1Lines, answers)
    printResult('test1', test1result, answers)

    const input1result = runFirstPart(inputLines, answers)
    printResult('input1', input1result, answers)

    const test2result = runSecondPart(test2Lines, answers)
    printResult('test2', test2result, answers)

    const input2result = runSecondPart(inputLines, answers)
    printResult('input2', input2result, answers)
  } catch (error) {
    if (error.message !== 'FAIL') {
      console.log(error)
    }
  }
}

function printResult(key: keyof Answers, value: number, answers: Answers) {
  const expected = answers[key]
  const ok = value === expected

  if (ok) {
    console.log(key, 'OK', value)
  } else {
    console.log(key, 'FAIL', value, 'should be:', expected)

    throw new Error('FAIL')
  }
}
