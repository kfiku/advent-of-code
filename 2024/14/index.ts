import { byLine } from '../../utils/files'
import { directionsPlus, Matrix, Pos, posKey, printMatrix } from '../../utils/matrix/matrix'
import { sum } from '../../utils/numbers'
import { type Answers, run } from '../../utils/run'

const answers: Answers = {
  test1: 12,
  input1: 218965032,
  test2: 1,
  input2: 7037,
}

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string, type: 'test' | 'input') {
  const robots = getRobots(input)
  const [mx, my] = type === 'test' ? [11, 7] : [101, 103]
  const [middleX, middleY] = [Math.floor(mx / 2), Math.floor(my / 2)]
  const seconds = 100

  const len = robots.length
  const robotsMap = new Map<string, number>()
  const robotsAfter: Pos[] = []

  for (let i = 0; i < len; i++) {
    const {
      position: [px, py],
      velocity: [vx, vy],
    } = robots[i]

    const [rx, ry] = [
      (px + vx * seconds) % mx,
      //
      (py + vy * seconds) % my,
    ]
    const ra = [
      rx >= 0 ? rx : rx + (vx < 0 ? mx : 0),
      //
      ry >= 0 ? ry : ry + (vy < 0 ? my : 0),
    ] as Pos
    const key = posKey(ra)
    const v = robotsMap.get(key) || 0

    robotsMap.set(key, v + 1)
    robotsAfter.push(ra)
  }

  const q1 = robotsAfter.filter(([rx, ry]) => rx < middleX && ry < middleY)
  const q2 = robotsAfter.filter(([rx, ry]) => rx > middleX && ry < middleY)
  const q3 = robotsAfter.filter(([rx, ry]) => rx < middleX && ry > middleY)
  const q4 = robotsAfter.filter(([rx, ry]) => rx > middleX && ry > middleY)

  const result = q1.length * q2.length * q3.length * q4.length

  return sum([result])
}

async function runSecondPart(input: string, type: 'test' | 'input') {
  if (type === 'test') {
    return 1
  }

  const robots = getRobots(input)
  const [mx, my] = [101, 103]
  const len = robots.length
  const start = 7000
  const count = 10000

  for (let seconds = start; seconds < start + count; seconds++) {
    const robotsMap = new Map<string, string>()

    for (let i = 0; i < len; i++) {
      const {
        position: [px, py],
        velocity: [vx, vy],
      } = robots[i]

      const [rx, ry] = [
        (px + vx * seconds) % mx,
        //
        (py + vy * seconds) % my,
      ]
      const ra = [
        rx >= 0 ? rx : rx + (vx < 0 ? mx : 0),
        //
        ry >= 0 ? ry : ry + (vy < 0 ? my : 0),
      ] as Pos

      const key = posKey(ra)
      robotsMap.set(key, 'x')
    }

    const [firstKey] = robotsMap.keys()
    const firstPoint = firstKey.split('.').map((v) => +v) as Pos
    const matrix = generateMatrix([mx, my], robotsMap)
    const history = new Map()

    walk(firstPoint, matrix, history)

    if (history.size > 50) {
      console.log('----------', seconds, '------------')
      printMatrix([mx, my], robotsMap)

      return seconds
    }
  }

  return 1
}

function getRobots(input: string) {
  return byLine(input).map((l) => {
    const [p, v] = l.split(' ')
    const position = p
      .split('=')[1]
      .split(',')
      .map((p) => +p) as Pos
    const velocity = v
      .split('=')[1]
      .split(',')
      .map((p) => +p) as Pos

    return {
      position,
      velocity,
    }
  })
}

function generateMatrix([mx, my]: Pos, points: Map<string, string | number>) {
  const lines: string[][] = []

  for (let y = 0; y < my; y++) {
    for (let x = 0; x < mx; x++) {
      const point = points.get(posKey([x, y]))

      if (point) {
        if (!lines[y]) {
          lines[y] = []
        }
        lines[y][x] = 'X'
      }
    }
  }

  return lines
}

function walk(pos: Pos, matrix: Matrix, history = new Map()) {
  const [x, y] = pos

  for (let d = 0; d < directionsPlus.length; d++) {
    const [dx, dy] = directionsPlus[d]
    const nextPos = [x + dx, y + dy] as Pos
    const [nx, ny] = nextPos
    const nextPoint = matrix[ny]?.[nx]!
    const key = posKey(nextPos)

    if (nextPoint && !history.has(key)) {
      history.set(key, 'X')
      walk(nextPos, matrix, history)
    }
  }
}
