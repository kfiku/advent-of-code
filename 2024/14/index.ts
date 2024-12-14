import { byLine } from '../../utils/files'
import { Pos, posKey, printMatrix } from '../../utils/matrix/matrix'
import { sum } from '../../utils/numbers'
import { type Answers, run } from '../../utils/run'

const answers: Answers = {
  test1: 12,
  input1: 218965032,
  test2: 0,
  input2: 0,
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

  const q1 = robotsAfter.filter(([rx, ry]) => {
    return rx < middleX && ry < middleY
  })

  const q2 = robotsAfter.filter(([rx, ry]) => {
    return rx > middleX && ry < middleY
  })

  const q3 = robotsAfter.filter(([rx, ry]) => {
    return rx < middleX && ry > middleY
  })

  const q4 = robotsAfter.filter(([rx, ry]) => {
    return rx > middleX && ry > middleY
  })

  const result = q1.length * q2.length * q3.length * q4.length

  // printMatrix([mx, my], robotsMap)

  return sum([result])
}

function runSecondPart(input: string) {
  const lints = byLine(input)

  return sum([lints.length])
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
