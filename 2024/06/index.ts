import { byLineAndLetter } from '../../utils/files'
import { sum } from '../../utils/numbers'
import { type Answers, run } from '../../utils/run'
import { Pos, Matrix, posKey, directions } from '../../utils/matrix/matrix'

const answers: Answers = {
  test1: 41,
  input1: 4696,
  test2: 6,
  input2: 1443,
}

const emptySpace = '.'
const obstruction = '#'
const guard = '^'

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string) {
  const matrix = byLineAndLetter(input)
  const pos = getGuardPosition(matrix)!
  const history = walk(pos, 0, matrix)!

  return sum([history.size])
}

function runSecondPart(input: string) {
  const matrix = byLineAndLetter(input)
  const startPos = getGuardPosition(matrix)!

  const history = walk(startPos, 0, matrix)!
  const loops = [...history.values()].filter(({ pos }) => {
    const newMatrix = updateMatrix(matrix, pos, obstruction)
    const loop = isLoop(startPos, 0, newMatrix)

    return loop
  })

  return sum([loops.length])
}

function isLoop(pos: Pos, dirId: number, matrix: Matrix) {
  const history = walk(pos, dirId, matrix, new Map())

  return history === undefined
}

function walk(pos: Pos, dirId: number, matrix: Matrix, history = new Map()) {
  const [x, y] = pos
  const [dx, dy] = directions[dirId]
  const nextPos = [x + dx, y + dy] as Pos
  const [nx, ny] = nextPos
  const nextPoint = matrix[ny]?.[nx]
  const historyKey = posKey(pos)

  if (!nextPoint) {
    history.set(historyKey, { dirId, pos })

    return history
  }

  if (nextPoint === emptySpace || nextPoint === guard) {
    if (history.get(historyKey)?.dirId === dirId) {
      return undefined
    }

    history.set(historyKey, { dirId, pos })

    return walk(nextPos, dirId, matrix, history)
  }

  if (nextPoint === obstruction) {
    const nextDirId = (dirId + 1) % directions.length

    return walk(pos, nextDirId, matrix, history)
  }
}

function getGuardPosition(matrix: Matrix) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const element = matrix[y]?.[x]

      if (element === guard) {
        return [x, y] as Pos
      }
    }
  }
}

function updateMatrix(matrix: Matrix, [x, y]: Pos, string: string) {
  const newMatrix = JSON.parse(JSON.stringify(matrix))
  newMatrix[y][x] = string

  return newMatrix
}
