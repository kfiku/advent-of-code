import { readFile } from './files'

export interface Answers {
  test1: number | string | bigint
  input1: number | string | bigint
  test2: number | string | bigint
  input2: number | string | bigint
}

export type InputType = 'test' | 'input'

export async function run(runFirstPart, runSecondPart, answers: Answers) {
  try {
    const input = readFile('./input.txt')
    const testInput = readFile('./test.txt')
    let startTime = 0

    startTime = performance.now()
    const test1result = await runFirstPart(testInput, 'test')
    printResult('test1', test1result, answers, startTime)

    startTime = performance.now()
    const input1result = await runFirstPart(input, 'input')
    printResult('input1', input1result, answers, startTime)

    startTime = performance.now()
    const test2result = await runSecondPart(testInput, 'test')
    printResult('test2', test2result, answers, startTime)

    startTime = performance.now()
    const input2result = await runSecondPart(input, 'input')
    printResult('input2', input2result, answers, startTime)

    console.log('-----')
  } catch (error) {
    if (error.message !== 'FAIL') {
      console.log(error)
    }
  }
}

function printResult(key: keyof Answers, value: number | string, answers: Answers, startTime: number) {
  const expected = answers[key]
  const ok = value === expected
  const time = ((performance.now() - startTime) / 1000).toFixed(4) + 's'

  if (ok) {
    log(key, `✓ ${value}`, time)
  } else {
    log(key, `x ${value} (OK: ${expected})`, time)

    throw new Error('FAIL')
  }
}

function log(key: string, result: number | string, time: string) {
  console.log(key.padStart(6) + '\t', result.toString().padEnd(15) + '\t', time + '\t')
}

// 1662    0.0031s
