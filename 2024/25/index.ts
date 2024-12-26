import { byLine } from '../../utils/files'
import { sum } from '../../utils/numbers'
import { type Answers, InputType, run } from '../../utils/run'

const answers: Answers = {
  test1: 3,
  input1: 0,
  test2: 0,
  input2: 0,
}

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string, type: InputType) {
  const locks: number[][] = []
  const keys: number[][] = []
  input.split('\n\n').forEach((e) => {
    const lines = e.split('\n')
    const schema: number[] = []

    for (let x = 0; x < lines[0].length; x++) {
      let height = 0

      for (let y = 0; y < lines.length; y++) {
        if (lines[y][x] === '#') {
          height++
        }
      }

      schema.push(height - 1)
    }

    if (lines[0] === '#####') {
      locks.push(schema)
    } else if (lines[6] === '#####') {
      keys.push(schema)
    } else {
      throw new Error('unknown schema')
    }
  })

  let fits = 0

  for (let lockIndex = 0; lockIndex < locks.length; lockIndex++) {
    const lock = locks[lockIndex]

    for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
      const key = keys[keyIndex]

      const fit = lock.filter((v, i) => v + key[i] <= 5).length === 5
      if (fit) {
        fits++
      }
    }
  }

  return fits
}

function runSecondPart(input: string, type: InputType) {
  const lints = byLine(input)

  return sum([lints.length])
}
