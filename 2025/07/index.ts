import { byLine } from '../../utils/files'
import { sum } from '../../utils/numbers'
import { type Answers, InputType, run } from '../../utils/run'

const answers: Answers = {
  test1: 21,
  input1: 1662,
  test2: 40,
  input2: 40941112789504,
}

type Pos = [number, number]
type Grid = string[]

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string, type: InputType) {
  const grid: Grid = byLine(input)
  const startPos = grid[0].indexOf('S')

  const splitters = countSplits([startPos, 1], grid)

  return sum([splitters.size])
}

function countSplits([sx, sy]: Pos, grid: Grid, splitters = new Set<string>()) {
  let x = sx

  for (let y = sy; y < grid.length; y++) {
    const element = grid[y][x]
    const key = `${x}/${y}`

    if (element === '^') {
      if (!splitters.has(key)) {
        splitters.add(key)
        countSplits([x + 1, y + 2], grid, splitters)
        countSplits([x - 1, y + 2], grid, splitters)
      }

      break
    }
  }

  return splitters
}

function runSecondPart(input: string, type: InputType) {
  const grid = byLine(input)
  const startPos = grid[0].indexOf('S')

  const timelines = countTimelines([startPos, 1], grid)

  return sum([timelines])
}

const cache = new Map<string, number>()
function countTimelines([sx, sy]: Pos, grid: Grid, timelines = 1) {
  let x = sx
  let y = sy
  let key = `${x}/${y}`

  for (y = sy; y < grid.length; y++) {
    const element = grid[y][x]

    if (element === '^') {
      key = `${x}/${y}`
      const cacheVal = cache.get(key)

      if (!cacheVal) {
        timelines += 1
        timelines += countTimelines([x + 1, y + 2], grid, 0)
        timelines += countTimelines([x - 1, y + 2], grid, 0)
      } else {
        timelines += cacheVal
      }

      break
    }
  }

  cache.set(`${x}/${y}`, timelines)

  return timelines
}
