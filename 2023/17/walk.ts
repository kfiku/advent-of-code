import {
  cache,
  endPoint,
  isToFarBackwards,
  matchDir,
  matchMove,
  maze,
  minHeat,
  moves,
  Point,
} from "./index.ts";

export function walk(
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
  const cacheKey = x + "," + y;
  const cacheValue = cache.get(cacheKey);

  if (cacheValue) {
    console.log("FROM CACHE:", p, cacheValue);
    // return cacheValue + nextHeat
  }

  if (!pHeat) {
    console.log(p, pHeat);
    return 9999;
  }

  if (isHeatHigher) {
    return 9999;
  }

  if (visited.length > endPoint[0] + endPoint[1] + 5) {
    // console.log('too far');
    return 9999;
  }

  if (x === endPoint[0] && y === endPoint[1]) {
    console.log("HEAT:", nextHeat);
    minHeat = nextHeat;

    return nextHeat;
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
    console.log("SET CACHE:", p, min - heat - pHeat);
  }

  return min;
}
