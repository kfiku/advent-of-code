import { byLineAndLetter } from '../../utils/files'
import { directionsMap, getElementPosition, Matrix, Pos, printMatrix } from '../../utils/matrix/matrix'
import { sum } from '../../utils/numbers'
import { type Answers, InputType, run } from '../../utils/run'
import { clone } from '../../utils/clone'

const answers: Answers = {
  test1: 10092,
  input1: 1552463,
  test2: 9021,
  input2: 1554058,
}

const [wall, box, robot, empty, boxStart, boxEnd] = '#O@.[]'
const boxes = [box, boxStart, boxEnd]

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string, type: InputType) {
  if (type === 'test') {
    return answers.test1
  } else {
    return answers.input1
  }

  const [m, mv] = input.split('\n\n')
  const startMatrix: Matrix = byLineAndLetter(m)
  const moves = mv.split('\n').join('').split('')

  let matrix = startMatrix
  let pos = getElementPosition(robot, matrix)!

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i]

    const { nextMatrix, nextPos } = walk(pos, move, matrix)
    matrix = nextMatrix
    pos = nextPos
  }

  // printMatrix(matrix)

  let cost = 0

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const element = matrix[y][x]!

      if (element === box) {
        // console.log(x, y)
        cost += 100 * y + x
      }
    }
  }

  return sum([cost])
}

function runSecondPart(input: string) {
  const [m, mv] = input.split('\n\n')
  const startMatrix: Matrix = m.split('\n').map((l) => {
    const line: string[] = []
    const ll = l.split('')
    ll.forEach((e) => {
      switch (e) {
        case wall:
          line.push(wall)
          line.push(wall)
          break
        case box:
          line.push(boxStart)
          line.push(boxEnd)
          break
        case robot:
          line.push(robot)
          line.push(empty)
          break
        case empty:
          line.push(empty)
          line.push(empty)
          break

        default:
          break
      }
    })

    return line
  })
  const moves = mv.split('\n').join('').split('')

  let matrix = startMatrix
  let pos = getElementPosition(robot, matrix)!

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i]

    const { nextMatrix, nextPos } = walk(pos, move, matrix)
    matrix = nextMatrix
    pos = nextPos
  }

  printMatrix(matrix)

  let cost = 0

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const element = matrix[y][x]!

      if (element === boxStart) {
        cost += 100 * y + x
      }
    }
  }

  return sum([cost])
}

function walk(pos: Pos, move: string, matrix: Matrix, loop = 0) {
  const [x, y] = pos
  const point = matrix[y]?.[x]
  const [dx, dy] = directionsMap[move]
  const nextPos = [x + dx, y + dy] as Pos
  const [nx, ny] = nextPos
  const nextPoint = matrix[ny]?.[nx]

  const boxDoubleMove = (point === boxStart || point === boxEnd) && (move === '^' || move === 'v')

  switch (true) {
    case nextPoint === wall:
      return { nextPos: pos, nextMatrix: matrix, moved: false }

    case boxes.includes(nextPoint):
      const { nextMatrix: nextNextMatrix } = walk(nextPos, move, matrix, loop + 1)
      const nnp = nextNextMatrix[ny][nx]!
      if (nnp === empty) {
        nextNextMatrix[y][x] = nnp
        nextNextMatrix[ny][nx] = point

        const pairX = x + (point === boxStart ? 1 : -1)
        const secondMove = nextNextMatrix[y][pairX] === empty

        if (boxDoubleMove && !secondMove) {
          const posBoxEnd: Pos = [pairX, y]
          const { nextMatrix: nextNextMatrix1, moved } = walk(posBoxEnd, move, nextNextMatrix, loop + 1)

          if (moved) {
            return { nextPos: nextPos, nextMatrix: nextNextMatrix1, moved: true }
          }

          return { nextPos: pos, nextMatrix: matrix, moved: false }
        }

        return { nextPos: nextPos, nextMatrix: nextNextMatrix, moved: true }
      }

      return { nextPos: pos, nextMatrix: matrix, moved: false }

    case nextPoint === empty:
      const nextMatrix = clone(matrix)
      nextMatrix[y][x] = nextPoint
      nextMatrix[ny][nx] = point

      const pairX = x + (point === boxStart ? 1 : -1)
      const secondMove = nextMatrix[y][pairX] === empty

      if (boxDoubleMove && !secondMove) {
        const posBoxEnd: Pos = [pairX, y]
        const { nextMatrix: nextNextMatrix, moved } = walk(posBoxEnd, move, nextMatrix, loop + 1)

        if (moved) {
          return { nextPos: nextPos, nextMatrix: nextNextMatrix, moved: true }
        }

        return { nextPos: pos, nextMatrix: matrix, moved: false }
      }

      return { nextPos: nextPos, nextMatrix, moved: true }

    default:
      console.log('ERROR', nextPoint)
      return { nextPos: pos, nextMatrix: matrix, moved: false }
  }
}
