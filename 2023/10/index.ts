import { printResults } from '../utils/utils.ts'
import { file, part, readFileLineByLine } from '../utils/bunUtils.ts'

async function run() {
  if (part === 1) {
    await readFileLineByLine(file, part1)
    const result = process1()

    printResults(6903, [result])
  } else {
    console.clear()
    await readFileLineByLine(file, part1)
    const result = process2()

    printResults(4, [result])
  }
}

// directions from left to right and from top to bottom
type Dir = [number[], number[], { left: number[][]; right: number[][] }]
const directions: Record<string, Dir> = {
  '-': [[-1, 0], [1, 0], { left: [[0, -1]], right: [[0, 1]] }],
  '7': [
    [-1, 0],
    [0, 1],
    {
      left: [
        [0, -1],
        [1, 0],
      ],
      right: [],
    },
  ],
  F: [
    [0, 1],
    [1, 0],
    {
      left: [
        [-1, 0],
        [0, -1],
      ],
      right: [],
    },
  ],
  J: [
    [0, -1],
    [-1, 0],
    {
      left: [
        [1, 0],
        [0, -1],
      ],
      right: [],
    },
  ],
  L: [
    [0, -1],
    [1, 0],
    {
      left: [],
      right: [
        [-1, 0],
        [0, -1],
      ],
    },
  ],
  S: [[0, 0], [0, 0], { left: [], right: [] }],
  '|': [[0, 1], [0, -1], { left: [[-1, 0]], right: [[1, 0]] }],
  '.': [[], [], { left: [], right: [] }],
}

const symbolDict = {
  '|': '│',
  '-': '─',
  F: '┌',
  L: '└',
  J: '┘',
  '7': '┐',
  S: 'S',
}

type Sym = keyof typeof directions

const startSymbol = 'S'
let currentPosition = [0, 0]
const maze: string[] = []

function part2(line: string) {
  maze.push(line)

  const y = dots.length
  const dotsLine = line
    .split('')
    .map((d, id) => {
      if (d === '.') {
        return [id, y]
      }
    })
    .filter(Boolean) as [number, number][]

  dots.push(dotsLine)
}

const dotsOnSide = {
  left: [],
  right: [],
}

function process2() {
  let i = 0
  let direction = getDirection(maze, currentPosition)
  console.log(maze)

  while (i < 200000) {
    const nextDir = walkMaze(maze, direction)

    if (!nextDir) {
      console.log('ERROR')
      return 0
    }

    const left = matchDir(reverseMove(nextDir.from), [nextDir.direction[0]])
    const [x, y] = nextDir.pos
    const sides = nextDir.direction[2]
    const dotsOnLeft = sides.left
      .map(([ax, ay]) => {
        const nextPos = [x + ax, y + ay]
        const p = getDirection(maze, nextPos)
        if (p.symbol === '.') {
          return [p.symbol, p.pos]
        }
      })
      .filter(Boolean)

    const dotsOnRight = sides.right
      .map(([ax, ay]) => {
        const nextPos = [x + ax, y + ay]
        const p = getDirection(maze, nextPos)
        if (p.symbol === '.') {
          return [p.symbol, p.pos]
        }
      })
      .filter(Boolean)

    console.log(dotsOnLeft, dotsOnRight)

    if (left) {
    }

    direction = nextDir

    i++

    if (direction.symbol === startSymbol) {
      console.log('end of maze')
      return i / 2
    }
  }

  return i
}

function part1(line: string) {
  const startPosition = line.indexOf(startSymbol)

  if (startPosition > -1) {
    currentPosition = [startPosition, maze.length]
  }

  maze.push(line)
}

function process1() {
  const size = getLoopSize(maze)

  return size
}

function getLoopSize(maze: string[]) {
  let i = 0
  let direction = getDirection(maze, currentPosition)

  while (i < 200000) {
    // printMaze(maze, direction.pos);
    // console.log('-----------------');
    const nextDir = walkMaze(maze, direction)

    if (!nextDir) {
      console.log('ERROR')
      return 0
    }

    direction = nextDir

    i++

    if (direction.symbol === startSymbol) {
      return i / 2
    }
  }

  return i
}

function walkMaze(maze: string[], direction: Direction) {
  if (direction.symbol === startSymbol) {
    return searchOptions(maze, direction)
  }

  const nextDir = getNextPos(maze, direction)

  if (isPointOnABorder(nextDir.pos)) {
    // console.log("BORDER", nextDir);
  }

  return nextDir
}

