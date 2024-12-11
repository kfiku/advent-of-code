import { cachedFn } from '../../utils/fn'
import { sum } from '../../utils/numbers'
import { type Answers, run } from '../../utils/run'

const answers: Answers = {
  test1: 55312,
  input1: 185205,
  test2: 65601038650482,
  input2: 221280540398419,
}

const cachedCountOne = cachedFn(countOne)

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string) {
  const stones = withCache(input, 25)

  return sum(stones)
}

function runSecondPart(input: string) {
  const stones = withCache(input, 75)

  return sum(stones)
}

function withCache(input: string, blinks: number) {
  const stones = input.split(' ').map((s) => +s)
  return stones.map((s) => cachedCountOne(s, blinks))
}

function countOne(s: number, blinks: number) {
  let count = 1

  for (let i = 0; i < blinks; i++) {
    const ss = s.toString()

    if (s === 0) {
      count = cachedCountOne(1, blinks - 1)
    } else if (ss.length % 2 === 0) {
      count = cachedCountOne(+ss.substring(0, ss.length / 2), blinks - 1)
      count += cachedCountOne(+ss.substring(ss.length / 2, ss.length), blinks - 1)
    } else {
      count = cachedCountOne(s * 2024, blinks - 1)
    }
  }

  return count
}
