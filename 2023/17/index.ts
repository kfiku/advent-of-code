import { printResults, sum } from "../utils/utils.ts";
import { file, part, readFileLineByLine } from "../utils/bunUtils.ts";

async function run() {
  console.clear();
  if (part === 1) {
    await readFileLineByLine(file, part1);
    const result = process1();
    printResults(42, result);
    printResults(102, result);
  } else {
    await readFileLineByLine(file, part1);
    const result = process2();
    printResults(145, result);
  }
}

const maze: number[][] = [];
type Point = readonly [number, number];
let endPoint: Point;
let minHeat = 9999;

// WRONG: 1541

function part1(line: string) {
  const y = maze.length;
  const ll = line.split("");

  if (!maze[y]) {
    maze[y] = [];
  }

  for (let x = 0; x < ll.length; x++) {
    maze[y][x] = +ll[x];
  }
}

function process1() {
  endPoint = [maze[0].length - 1, maze.length - 1];
  console.log("END POINT", maze[endPoint[1]][endPoint[0]]);

  const minHeatLoss = walk([1, 0], [0, 0], maze[0]?.[0] * -1);
  return minHeatLoss || 0;
}

const moves = {
  up: [0, -1],
  right: [1, 0],
  down: [0, 1],
  left: [-1, 0],
} as const;

const cache = new Map<string, number>();
function walk(
  from: Point,
  p: Point,
  heat = 0,
  movesForwardInRow = 1,
  visited: Point[] = [],
): number {
  const [x, y] = p;
  const [fx, fy] = from;
  const pHeat = maze[y]?.[x];
  const nextHeat = heat + pHeat;
  const isHeatHigher = nextHeat >= minHeat;

  if (!pHeat) {
    console.log(p, pHeat);
    return 9999;
  }

  if (isHeatHigher) {
    return 9999;
  }

  if (x === endPoint[0] && y === endPoint[1]) {
    console.log("HEAT:", nextHeat);
    minHeat = nextHeat;

    return nextHeat;
  }

  const cacheKey = x + "," + y + ";" + fx + "," + fy + ";" + movesForwardInRow;
  const cacheValue = cache.get(cacheKey);
  if (cacheValue) {
    // console.log('FROM CACHE:', p, cacheValue);

    // return cacheValue + nextHeat
  }

  if (isToFarBackwards(visited, p)) {
    return 9999;
  }

  if (matchDir(p, visited)) {
    // console.log('WAS VISITED', p);
    return 9999;
  }

  const nextVisited = [...visited, p];

  const canGoForward = movesForwardInRow < 3;
  const canGoUp = fy === 0 && !matchMove(moves.up, from);
  const canGoDown = fy === 0 && !matchMove(moves.down, from);
  const canGoRight = fx === 0 && !matchMove(moves.right, from);
  const canGoLeft = fx === 0 && !matchMove(moves.left, from);
  const results: number[] = [];

  // printRoad(nextVisited)

  if (canGoForward) {
    const next: Point = [x + fx, y + fy];

    if (maze[next[1]]?.[next[0]]) {
      const result = walk(
        from,
        next,
        nextHeat,
        movesForwardInRow + 1,
        nextVisited,
      );
      results.push(result);
    }
  }

  if (canGoDown) {
    const [nx, ny] = moves.down;
    const next: Point = [x + nx, y + ny];

    if (maze[next[1]]?.[next[0]]) {
      const result = walk(moves.down, next, nextHeat, 1, nextVisited);
      results.push(result);
    }
  }

  if (canGoRight) {
    const [nx, ny] = moves.right;
    const next: Point = [x + nx, y + ny];

    if (maze[next[1]]?.[next[0]]) {
      const result = walk(moves.right, next, nextHeat, 1, nextVisited);
      results.push(result);
    }
  }

  if (canGoLeft) {
    const [nx, ny] = moves.left;
    const next: Point = [x + nx, y + ny];

    if (maze[next[1]]?.[next[0]]) {
      const result = walk(moves.left, next, nextHeat, 1, nextVisited);
      results.push(result);
    }
  }

  if (canGoUp) {
    const [nx, ny] = moves.up;
    const next: Point = [x + nx, y + ny];

    if (maze[next[1]]?.[next[0]]) {
      const result = walk(moves.up, next, nextHeat, 1, nextVisited);
      results.push(result);
    }
  }

  const min = Math.min(9999, ...results);

  if (min < 9999) {
    cache.set(cacheKey, min - heat - pHeat);
    // console.log('SET CACHE:', p, min - heat - pHeat);
  }

  return min;
}

function isToFarBackwards(visited: Point[], [x, y]: Point) {
  const [fx, fy] = visited.reduce(([ax, ay], [cx, cy]) => {
    return [Math.max(ax, cx), Math.max(ay, cy)];
  }, [0, 0] as Point);

  const isToFar = fx - x > 3 || fy - y > 3;

  return isToFar;
}

function matchMove([x1, y1]: Point, [x2, y2]: Point) {
  return x1 === x2 && y1 === y2;
}

function matchDir(dir: Point, options: Point[]) {
  return options.some(([x, y]) => x === dir[0] && y === dir[1]);
}

function printRoad(t: Point[]) {
  console.log(
    maze.map((ll, y) =>
      ll.map((l, x) => {
        return matchDir([x, y], t) ? "#" : ".";
      }).join("")
    ).join("\n"),
  );
}

run();
