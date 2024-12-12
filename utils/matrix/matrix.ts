export type Pos = [number, number]
export type Matrix<T = string> = T[][]
export type NumMatrix = Matrix<number>

export const directions: Pos[] = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
]

export function posKey([x, y]: Pos) {
  return `${x}.${y}`
}

export function getFromMatrix(matrix: Matrix, [x, y]: Pos) {
  return matrix[y]?.[x]
}

export function printMatrix(matrix: Matrix) {
  console.log(matrix.map((l) => l.join('')).join('\n'))
}
