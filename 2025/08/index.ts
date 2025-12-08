import { pbkdf2 } from 'crypto'
import { byLine } from '../../utils/files'
import { type Answers, InputType, run } from '../../utils/run'
import { uniq } from '../../utils/uniq'

const answers: Answers = {
  test1: 40,
  input1: 72150,
  test2: 25272,
  input2: 3926518899,
}

run(runFirstPart, runSecondPart, answers)

interface C {
  id: number
  distance?: number
  points: string[]
}

function runFirstPart(input: string, type: InputType) {
  const points = byLine(input).map((p) => p.split(',').map((p) => +p) as Pos)

  const cache = new Set<string>()
  const distances = points
    .flatMap((p1) =>
      points.map((p2) => {
        if (p1 === p2) {
          return undefined
        }

        if (cache.has(p1.join(',') + '-' + p2.join(',')) || cache.has(p2.join(',') + '-' + p1.join(','))) {
          return undefined
        }

        cache.add(p1.join(',') + '-' + p2.join(','))

        return {
          distance: distance(p1, p2),
          p1: p1.join(','),
          p2: p2.join(','),
        }
      }),
    )
    .filter(Boolean)
    .sort((a, b) => a.distance - b.distance)

  let connections: C[] = []

  let connectionsCount = 0
  let id = 0

  const connectionsToFind = type === 'test' ? 10 : 1000

  for (const { p1, p2 } of distances) {
    let c1 = connections.find((c) => c.points.includes(p1))
    let c2 = connections.find((c) => c.points.includes(p2))

    connectionsCount++

    if (!c1 && !c2) {
      connections.push({
        id: ++id,
        points: [p1, p2],
      })
    } else if (c1 && !c2) {
      c1.points.push(p2)
    } else if (c2 && !c1) {
      c2.points.push(p1)
    } else if (c1 && c2 && c1.id !== c2.id) {
      // connections should be joined
      c1.points = uniq([...c1.points, ...c2.points])

      connections = connections.filter((c) => c.id !== c2.id)
    }

    if (connectionsCount >= connectionsToFind) {
      break
    }
  }

  const largest = connections.filter((c) => c.points.length > 0).sort((a, b) => b.points.length - a.points.length)
  const [l1, l2, l3] = largest.map((l) => l.points.length)

  return l1 * l2 * l3
}

function runSecondPart(input: string, type: InputType) {
  const points = byLine(input).map((p) => p.split(',').map((p) => +p) as Pos)

  const cache = new Set<string>()
  const distances = points
    .flatMap((p1) =>
      points.map((p2) => {
        if (p1 === p2) {
          return undefined
        }

        if (cache.has(p1.join(',') + '-' + p2.join(',')) || cache.has(p2.join(',') + '-' + p1.join(','))) {
          return undefined
        }

        cache.add(p1.join(',') + '-' + p2.join(','))

        return {
          distance: distance(p1, p2),
          p1: p1.join(','),
          p2: p2.join(','),
        }
      }),
    )
    .filter(Boolean)
    .sort((a, b) => a.distance - b.distance)

  let connections: C[] = []

  let connectionsCount = 0
  let id = 0
  let last = []

  const connectionsToFind = type === 'test' ? 20 : 1000

  for (const { p1, p2 } of distances) {
    let c1 = connections.find((c) => c.points.includes(p1))
    let c2 = connections.find((c) => c.points.includes(p2))

    connectionsCount++

    if (!c1 && !c2) {
      connections.push({
        id: ++id,
        points: [p1, p2],
      })
    } else if (c1 && !c2) {
      c1.points.push(p2)
    } else if (c2 && !c1) {
      c2.points.push(p1)
    } else if (c1 && c2 && c1.id !== c2.id) {
      // connections should be joined
      c1.points = uniq([...c1.points, ...c2.points])

      connections = connections.filter((c) => c.id !== c2.id)
    }

    last = [p1, p2]

    if (connections[0].points.length >= connectionsToFind) {
      break
    }
  }

  const [last1, last2] = last
  const [last1X] = last1.split(',')
  const [last2X] = last2.split(',')

  return last1X * last2X
}

type Pos = [number, number, number]

function distance([x1, y1, z1]: Pos, [x2, y2, z2]: Pos) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2))
}
