import { byLine, byLineAndLetter } from '../../utils/files'
import {
  getElementPosition,
  Pos,
  directionsMap,
  directionsRotationMap,
  getDirectionSymbol,
  Matrix,
} from '../../utils/matrix/matrix'
import { sum } from '../../utils/numbers'
import { type Answers, run } from '../../utils/run'

const answers: Answers = {
  test1: 7036,
  input1: 90460,
  test2: 0,
  input2: 0,
}

const [wall, empty, end, reindeer] = '#.ES'
const rotationCost = 1000

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string) {
  const maze = byLineAndLetter(input)
  const grid = maze.map((l) => l.map((e) => (e === wall ? '#' : '.')))

  const [sx, sy] = getElementPosition(reindeer, maze)!
  const [ex, ey] = getElementPosition(end, maze)!
  const startNode = new Node(sx, sy)
  const targetNode = new Node(ex, ey)

  const score = aStarSearch(startNode, targetNode, grid)

  return score
}

function runSecondPart(input: string) {
  const lints = byLine(input)

  return sum([lints.length])
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
      return current.totalCost
    }

    // Move current node from openSet to closedSet
    openSet.splice(openSet.indexOf(current), 1)
    closedSet.push(current)

    const neighbors = getNeighbors(current, grid)

    for (let neighbor of neighbors) {
      // Skip if neighbor is already in closedSet
      if (closedSet.some((node) => node.equals(neighbor))) continue

      const oneDirection = !current.parent
        ? current.y === neighbor.y // first direction
        : (current.x === neighbor.x && neighbor.x === current.parent.x) ||
          (current.y === neighbor.y && neighbor.y === current.parent.y)

      const extraRotateCost = oneDirection ? 0 : rotationCost
      const tentativeG = current.costFromStart + 1 + extraRotateCost

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
