import { printResults, sum } from "../utils/utils.ts";
import { file, part, readFileLineByLine } from "../utils/bunUtils.ts";

async function run() {
  if (part === 1) {
    await readFileLineByLine(file, part1);
    const result = process1();
    printResults(46, result);
  } else {
    await readFileLineByLine(file, part1);
    const result = process2();
    printResults(145, result);
  }
}

const maze: string[][] = [];
let visited: number[][] = [];
const visitedBase: number[][] = [];
type Point = [number, number];
type Modifier = (from: Point, position: Point) => Point[];
const modifiers: Record<string, Modifier> = {
  "-": ([fx, fy], [x, y]) =>
    fy === 0 ? [[x + fx, y]] : [[x + 1, y], [x - 1, y]],
  "|": ([fx, fy], [x, y]) =>
    fx === 0 ? [[x, y + fy]] : [[x, y + 1], [x, y - 1]],
  "/": ([fx, fy], [x, y]) => [[x + fy * -1, y + fx * -1]],
  "\\": ([fx, fy], [x, y]) => [[x + fy, y + fx]],

  ".": ([fx, fy], [x, y]) => [[x + fx, y + fy]],
} as const;

function part1(line: string) {
  const y = maze.length;
  const ll = line.split("");

  if (!maze[y]) {
    maze[y] = [];
    visited[y] = [];
    visitedBase[y] = [];
  }

  for (let x = 0; x < ll.length; x++) {
    maze[y][x] = ll[x];
    visited[y][x] = 0;
    visitedBase[y][x] = 0;
  }
}

function process1() {
  walk([1, 0], [0, 0]);

  // console.log(visited.map(l => l.map(d => d ? "#" : '.').join('')).join('\n'));
  return visited.flat().map((v) => v ? 1 : 0);
}

let maxVisited = 0;
function process2() {
  goDown();
  goUp();
  goRight();
  goLeft();

  // console.log(visited.map(l => l.map(d => d ? "#" : '.').join('')).join('\n'));
  return [maxVisited];
}

function reset() {
  visited = JSON.parse(JSON.stringify(visitedBase));
}

function goDown() {
  const y = 0;
  for (let x = 0; x < maze[0].length; x++) {
    reset();
    walk([0, 1], [x, y]);
    const count = sum(visited.flat().map((v) => v ? 1 : 0));

    maxVisited = Math.max(count, maxVisited);
  }
}

function goUp() {
  const y = maze.length - 1;
  for (let x = 0; x < maze[0].length; x++) {
    reset();
    walk([0, -1], [x, y]);
    const count = sum(visited.flat().map((v) => v ? 1 : 0));

    maxVisited = Math.max(count, maxVisited);
  }
}

function goRight() {
  const x = 0;
  for (let y = 0; y < maze.length; y++) {
    reset();
    walk([1, 0], [x, y]);
    const count = sum(visited.flat().map((v) => v ? 1 : 0));

    maxVisited = Math.max(count, maxVisited);
  }
}

function goLeft() {
  const x = maze[0].length - 1;
  for (let y = 0; y < maze.length; y++) {
    reset();
    walk([-1, 0], [x, y]);
    const count = sum(visited.flat().map((v) => v ? 1 : 0));

    maxVisited = Math.max(count, maxVisited);
  }
}

let i = 0;
function walk(from: Point, p: Point) {
  const modifier = getModifier(p);

  if (modifier) {
    i++;
    const [x, y] = p;
    const dot = maze[y]?.[x];
    const wasVisited = visited[y][x] > 1 && ["-", "|"].includes(dot);
    visited[y][x]++;
    const nexts = modifier(from, p);

    nexts.forEach((next) => {
      const [nx, ny] = next;
      const nextFrom: Point = [nx - x, ny - y];
      if (!wasVisited) {
        walk(nextFrom, next);
      }
    });
  }
}

function getModifier([x, y]: Point): Modifier | undefined {
  const d: string | undefined = maze[y]?.[x];
  return modifiers[d] || null;
}

run();
