import { byLine } from '../../utils/files'
import { sum } from '../../utils/numbers'
import { type Answers, InputType, run } from '../../utils/run'

const answers: Answers = {
  test1: 3,
  input1: 694,
  test2: 14,
  input2: 352716206375547,
}

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string, type: InputType) {
  const [rangesS, ingredientsS] = input.split('\n\n')
  const ranges = byLine(rangesS).map((r) => r.split('-').map((r) => +r))
  const ingredients = byLine(ingredientsS).map((i) => +i)

  const freshIngredients = ingredients.filter((i) => ranges.some(([from, to]) => i >= from && i <= to))

  return sum([freshIngredients.length])
}

function runSecondPart(input: string, type: InputType) {
  const [rangesS] = input.split('\n\n')
  const ranges = byLine(rangesS).map((r) => r.split('-').map((r) => +r))
  const ranges2 = []

  for (let i = 0; i < ranges.length; i++) {
    let [from, to] = ranges[i]

    for (let j = 0; j < ranges2.length; j++) {
      const [from2, to2] = ranges2[j]

      if (from2 >= from && to2 <= to) {
        ranges2[j] = [0, -1]
      } else {
        if (to >= from2 && from <= from2 && to < to2) {
          to = from2 - 1
        }

        if (from <= to2 && to >= to2) {
          from = to2 + 1
        }

        if (from2 <= from && to2 >= to) {
          from = 0
          to = 0

          break
        }
      }
    }

    if (from !== 0 && to !== 0) {
      ranges2.push([from, to])
    }
  }

  const all = ranges2.reduce((acc, [from, to]) => {
    return acc + (to - from + 1)
  }, 0)

  return sum([all])
}
