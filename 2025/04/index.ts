import { byLine } from '../../utils/files'
import { sum } from '../../utils/numbers'
import { type Answers, InputType, run } from '../../utils/run'

const answers: Answers = {
  test1: 13,
  input1: 1549,
  test2: 43,
  input2: 8887,
}

type Pos = [number, number]
type Grid = string[]

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string, type: InputType) {
  const lines = byLine(input)

  const rollToAccess = findRollsToAccess(lines)

  return sum([rollToAccess.length])
}

function runSecondPart(input: string, type: InputType) {
  const lines = byLine(input)

  let grid = lines

  let rollToAccess = findRollsToAccess(grid)
  let sumOfRollsToAccess = rollToAccess.length

  while (rollToAccess.length > 0) {
    grid = updateGrid(rollToAccess, '.', grid)
    rollToAccess = findRollsToAccess(grid)

    sumOfRollsToAccess += rollToAccess.length
  }

  return sum([sumOfRollsToAccess])
}

function findRollsToAccess(lines: Grid) {
  let rollToAccess: Pos[] = []

  for (let y = 0; y < lines.length; y++) {
    const line = lines[y]
    for (let x = 0; x < line.length; x++) {
      const point = line[x]

      if (point === '@') {
        const closest = countClosest([x, y], '@', lines)

        if (closest.length < 4) {
          rollToAccess.push([x, y] as Pos)
        }
      }
    }
  }

  return rollToAccess
}

function countClosest(pos: Pos, el: string, grid: Grid) {
  const maxX = grid[0].length - 1
  const maxY = grid.length - 1

  const [x, y] = pos

  const elements: Pos[] = [
    [x - 1, y - 1] satisfies Pos,
    [x, y - 1] satisfies Pos,
    [x + 1, y - 1] satisfies Pos,
    //
    [x - 1, y] satisfies Pos,
    // [x, y],
    [x + 1, y] satisfies Pos,
    //
    [x - 1, y + 1] satisfies Pos,
    [x, y + 1] satisfies Pos,
    [x + 1, y + 1] satisfies Pos,
  ]
    .filter(([x, y]) => x >= 0 && x <= maxX && y >= 0 && y <= maxY)
    .filter(([x, y]) => grid[y][x] === el)

  return elements
}

function updateGrid(poses: Pos[], toEl: string, grid: Grid) {
  const newGrid: Grid = [...grid]
  for (const [x, y] of poses) {
    const line = newGrid[y].split('')

    line[x] = toEl
    newGrid[y] = line.join('')
  }

  return newGrid
}

function printGrid(grid: Grid) {
  console.log(grid.map((g) => g).join('\n'))
}
