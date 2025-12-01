import { byLine } from '../../utils/files'
import { sum } from '../../utils/numbers'
import { type Answers, InputType, run } from '../../utils/run'

const answers: Answers = {
  test1: 3,
  input1: 1021,
  test2: 6,
  input2: 0,
}

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string, type: InputType) {
  const lines = byLine(input)
  const start = 50

  let pos = start
  let zeros = 0

  for (const l of lines) {
    const direction = l[0] === 'L' ? -1 : 1
    const times = Number(l.slice(1))

    pos = pos + times * direction

    while (pos > 99) {
      pos = pos - 100
    }

    while (pos < 0) {
      pos = pos + 100
    }

    if (pos === 0) {
      zeros++
      continue
    }
  }

  return sum([zeros])
}

function runSecondPart(input: string, type: InputType) {
  const lines = byLine(input)

  const start = 50

  let pos = start
  let zeros = 0

  for (const l of lines) {
    const direction = l[0] === 'L' ? -1 : 1
    let times = Number(l.slice(1))

    while (times--) {
      pos += direction

      if (pos === 100) {
        pos = 0
      }

      if (pos === -1) {
        pos = 99
      }

      if (pos === 0) {
        zeros++
      }
    }
  }

  return sum([zeros])
}
