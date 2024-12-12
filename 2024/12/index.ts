import { byLineAndLetter } from '../../utils/files'
import { directions, Matrix, Pos, posKey } from '../../utils/matrix/matrix'
import { sum } from '../../utils/numbers'
import { type Answers, run } from '../../utils/run'

const answers: Answers = {
  test1: 1930,
  input1: 1344578,
  test2: 1206,
  input2: 814302,
}

type Rule = (pos: Pos, area: Map<string, Pos>) => boolean

interface PerimeterRule {
  perimeter: Pos
  orRules: Pos[]
  extraRules?: Pos[]
}

const perimetersDirections: PerimeterRule[] = [
  {
    perimeter: [0, 0],
    orRules: [
      [-1, 0],
      [-1, -1],
      [0, -1],
    ],
  },
  {
    perimeter: [1, 0],
    orRules: [
      [1, 0],
      [1, -1],
      [1, 0],
    ],
    extraRules: [
      [0, -1],
      [1, 0],
    ],
  },
  {
    perimeter: [1, 1],
    orRules: [
      [1, 0],
      [1, 1],
      [0, 1],
    ],
    extraRules: [
      [0, 1],
      [1, 0],
    ],
  },
  {
    perimeter: [0, 1],
    orRules: [
      [0, 1],
      [-1, 1],
      [-1, 0],
    ],
  },
]

const sideRules: Rule[] = [
  ([x, y]: Pos, area: Map<string, Pos>) => {
    const up = area.has(posKey([x + 0, y - 1]))
    const corner = area.has(posKey([x - 1, y - 1]))
    const left = area.has(posKey([x - 1, y + 0]))

    return (!up && !corner && !left) || (!corner && up && left) || (corner && !up && !left)
  },
  ([x, y]: Pos, area: Map<string, Pos>) => {
    const up = area.has(posKey([x + 0, y - 1]))
    const corner = area.has(posKey([x + 1, y - 1]))
    const right = area.has(posKey([x + 1, y + 0]))

    return (!up && !corner && !right) || (!corner && up && right) || (corner && !up && !right)
  },
  ([x, y]: Pos, area: Map<string, Pos>) => {
    const down = area.has(posKey([x + 0, y + 1]))
    const corner = area.has(posKey([x + 1, y + 1]))
    const right = area.has(posKey([x + 1, y + 0]))

    return (!down && !corner && !right) || (!corner && down && right) || (corner && !down && !right)
  },
  ([x, y]: Pos, area: Map<string, Pos>) => {
    const down = area.has(posKey([x + 0, y + 1]))
    const corner = area.has(posKey([x - 1, y + 1]))
    const left = area.has(posKey([x - 1, y + 0]))

    return (!down && !corner && !left) || (!corner && down && left) || (corner && !down && !left)
  },
]

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string) {
  const areas = getAreas(input)

  const areasWithPerimeters = areas.map((area) => {
    const perimeters = new Map<string, Pos>()
    const perimetersA: Pos[] = []

    area.forEach(([x, y]) => {
      for (let d = 0; d < perimetersDirections.length; d++) {
        const { perimeter, orRules, extraRules } = perimetersDirections[d]
        const [pdx, pdy] = perimeter
        const pp = [x + pdx, y + pdy] as Pos

        for (let r = 0; r < orRules.length; r++) {
          const [rx, ry] = orRules[r]
          const nextPos = [x + rx, y + ry] as Pos
          const nextPlant = area.get(posKey(nextPos))

          if (!nextPlant) {
            perimeters.set(posKey(pp), pp)
          } else {
            const res = (extraRules || [[0, 0]]).filter((rule) => {
              const [rx, ry] = rule
              const nextPos = [x + rx, y + ry] as Pos
              return area.get(posKey(nextPos))
            })

            if (res.length === 0) {
              perimeters.set(posKey(pp) + '-2', pp)
            }
          }
        }
      }
    })

    return { area, perimeters, perimetersA }
  })

  const results = areasWithPerimeters.map(({ area, perimeters }) => area.size * perimeters.size)

  return sum(results)
}

function runSecondPart(input: string) {
  const areas = getAreas(input)

  const sides = areas
    .map((area) => ({
      area: area.size,
      sides: [...area.values()].flatMap((pos) => sideRules.filter((rule) => rule(pos, area))).length,
    }))
    .map(({ area, sides }) => area * sides)

  return sum(sides)
}

function getAreas(input: string) {
  const matrix: Matrix = byLineAndLetter(input)
  const visited = new Map<string, Pos>()
  const areas: Map<string, Pos>[] = []

  for (let y = 0; y < matrix.length; y++) {
    const line = matrix[y]

    for (let x = 0; x < line.length; x++) {
      const key = posKey([x, y])

      if (!visited.has(key)) {
        const plantArea = walk([x, y], matrix)
        plantArea.forEach((p, key) => visited.set(key, p))

        areas.push(plantArea)
      }
    }
  }
  return areas
}

function walk(pos: Pos, matrix: Matrix, visited = new Map<string, Pos>()) {
  const [x, y] = pos
  const plant = matrix[y]?.[x]!
  const key = posKey([x, y])

  visited.set(key, pos)

  for (let d = 0; d < directions.length; d++) {
    const [dx, dy] = directions[d]
    const nextPos = [x + dx, y + dy] as Pos
    const [nx, ny] = nextPos
    const nextPlant = matrix[ny]?.[nx]!

    if (nextPlant === plant && !visited.has(posKey(nextPos))) {
      walk(nextPos, matrix, visited)
    }
  }

  return visited
}
