import { byLine, byLineAndLetter } from '../../utils/files'
import { sum } from '../../utils/numbers'
import { type Answers, run } from '../../utils/run'

const answers: Answers = {
  test1: 18,
  input1: 2493,
  test2: 9,
  input2: 1890,
}

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string) {
  const matrix = byLineAndLetter(input)
  const word = 'XMAS'
  const firstLetter = word[0]
  let find = 0

  for (let y = 0; y < matrix.length; y++) {
    const letters = matrix[y]

    for (let x = 0; x < letters.length; x++) {
      const letter = letters[x]

      if (letter === firstLetter) {
        find += findWord(word, matrix, x, y)
      }
    }
  }

  return sum([find])
}

function findWord(word, lines, x, y) {
  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ]
  let ok = false
  let find = 0

  for (let d = 0; d < directions.length; d++) {
    const [dx, dy] = directions[d]

    ok = false

    for (let index = 1; index < word.length; index++) {
      const letterToFind = word[index]
      const letterOnMatrix = lines[y + index * dy]?.[x + index * dx]

      ok = letterToFind === letterOnMatrix
      if (!ok) {
        break
      }
    }

    if (ok) {
      find++
    }
  }

  return find
}

function runSecondPart(input: string) {
  const matrix = byLineAndLetter(input)
  const word = 'MAS'
  const letterToFind = 'A'
  let find = 0

  for (let y = 0; y < matrix.length; y++) {
    const letters = matrix[y]

    for (let x = 0; x < letters.length; x++) {
      const letter = letters[x]

      if (letter === letterToFind) {
        find += findX(word, matrix, x, y)
      }
    }
  }

  return sum([find])
}

function findX(word, lines, x, y) {
  const directions = [
    [-1, -1, 1, 1],
    [1, 1, -1, -1],
    [1, -1, -1, 1],
    [-1, 1, 1, -1],
  ]

  let ok = false
  let find = 0

  for (let d = 0; d < directions.length; d++) {
    const [dx0, dy0, dx2, dy2] = directions[d]

    ok = false

    const l0 = word[0]
    const l2 = word[2]
    const lm0 = lines[y + 1 * dy0]?.[x + 1 * dx0]
    const lm2 = lines[y + 1 * dy2]?.[x + 1 * dx2]

    ok = l0 === lm0 && l2 === lm2

    if (ok) {
      find++
    }
  }

  return find == 2 ? 1 : 0
}
