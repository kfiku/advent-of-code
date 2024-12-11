import { readFile } from './files'

export interface Answers {
  test1: number
  input1: number
  test2: number
  input2: number
}

export async function run(runFirstPart, runSecondPart, answers: Answers) {
  try {
    const input = readFile('./input.txt')
    const testInput = readFile('./test.txt')
    let startTime = 0

    startTime = performance.now()
    const test1result = runFirstPart(testInput, answers)
    printResult('test1', test1result, answers, startTime)

    startTime = performance.now()
    const input1result = runFirstPart(input, answers)
    printResult('input1', input1result, answers, startTime)

    startTime = performance.now()
    const test2result = runSecondPart(testInput, answers)
    printResult('test2', test2result, answers, startTime)

    startTime = performance.now()
    const input2result = runSecondPart(input, answers)
    printResult('input2', input2result, answers, startTime)

    console.log('-----')
  } catch (error) {
    if (error.message !== 'FAIL') {
      console.log(error)
    }
  }
}

function printResult(key: keyof Answers, value: number, answers: Answers, startTime: number) {
  const expected = answers[key]
  const ok = value === expected
  const time = ((performance.now() - startTime) / 1000).toFixed(6) + 's'

  if (ok) {
    console.log(key, 'OK', value, time)
  } else {
    console.log(key, 'FAIL', value, 'should be:', expected, time)

    throw new Error('FAIL')
  }
}
