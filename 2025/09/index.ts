import { byLine } from '../../utils/files'
import { sum } from '../../utils/numbers'
import { type Answers, InputType, run } from '../../utils/run'

const answers: Answers = {
  test1: 50,
  input1: 4764078684,
  test2: 24,
  input2: 0,
}

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string, type: InputType) {
  const lines = byLine(input).map((d) => d.split(',').map((d) => +d))

  const biggest = lines.reduce((acc, [x1, y1]) => {
    const area = lines.reduce((acc, [x2, y2]) => {
      const area = (Math.abs(x2 - x1) + 1) * (Math.abs(y2 - y1) + 1)
      return area > acc ? area : acc
    }, 0)

    return area > acc ? area : acc
  }, 0)

  return sum([biggest])
}

function runSecondPart(input: string, type: InputType) {
  const lines = byLine(input).map((d) => d.split(',').map((d) => +d) as Point)

  const biggest = lines.reduce((acc, [x1, y1]) => {
    const area = lines.reduce((acc, [x2, y2]) => {
      const rect: Point[] = [
        [x1, y1],
        [x2, y2],
        [x1, y2],
        [x2, y1],
      ]

      const rect1: Rect = { x1, y1, x2, y2 }

      let allMatched = !rect.some((pos) => !isPointInPolygon(pos, lines))
      allMatched = allMatched ? isRectangleInsidePolygon(rect1, lines) : allMatched

      if (x1 === 2 && y1 === 3 && x2 === 9 && y2 === 5) {
        // console.log(rect, allMatched)
      }
      if (allMatched) {
        const area = (Math.abs(x2 - x1) + 1) * (Math.abs(y2 - y1) + 1)

        return area > acc ? area : acc
      }

      return acc
    }, 0)

    return area > acc ? area : acc
  }, 0)

  return sum([biggest])
}

type Point = [number, number]

type Rect = {
  x1: number
  y1: number
  x2: number
  y2: number
}

function isPointOnSegment(p: Point, a: Point, b: Point, eps = 1e-9): boolean {
  const [px, py] = p
  const [ax, ay] = a
  const [bx, by] = b

  const cross = (bx - ax) * (py - ay) - (by - ay) * (px - ax)
  if (Math.abs(cross) > eps) return false

  const dot = (px - ax) * (px - bx) + (py - ay) * (py - by)
  return dot <= eps
}

function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  const [px, py] = point
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i]
    const b = polygon[j]
    const [xi, yi] = a
    const [xj, yj] = b

    if (isPointOnSegment(point, a, b)) {
      return true
    }

    const intersects = yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi

    if (intersects) inside = !inside
  }

  return inside
}

function orientation(a: Point, b: Point, c: Point): number {
  const value = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  if (value > 0) return 1 // counter-clockwise
  if (value < 0) return -1 // clockwise
  return 0 // colinear
}

function segmentsProperlyIntersect(p1: Point, p2: Point, q1: Point, q2: Point): boolean {
  const o1 = orientation(p1, p2, q1)
  const o2 = orientation(p1, p2, q2)
  const o3 = orientation(q1, q2, p1)
  const o4 = orientation(q1, q2, p2)

  return o1 * o2 < 0 && o3 * o4 < 0
}

function isRectangleInsidePolygon(rect: Rect, polygon: Point[]): boolean {
  const xMin = Math.min(rect.x1, rect.x2)
  const xMax = Math.max(rect.x1, rect.x2)
  const yMin = Math.min(rect.y1, rect.y2)
  const yMax = Math.max(rect.y1, rect.y2)

  const corners: Point[] = [
    [xMin, yMin],
    [xMax, yMin],
    [xMax, yMax],
    [xMin, yMax],
  ]

  for (const corner of corners) {
    if (!isPointInPolygon(corner, polygon)) {
      return false
    }
  }

  const rectEdges: [Point, Point][] = [
    [corners[0], corners[1]],
    [corners[1], corners[2]],
    [corners[2], corners[3]],
    [corners[3], corners[0]],
  ]

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const polyA = polygon[i]
    const polyB = polygon[j]

    for (const [rA, rB] of rectEdges) {
      if (segmentsProperlyIntersect(polyA, polyB, rA, rB)) {
        return false
      }
    }
  }

  return true
}
