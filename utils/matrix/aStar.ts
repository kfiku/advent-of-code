import { directions, Matrix, Pos } from './matrix'

export class Node {
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

export function aStarSearch(start: Node, target: Node, grid: Matrix) {
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

function heuristic(node: Node, target: Node) {
  // Heuristic function (Manhattan distance)
  return Math.abs(node.x - target.x) + Math.abs(node.y - target.y)
}

function getNeighbors(node: Node, grid: Matrix) {
  const neighbors: Node[] = []

  for (let [dx, dy] of directions) {
    const x = node.x + dx
    const y = node.y + dy

    // Check if within grid bounds and not an obstacle
    if (x >= 0 && y >= 0 && x < grid[0].length && y < grid.length && grid[y][x] === '.') {
      neighbors.push(new Node(x, y))
    }
  }

  return neighbors
}
