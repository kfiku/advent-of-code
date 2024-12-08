export type Pos = [number, number]
export type Matrix = string[][]

export function posKey([x, y]: Pos) {
  return `${x}.${y}`
}

export function getFromMatrix(matrix: Matrix, [x, y]: Pos) {
  return matrix[y]?.[x]
}

export function printMatrix(matrix: Matrix) {
  console.log(matrix.map((l) => l.join('')).join('\n'))
}
