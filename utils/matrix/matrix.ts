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
  console.log(matrix.map((l) => l.join('')).join('\n'))
}

export function printMatrixFromMap(pos: Pos, points: Map<string, number | string>) {
  const mp2 = generateMatrix(pos, points)

  printMatrix(mp2)
}

function generateMatrix([mx, my]: Pos, points: Map<string, string | number>) {
  const lines: (string | number)[][] = []
  for (let y = 0; y < my; y++) {
    let line: (string | number)[] = []

    for (let x = 0; x < mx; x++) {
      const point = points.get(posKey([x, y]))
      line.push(point ? point : ' ')
    }

    lines.push(line)
  }

  return lines
}

export function getElementPosition(search: string, matrix: Matrix) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const element = matrix[y]?.[x]

      if (element === search) {
        return [x, y] as Pos
      }
    }
  }
}
