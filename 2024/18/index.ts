import { byLine } from '../../utils/files'
import {
  directionsMap,
  directionsRotationMap,
  generateMatrix,
  getDirectionSymbol,
  Matrix,
  Pos,
  posKey,
} from '../../utils/matrix/matrix'
import { type Answers, InputType, run } from '../../utils/run'

const answers: Answers = {
  test1: 22,
  input1: 416,
  test2: '6,1',
  input2: '0',
}

const [wall, empty] = '#.'

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string, type: InputType) {
  const simulateSize = type === 'test' ? 12 : 1024
  const { startNode, targetNode, matrix } = parseInput(type, input, simulateSize)

  const path = aStarSearch(startNode, targetNode, matrix)!
  const score = path.length - 1

  return score
}

function runSecondPart(input: string, type: InputType) {
  const simulateSize = type === 'test' ? 24 : 3450
  let s = simulateSize
  const { brokenBytes, startNode, targetNode, matrix } = parseInput(type, input, simulateSize)

  let path: Pos[] | null = null
  while (path === null) {
    path = aStarSearch(startNode, targetNode, matrix)!
    s--
    const [x, y] = brokenBytes[s]
    matrix[y][x] = empty
  }

  return brokenBytes[s + 1].join(',')
}

function parseInput(type: string, input: string, simulateSize: number) {
  const size = type === 'test' ? 7 : 71
  const brokenBytes: Pos[] = byLine(input).map((l, id) => l.split(',').map((e) => +e) as Pos)

  const wallsMap = new Map<string, string>()
  brokenBytes.forEach((pos, index) => {
    if (index < simulateSize) {
      wallsMap.set(posKey(pos), '#')
    }
  })
  const matrix = generateMatrix([size, size], wallsMap, '.') as Matrix

  const startNode = new Node(0, 0)
  const targetNode = new Node(size - 1, size - 1)

  return { brokenBytes, simulateSize, startNode, targetNode, matrix }
}

class Node {
  public totalCost: number

  constructor(
    public x: number,
    public y: number,
    public costFromStart = 0,
    public heuristic = 0,
    public parent: Node | null = null,
  ) {
    this.totalCost = costFromStart + heuristic
  }

  equals(node: Node) {
    return this.x === node.x && this.y === node.y
  }
}

function heuristic(node: Node, target: Node) {
  // Heuristic function (Manhattan distance)
  return Math.abs(node.x - target.x) + Math.abs(node.y - target.y)
}

function aStarSearch(start: Node, target: Node, grid: Matrix) {
  const openSet: Node[] = [] // Nodes to be evaluated
  const closedSet: Node[] = [] // Nodes already evaluated

  openSet.push(start)

  while (openSet.length > 0) {
    // Find node with the lowest f value
    let current = openSet.reduce((acc, node) => (node.totalCost < acc.totalCost ? node : acc), openSet[0])

    if (current.equals(target)) {
      const path: Pos[] = []
      let curr: Node | null = current
      while (curr) {
        path.unshift([curr.x, curr.y])
        curr = curr.parent
      }
      return path
    }

    // Move current node from openSet to closedSet
    openSet.splice(openSet.indexOf(current), 1)
    closedSet.push(current)

    const neighbors = getNeighbors(current, grid)

    for (let neighbor of neighbors) {
      // Skip if neighbor is already in closedSet
      if (closedSet.some((node) => node.equals(neighbor))) continue

      const tentativeG = current.costFromStart + 1

      // Check if this path is better
      const existingNode = openSet.find((node) => node.equals(neighbor))
      if (!existingNode || tentativeG < neighbor.costFromStart) {
        neighbor.costFromStart = tentativeG
        neighbor.heuristic = heuristic(neighbor, target)
        neighbor.totalCost = neighbor.costFromStart + neighbor.heuristic
        neighbor.parent = current

        // Add neighbor to openSet if not already in it
        if (!existingNode) {
          openSet.push(neighbor)
        }
      }
    }
  }

  // Return empty path if no solution
  return null
}

function getNeighbors(node: Node, grid) {
  const neighbors: Node[] = []
  const dir: Pos = !node.parent ? [1, 0] : [node.x - node.parent.x, node.y - node.parent.y]
  const directions = [dir, ...directionsRotationMap[getDirectionSymbol(dir)].map((d: string) => directionsMap[d])]

  for (let [dx, dy] of directions) {
    const x = node.x + dx
    const y = node.y + dy

    // Check if within grid bounds and not an obstacle
    if (x >= 0 && y >= 0 && x < grid[0].length && y < grid.length && grid[y][x] === empty) {
      neighbors.push(new Node(x, y))
    }
  }

  return neighbors
}
