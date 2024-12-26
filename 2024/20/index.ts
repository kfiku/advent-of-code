import { byLineAndLetter } from '../../utils/files'
import { aStarSearch, Node } from '../../utils/matrix/aStar'
import { getElementPosition, Matrix, Pos, posKey } from '../../utils/matrix/matrix'
import { type Answers, InputType, run } from '../../utils/run'

const answers: Answers = {
  test1: 1,
  input1: 1452,
  test2: 7,
  input2: 999556,
}

run(runFirstPart, runSecondPart, answers)

type NP = {
  position: number
  pos: Pos
}

function runFirstPart(input: string, type: InputType) {
  const { path, numberedPoints } = parseInput(input)
  const minSaves = type === 'test' ? 60 : 100

  const hits: number[] = []
  path.forEach(([x, y]) => {
    const position = numberedPoints.get(posKey([x, y]))!.position
    const up = (numberedPoints.get(posKey([x, y - 2]))?.position || position) - position - 2
    const down = (numberedPoints.get(posKey([x, y + 2]))?.position || position) - position - 2
    const left = (numberedPoints.get(posKey([x - 2, y]))?.position || position) - position - 2
    const right = (numberedPoints.get(posKey([x + 2, y]))?.position || position) - position - 2

    if (up >= minSaves) hits.push(up)
    if (down >= minSaves) hits.push(down)
    if (left >= minSaves) hits.push(left)
    if (right >= minSaves) hits.push(right)
  })

  return hits.length
}

function runSecondPart(input: string, type: InputType) {
  const { path, numberedPoints } = parseInput(input)
  const minSaves = type === 'test' ? 74 : 100
  const maxDistance = 20

  const hits: number[] = []
  path.forEach(([x, y]) => {
    const position = numberedPoints.get(posKey([x, y]))!.position

    path.forEach(([px, py]) => {
      const distance = Math.abs(x - px) + Math.abs(y - py)

      if (distance <= maxDistance) {
        const nextPosition = numberedPoints.get(posKey([px, py]))!.position
        const save = nextPosition - position - distance

        if (save >= minSaves) {
          hits.push(save)
        }
      }
    })
  })

  return hits.length
}

function parseInput(input: string) {
  const originalMatrix: Matrix = byLineAndLetter(input)
  const startPos = getElementPosition('S', originalMatrix)!
  const endPos = getElementPosition('E', originalMatrix)!
  const matrix: Matrix = originalMatrix.map((line) => line.map((point) => (point === '#' ? '#' : '.')))
  const startNode = new Node(startPos[0], startPos[1])
  const targetNode = new Node(endPos[0], endPos[1])
  const path = aStarSearch(startNode, targetNode, matrix)!
  const numberedPoints = new Map<string, NP>()

  path.forEach((pos, index) => {
    numberedPoints.set(posKey(pos), { position: index, pos })
  })

  return { path, numberedPoints }
}
