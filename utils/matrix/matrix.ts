export type Pos = [number, number]
export type Matrix<T = string> = T[][]
export type NumMatrix = Matrix<number>

export const directions: Pos[] = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
]

export const directionsMap = {
  '^': directions[0],
  '>': directions[1],
  v: directions[2],
  '<': directions[3],
}

const directionsMapEntries = Object.entries(directionsMap)

export function getDirectionSymbol([dx, dy]: Pos) {
  const entry = directionsMapEntries.find(([, d]) => dx === d[0] && dy === d[1])!

  return entry[0]
}

export const directionsRotationMap = {
  '^': ['<', '>'],
  '>': ['^', 'v'],
  v: ['<', '>'],
  '<': ['^', 'v'],
}

export const directionsPlus: Pos[] = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
  [1, 1],
  [-1, -1],
  [-1, 1],
  [1, -1],
]

export function posKey([x, y]: Pos) {
  return `${x}.${y}`
}

export function getFromMatrix(matrix: Matrix, [x, y]: Pos) {
  return matrix[y]?.[x]
}

export function printMatrix(matrix: (string | number)[][]) {
  console.log(
    matrix
      .filter(Boolean)
      .map((l) => l.join(''))
      .join('\n'),
  )
}

export function printMatrixFromMap(pos: Pos, points: Map<string, number | string>) {
  const mp2 = generateMatrix(pos, points)

  printMatrix(mp2)
}

export function generateMatrix([mx, my]: Pos, points: Map<string, string | number>, empty = ' ') {
  const lines: (string | number)[][] = []
  for (let y = 0; y < my; y++) {
    let line: (string | number)[] = []

    for (let x = 0; x < mx; x++) {
      const point = points.get(posKey([x, y]))
      line.push(point ? point : empty)
    }

    lines.push(line)
  }

  return lines
}

export function getElementPosition(search: string, matrix: Matrix) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y]?.length || 0; x++) {
      const element = matrix[y]?.[x]

      if (element === search) {
        return [x, y] as Pos
      }
    }
  }
}

export function matrixToPosMap(matrix: Matrix) {
  const map = new Map<string, Pos>()

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y]?.length || 0; x++) {
      const element = matrix[y]?.[x]

      map.set(element, [x, y])
    }
  }

  return map
}