function getNextPos(maze: string[], dir: Direction) {
  const [x, y] = dir.pos
  const [rx, ry] = reverseMove(dir.from)
  const from = dir.direction.find(([x, y]) => x != rx || y != ry)!
  const [fx, fy] = from
  const nextPos = [x + fx, y + fy]

  const nextDir = getDirection(maze, nextPos, from)

  return nextDir
}

const aroundOptions: Point[] = [
  [0, -1], // top
  [1, 0], // right
  [0, 1], // bottom
  [-1, 0], // left
]
function searchOptions(maze: string[], dir: Direction) {
  const [x, y] = dir.pos
  let properSymbol = null
  let aroundId = 0

  while (!properSymbol) {
    const [ax, ay] = aroundOptions[aroundId]
    const nextPos = [x + ax, y + ay]
    const sym = getDirection(maze, nextPos, [ax, ay])

    if (validateMove(maze, dir.pos, nextPos)) {
      properSymbol = sym

      return sym
    }

    aroundId++

    if (aroundId > aroundOptions.length - 1) {
      return null
    }
  }

  return properSymbol
}

type Direction = ReturnType<typeof getDirection>

function getDirection(maze: string[], pos: number[], from: number[] = []) {
  const [x, y] = pos
  const symbol = maze[y]?.[x] as Sym
  const direction = directions[symbol]

  return { symbol, pos, direction, from }
}

function validateMove(maze: string[], fromPos: number[], toPos: number[]) {
  const toDir = getDirection(maze, toPos)

  if (!toDir.symbol || toDir.symbol === '.') {
    return false
  }

  const diff = [fromPos[0] - toPos[0], fromPos[1] - toPos[1]]
  const match = matchDir(diff, toDir.direction)

  return match
}

function matchDir(dir: number[], options: number[][]) {
  return options.some(([x, y]) => x === dir[0] && y === dir[1])
}

function reverseMove([x, y]: number[]) {
  return [x && x * -1, y && y * -1]
}

////

const dots: [number, number][][] = []
let flatDots: [number, number][] = []
const borderX = [0]
const borderY = [0]

const groupedDots: [number, number][][] = []

type Point = number[]

function walk(maze: string[], point: Point, from: Point, result: Point[] = []) {
  console.log('WALK', point, from, result)
  result.push(point)

  for (let i = 0; i < aroundOptions.length; i++) {
    const a = aroundOptions[i]

    if (from[0] === a[0] && from[1] === a[1]) {
      // console.log('skip from');
      continue
    }

    const nextPoint = [point[0] + a[0], point[1] + a[1]] as Point
    const isInMaze = isPointOnMaze(nextPoint)
    const isInResult = isPointInResults(nextPoint, result)
    const dir = getDirection(maze, nextPoint)
    if (!isInMaze || isInResult || dir.symbol !== '.') {
      // console.log('skip', nextPoint, { isInMaze, isInResult });
      continue
    }

    walk(maze, nextPoint, reverseMove(a), result)
  }

  return result
}

function isPointOnMaze([x, y]: Point) {
  return x >= borderX[0] && x <= borderX[1] && y >= borderY[0] && y <= borderY[1]
}

function isPointInResults([x, y]: Point, results: Point[]) {
  return results.some(([rx, ry]) => rx === x && ry === y)
}

const closer = [0, 1]
function addToGroup(dot: [number, number], groups: [number, number][][]) {
  const [x, y] = dot
  // console.log('CHECKING', dot);

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i]

    const isTouching = group.some(([gx, gy]) => {
      return closer.includes(Math.abs(gx - x)) && closer.includes(Math.abs(gy - y))
    })

    if (isTouching) {
      group.push(dot)
      return
    }
  }

  groups.push([dot])
}

function canPass(dir: Direction, from: number[]) {
  const m = matchDir(from, dir.direction)
  // console.log(dir.symbol, dir.direction, from, m);

  return m
}

function isPointOnABorder([x, y]: number[]) {
  return borderX.includes(x) || borderY.includes(y)
}

function printMaze(maze: string[], [x, y]: number[]) {
  const mazeToPrint = [...maze]
  const lineArr = mazeToPrint[y].split('')
  lineArr[x] = '※'
  mazeToPrint[y] = lineArr.join('')

  console.log(mazeToPrint.join('\n'))
}

run()
