import { printResults } from "../utils/utils.ts";
import { denoUtils } from "../utils/denoUtils.ts";

const part = +Deno.args[0] || 1;

async function run() {
  if (part === 1) {
    await denoUtils("./input.txt", part1);
    const result = process1();
    printResults(6903, [result]);
  } else {
    console.clear();
    await denoUtils("./input.txt", part2);
    const result = process2();

    printResults(4, [result]);
  }
}

// directions from left to right and from top to bottom
const directions = {
  "-": [[-1, 0], [1, 0]],
  "7": [[-1, 0], [0, 1]],
  "F": [[0, 1], [1, 0]],
  "J": [[0, -1], [-1, 0]],
  "L": [[0, -1], [1, 0]],
  "S": [[0, 0], [0, 0]],
  "|": [[0, 1], [0, -1]],
  ".": [[], []],
};

const symbolDict = {
  "|": "│",
  "-": "─",
  "F": "┌",
  "L": "└",
  "J": "┘",
  "7": "┐",
  "S": "S",
};

type Sym = keyof typeof directions;

const startSymbol = "S";
let currentPosition = [0, 0];
const maze: string[] = [];

function part1(line: string) {
  const startPosition = line.indexOf(startSymbol);

  if (startPosition > -1) {
    currentPosition = [startPosition, maze.length];
  }

  maze.push(line);
}

function process1() {
  const size = getLoopSize(maze);

  return size;
}

function getLoopSize(maze: string[]) {
  let i = 0;
  let direction = getDirection(maze, currentPosition);

  while (i < 200000) {
    // printMaze(maze, direction.pos);
    // console.log('-----------------');
    const nextDir = walkMaze(maze, direction);

    if (!nextDir) {
      console.log("ERROR");
      return 0;
    }

    direction = nextDir;

    i++;

    if (direction.symbol === startSymbol) {
      return i / 2;
    }
  }

  return i;
}

function walkMaze(maze: string[], direction: Direction) {
  if (direction.symbol === startSymbol) {
    return searchOptions(maze, direction);
  }

  const nextDir = getNextPos(maze, direction);

  if (isPointOnABorder(nextDir.pos)) {
    console.log("BORDER", nextDir);
  }

  return nextDir;
}

function getNextPos(maze: string[], dir: Direction) {
  const [x, y] = dir.pos;
  const [rx, ry] = reverseMove(dir.from);
  const from = dir.direction.find(([x, y]) => x != rx || y != ry)!;
  const [fx, fy] = from;
  const nextPos = [x + fx, y + fy];

  const nextDir = getDirection(maze, nextPos, from);

  return nextDir;
}

const aroundOptions: Point[] = [
  [0, -1], // top
  [1, 0], // right
  [0, 1], // bottom
  [-1, 0], // left
];
function searchOptions(maze: string[], dir: Direction) {
  const [x, y] = dir.pos;
  let properSymbol = null;
  let aroundId = 0;

  while (!properSymbol) {
    const [ax, ay] = aroundOptions[aroundId];
    const nextPos = [x + ax, y + ay];
    const sym = getDirection(maze, nextPos, [ax, ay]);

    if (validateMove(maze, dir.pos, nextPos)) {
      properSymbol = sym;

      return sym;
    }

    aroundId++;

    if (aroundId > aroundOptions.length - 1) {
      return null;
    }
  }

  return properSymbol;
}

type Direction = ReturnType<typeof getDirection>;

function getDirection(maze: string[], pos: number[], from: number[] = []) {
  const [x, y] = pos;
  const symbol = maze[y]?.[x] as Sym;
  const direction = directions[symbol];

  return { symbol, pos, direction, from };
}

function validateMove(maze: string[], fromPos: number[], toPos: number[]) {
  const toDir = getDirection(maze, toPos);

  if (!toDir.symbol || toDir.symbol === ".") {
    return false;
  }

  const diff = [fromPos[0] - toPos[0], fromPos[1] - toPos[1]];
  const match = matchDir(diff, toDir.direction);

  return match;
}

function matchDir(dir: number[], options: number[][]) {
  return options.some(([x, y]) => x === dir[0] && y === dir[1]);
}

function reverseMove([x, y]: number[]) {
  return [x && x * -1, y && y * -1];
}

////

const dots: [number, number][][] = [];
let flatDots: [number, number][] = [];
const borderX = [0];
const borderY = [0];
function part2(line: string) {
  maze.push(line);

  const y = dots.length;
  const dotsLine = line.split("").map((d, id) => {
    if (d === ".") {
      return [id, y];
    }
  }).filter(Boolean) as [number, number][];

  dots.push(dotsLine);
}

const groupedDots: [number, number][][] = [];

function process2() {
  borderX.push(maze[0].length - 1);
  borderY.push(maze.length - 1);

  flatDots = dots.flat();

  const group = walk(maze, flatDots[0], [0, 0]);
  console.log("group", group, group.length, 49);

  // while (flatDots.length > 1) {
  //   const dot = flatDots.splice(0, 1)[0]
  //   addToGroup(dot, groupedDots)

  //   if (flatDots.length === 0) {
  //     return
  //   }
  // }

  // console.log('end of dots');
  // console.log(groupedDots);

  return 0;
}

type Point = number[];

function walk(maze: string[], point: Point, from: Point, result: Point[] = []) {
  console.log("WALK", point, from, result);
  result.push(point);

  for (let i = 0; i < aroundOptions.length; i++) {
    const a = aroundOptions[i];

    if (from[0] === a[0] && from[1] === a[1]) {
      // console.log('skip from');
      continue;
    }

    const nextPoint = [point[0] + a[0], point[1] + a[1]] as Point;
    const isInMaze = isPointOnMaze(nextPoint);
    const isInResult = isPointInResults(nextPoint, result);
    const dir = getDirection(maze, nextPoint);
    if (!isInMaze || isInResult || dir.symbol !== ".") {
      // console.log('skip', nextPoint, { isInMaze, isInResult });
      continue;
    }

    walk(maze, nextPoint, reverseMove(a), result);
  }

  return result;
}

function isPointOnMaze([x, y]: Point) {
  return (x >= borderX[0] && x <= borderX[1]) &&
    (y >= borderY[0] && y <= borderY[1]);
}

function isPointInResults([x, y]: Point, results: Point[]) {
  return results.some(([rx, ry]) => rx === x && ry === y);
}

const closer = [0, 1];
function addToGroup(dot: [number, number], groups: [number, number][][]) {
  const [x, y] = dot;
  // console.log('CHECKING', dot);

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];

    const isTouching = group.some(([gx, gy]) => {
      return closer.includes(Math.abs(gx - x)) &&
        closer.includes(Math.abs(gy - y));
    });

    if (isTouching) {
      group.push(dot);
      return;
    }
  }

  groups.push([dot]);
}

function canPass(dir: Direction, from: number[]) {
  const m = matchDir(from, dir.direction);
  // console.log(dir.symbol, dir.direction, from, m);

  return m;
}

function isPointOnABorder([x, y]: number[]) {
  return borderX.includes(x) || borderY.includes(y);
}

function printMaze(maze: string[], [x, y]: number[]) {
  const mazeToPrint = [...maze];
  const lineArr = mazeToPrint[y].split("");
  lineArr[x] = "※";
  mazeToPrint[y] = lineArr.join("");

  console.log(mazeToPrint.join("\n"));
}

run();
