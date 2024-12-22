import { byLine } from '../../utils/files'
import { sum, sumBigInt } from '../../utils/numbers'
import { type Answers, InputType, run } from '../../utils/run'

const answers: Answers = {
  test1: 37327623n,
  input1: 13461553007n,
  test2: 23,
  input2: 1499,
}

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string, type: InputType) {
  const lines = byLine(input)

  const results: bigint[] = []
  for (let i = 0; i < lines.length; i++) {
    let v = BigInt(lines[i])
    for (let index = 0; index < 2000; index++) {
      v = process(v)
    }

    results.push(v)
  }

  return sumBigInt(results)
}

function runSecondPart(input: string, type: InputType) {
  const lines = type === 'test' ? [1, 2, 3, 2024] : byLine(input)
  const sequences = new Map<string, Record<number, number>>()

  for (let i = 0; i < lines.length; i++) {
    let v = BigInt(lines[i])
    let prev = 0
    let diff = 0
    let diffs: (number | null)[] = []

    for (let index = 0; index < 2000; index++) {
      v = process(v)

      const price: number = Number(v % 10n)
      diff = price - prev
      prev = price
      if (index > 3) {
        const key = diffs[index - 3] + ',' + diffs[index - 2] + ',' + diffs[index - 1] + ',' + diff

        const current = sequences.get(key) || {
          [i]: 0,
        }

        current[i] = current[i] || price

        sequences.set(key, current)
      }

      if (index !== 0) {
        diffs.push(diff)
      } else {
        diffs.push(null)
      }
    }
  }

  const bestPrices = [...sequences.values()]
    .map((s) =>
      Object.values(s).reduce((acc, curr) => {
        return acc + curr
      }, 0),
    )
    .sort((a, b) => b - a)

  return bestPrices[0]
}

function process(num: bigint) {
  let v1 = ((num * 64n) ^ num) % 16777216n
  let v2 = ((v1 / 32n) ^ v1) % 16777216n
  let v3 = ((v2 * 2048n) ^ v2) % 16777216n

  return v3
}
