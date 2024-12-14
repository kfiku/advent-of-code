export type Pos = [number, number]
export type Matrix<T = string> = T[][]
export type NumMatrix = Matrix<number>

export const directions: Pos[] = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
]

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

export function printMatrix(pos: Pos, points: Map<string, number | string>) {
  const matrix = generateMatrix(pos, points)

  console.log(matrix.join('\n'))
}

export function generateMatrix([mx, my]: Pos, points: Map<string, string | number>) {
  const lines: string[] = []
  for (let y = 0; y < my; y++) {
    let line = ''

    for (let x = 0; x < mx; x++) {
      const point = points.get(posKey([x, y]))
      line += point ? point : ' '
    }

    lines.push(line)
  }

  return lines
}
