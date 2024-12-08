import { byLineAndLetter } from '../../utils/files'
import { getFromMatrix, Matrix, Pos, posKey } from '../../utils/matrix/matrix'
import { sum } from '../../utils/numbers'
import { type Answers, run } from '../../utils/run'

const answers: Answers = {
  test1: 14,
  input1: 364,
  test2: 34,
  input2: 1231,
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
    getAntinodePlus(a, matrix, antinode)
  })

  const antennasSize = sum(Object.values(antennas).map((a) => a.length))

  return sum([antinode.size, antennasSize])
}

function getAntinodePlus(antennas: Pos[], matrix: Matrix, antinode: Map<string, Pos>) {
  const maxX = matrix[0].length - 1
  const maxY = matrix.length - 1
  for (let i = 0; i < antennas.length; i++) {
    const [ax, ay] = antennas[i]
    for (let j = i + 1; j < antennas.length; j++) {
      const [bx, by] = antennas[j]
      const dx = bx - ax
      const dy = by - ay

      let aapx = ax
      let aapy = ay
      while (aapx >= 0 && aapx <= maxX && aapy >= 0 && aapy <= maxY) {
        aapx = aapx - dx
        aapy = aapy - dy
        const aap = [aapx, aapy] as Pos
        const aa = getFromMatrix(matrix, aap)
        if (aa === '.') antinode.set(posKey(aap), aap)
      }

      let bapx = bx
      let bapy = by
      while (bapx >= 0 && bapx <= maxX && bapy >= 0 && bapy <= maxY) {
        bapx = bapx + dx
        bapy = bapy + dy
        const bap = [bapx, bapy] as Pos
        const ba = getFromMatrix(matrix, bap)
        if (ba === '.') antinode.set(posKey(bap), bap)
      }
    }
  }
}
