import { byLineAndLetter } from '../../utils/files'
import { NumMatrix, Pos, posKey } from '../../utils/matrix/matrix'
import { sum } from '../../utils/numbers'
import { type Answers, run } from '../../utils/run'

const answers: Answers = {
  test1: 36,
  input1: 746,
  test2: 81,
  input2: 1541,
}

const directions: Pos[] = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
]

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string) {
  const { startingPoints, matrix } = parseInput(input)

  const trails: number[] = []
  for (let i = 0; i < startingPoints.length; i++) {
    const nines = new Map()

    walk(startingPoints[i]!, matrix, nines)

    trails.push(nines.size)
  }

  return sum(trails)
}

function runSecondPart(input: string) {
  const { startingPoints, matrix } = parseInput(input)

  const trails: number[] = []
  for (let i = 0; i < startingPoints.length; i++) {
    const nines = new Map()

    walk(startingPoints[i]!, matrix, nines)

    trails.push(sum([...nines.values()]))
  }

  return sum(trails)
}

function parseInput(input: string) {
  const matrix: NumMatrix = byLineAndLetter(input).map((l) => l.map((h) => +h))
  const startingPoints = matrix
    .flatMap((l, y) =>
      l.map((h, x) => {
        if (h === 0) {
          return [x, y] as Pos
        }
      }),
    )
    .filter(Boolean) as Pos[]
  return { startingPoints, matrix }
}

function walk(pos: Pos, matrix: NumMatrix, nines = new Map()) {
  const [x, y] = pos
  const point = matrix[y]?.[x]!

  for (let d = 0; d < directions.length; d++) {
    const [dx, dy] = directions[d]
    const nextPos = [x + dx, y + dy] as Pos
    const [nx, ny] = nextPos
    const nextPoint = matrix[ny]?.[nx]!

    if (nextPoint === point + 1) {
      if (nextPoint === 9) {
        const key = posKey(nextPos)
        const currentScore = nines.get(key) + 1 || 1

        nines.set(posKey(nextPos), currentScore)
      }

      walk(nextPos, matrix, nines)
    }
  }
}
