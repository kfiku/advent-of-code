import { lineByLine, printResults } from "../utils/utils.ts";

const part = +Deno.args[0] || 1;

async function run() {
  if (part === 1) {
    await lineByLine("./input.txt", part1);
    const result = process1();
    printResults(8, [result]);
  } else {
    await lineByLine("./input.txt", part2);
    const result = process2();

    printResults(0, [result]);
  }
}

// directions from left to right
// directions from top to bottom
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

const aroundOptions = [
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
  const symbol = maze[y][x] as Sym;
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

const dots: string[][] = []
function part2(line: string) {
  const dotsLine = line.split('').filter(d => d === '.');
  dots.push(dotsLine);
}

function process2() {
  return 0;
}

function printMaze(maze: string[], [x, y]: number[]) {
  const mazeToPrint = [...maze];
  const lineArr = mazeToPrint[y].split("");
  lineArr[x] = "※";
  mazeToPrint[y] = lineArr.join("");

  console.log(mazeToPrint.join("\n"));
}

run();
