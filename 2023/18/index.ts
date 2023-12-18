import { printResults, sum } from "../utils/utils.ts";
import { part, file, readFileLineByLine } from "../utils/bunUtils.ts";


async function run() {
  if (part === 1) {
    await readFileLineByLine(file, part1);
    const result = process1();
    printResults(62, result);
  } else {
    await readFileLineByLine(file, part1);
    const result = process2();
    printResults(145, result);
  }
}

function part1(line: string) {
  const [direction, count, color] = line.split(' ')

  const step: Step = {
    direction,
    count: +count,
    color
  }

  steps.push(step)
}

function process1() {
  const sides = {left: [], right: []}
  const res = walk({ modifier, steps, point: [0, 0], sides, visitvisiteded: [[0, 0]] })

  const maze = getMazeFromVisitedAndSides(res[0].visited!, res[0].sides!);

  const mazeResult = maze.map(l => l.map(l => l != ' ' ? 1 : 0)).flat()

  return mazeResult
}

function walk(options: WalkOptions): WalkOptions[] {
  const { modifier } = options;

  const nextOptions = modifier(options)
  const nextMoves = nextOptions.filter(option => !option.isLast)

  if (nextMoves && nextMoves.length) {
    return nextMoves.map(option => walk(option)).flat()
  }

  return nextOptions
}

type Step = {
  direction: string;
  count: number;
  color: string;
}
type Point = [number, number];

type WalkOptions = {
  point: Point;
  visited?: Point[];
  modifier: Modifier;
  steps: Step[];
  moves?: number;
  isLast?: boolean;
  sides: {
    left: Point[],
    right: Point[],
  }
}

type Modifier = (options: WalkOptions) => WalkOptions[]
const steps: Step[] = []
function modifier(options: WalkOptions) {
  const { point: [x, y], steps, moves, visited, sides } = options
  const nextVisited = [...visited || []]
  const nextSteps = steps.slice(1)
  const nextSides = {left: [...sides.left], right: [...sides.right]}
  let nextPoint: Point = [x, y]
  const isLast = nextSteps.length === 0
  const { count, direction } = steps[0]

  for (let i = 0; i < count; i++) {
    switch (direction) {
      case 'R':
        nextPoint = [nextPoint[0] + 1, nextPoint[1]]
        nextVisited.push([nextPoint[0], nextPoint[1]])
        nextSides.left.push([nextPoint[0], nextPoint[1] - 1])
        nextSides.right.push([nextPoint[0], nextPoint[1] + 1])
        break;

      case 'L':
        nextPoint = [nextPoint[0] - 1, nextPoint[1]]
        nextVisited.push([nextPoint[0], nextPoint[1]])
        nextSides.left.push([nextPoint[0], nextPoint[1] + 1])
        nextSides.right.push([nextPoint[0], nextPoint[1] - 1])
        break;

      case 'U':
        nextPoint = [nextPoint[0], nextPoint[1] - 1]
        nextVisited.push([nextPoint[0], nextPoint[1]])
        nextSides.left.push([nextPoint[0] - 1, nextPoint[1]])
        nextSides.right.push([nextPoint[0] + 1, nextPoint[1]])
        break;

      case 'D':
        nextPoint = [nextPoint[0], nextPoint[1] + 1]
        nextVisited.push([nextPoint[0], nextPoint[1]])
        nextSides.left.push([nextPoint[0] + 1, nextPoint[1]])
        nextSides.right.push([nextPoint[0] - 1, nextPoint[1]])
        break;

      default:
        break;
    }
  }

  const next: WalkOptions = {
    ...options,
    point: nextPoint,
    visited: nextVisited,
    steps: nextSteps,
    isLast: isLast,
    moves: (moves || 0) + 1,
    sides: nextSides,
  }

  return [next]
}


function getMazeFromVisitedAndSides(visited: Point[], sides: { left: Point[], right: Point[] }) {
  const maze: string[][] = []
  let minX = 0
  let minY = 0

  for (let i = 0; i < visited.length; i++) {
    const [x, y] = visited[i];

    minX = Math.min(x, minX)
    minY = Math.min(y, minY)
  }

  const newVisited: Point[] = visited.map(([x, y]) => [x - minX, y - minY])
  const newPoints: Point[] = sides.right.map(([x, y]) => [x - minX, y - minY])

  for (let i = 0; i < newVisited.length; i++) {
    const [x,y] = newVisited[i];
    if (!maze[y]) {
      maze[y] = []
    }

    maze[y][x] = "#"
  }

  const points = fillInsideMaze(maze, newPoints)

  for (let i = 0; i < points.length; i++) {
    const [x,y] = points[i];
    if (!maze[y]) {
      maze[y] = []
    }

    if (!maze[y][x]) {
      maze[y][x] = "."
    }
  }

  for (let y = 0; y < maze.length; y++) {
    const ll = maze[y];

    for (let x = 0; x < ll.length; x++) {
      if(!maze[y][x]) {
        maze[y][x] = ' '
      }
    }
  }

  return maze
}


const aroundOptions: Point[] = [
  [0, -1], // top
  [1, 0], // right
  [0, 1], // bottom
  [-1, 0], // left
];

function fillInsideMaze(maze: string[][], points: Point[], added: Point[] = []) {
  const nextPoints = [...points]
  const addedPoints: Point[] = []
  const ps = added.length > 0 ? added : points;
  const pointsMap = new Map<string, boolean>()

  for (let p = 0; p < points.length; p++) {
    const [x, y] = points[p]
    pointsMap.set(x + ',' + y, true)
  }

  for (let p = 0; p < ps.length; p++) {
    const [x, y] = ps[p]

    for (let i = 0; i < aroundOptions.length; i++) {
      const [ax, ay] = aroundOptions[i]
      const nextPoint: Point = [x + ax, y + ay]
      const key = nextPoint[0] + ',' + nextPoint[1]
      const isAPoint = pointsMap.has(key)

      if(!maze[y][x] && !isAPoint) {
        pointsMap.set(key, true)
        nextPoints.push(nextPoint)
        addedPoints.push(nextPoint)
      }
    }
  }

  if (addedPoints.length > 0) {
    // console.log("ADDED POINTS", addedPoints.length);
    return fillInsideMaze(maze, nextPoints, addedPoints)
  }

  return nextPoints
}

function printMaze(maze: string[][]) {
  console.log(maze.map(l => l.join('')).join('\n'));
}

run();
