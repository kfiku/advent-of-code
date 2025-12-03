import { byLine } from '../../utils/files'
import { sum } from '../../utils/numbers'
import { type Answers, InputType, run } from '../../utils/run'

const answers: Answers = {
  test1: 357,
  input1: 17430,
  test2: 3121910778619,
  input2: 171975854269367,
}

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string, type: InputType) {
  const lines = byLine(input)

  const bank = [0]

  for (let l = 0; l < lines.length; l++) {
    const line = lines[l]

    let first = 0
    let firstIndex = 0
    let second = 0

    for (let i = 0; i < line.length - 1; i++) {
      const n = +line[i]

      if (n > first) {
        firstIndex = i
        first = n
      }

      if (first === 9) {
        break
      }
    }

    for (let i = firstIndex + 1; i < line.length; i++) {
      const n = +line[i]

      if (n > second) {
        second = n
      }

      if (second === 9) {
        break
      }
    }

    bank.push(first * 10 + second)
  }

  return sum(bank)
}

function runSecondPart(input: string, type: InputType) {
  const lines = byLine(input)

  const bank = [0]

  for (let l = 0; l < lines.length; l++) {
    const line = lines[l]

    let numberCount = 12
    let num = ''
    let startPos = 0

    while (numberCount--) {
      let current = 0
      for (let i = startPos; i < line.length - numberCount; i++) {
        const n = +line[i]

        if (n > current) {
          current = n
          startPos = i + 1
        }

        if (current === 9) {
          break
        }
      }

      num += current
    }

    bank.push(+num)
  }

  return sum(bank)
}
