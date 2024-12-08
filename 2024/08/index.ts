import { byLine, byLineAndLetter } from '../../utils/files'
import { getFromMatrix, Matrix, Pos, posKey } from '../../utils/matrix/matrix'
import { sum } from '../../utils/numbers'
import { type Answers, run } from '../../utils/run'

const answers: Answers = {
  test1: 14,
  input1: 364,
  test2: 34,
  input2: 0,
}

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string) {
  const matrix = byLineAndLetter(input)
  const antennas: Record<string, Pos[]> = {}
  const antinode = new Map<string, Pos>()
  matrix.forEach((l, y) => {
    return l.forEach((a, x) => {
      if (a !== '.') {
        if (!antennas[a]) {
          antennas[a] = []
        }

        antennas[a].push([x, y])
      }
    })
  })

  Object.values(antennas).forEach((a) => {
    getAntinode(a, matrix, antinode)
  })

  return sum([antinode.size])
}

function getAntinode(antennas: Pos[], matrix: Matrix, antinode: Map<string, Pos>) {
  for (let i = 0; i < antennas.length; i++) {
    const [ax, ay] = antennas[i]
    for (let j = i + 1; j < antennas.length; j++) {
      const [bx, by] = antennas[j]
      const dx = bx - ax
      const dy = by - ay

      const aap = [ax - dx, ay - dy] as Pos
      const bap = [bx + dx, by + dy] as Pos
      const aa = getFromMatrix(matrix, aap)
      const ba = getFromMatrix(matrix, bap)

      if (aa) antinode.set(posKey(aap), aap)
      if (ba) antinode.set(posKey(bap), bap)
    }
  }
}

function runSecondPart(input: string) {
  const lints = byLine(input)

  return sum([lints.length])
}
