import { lineByLine, printResults, sum } from "../utils/utils.ts";

const part = +Deno.args[0] || 1;

async function run() {
  if (part === 1) {
    await lineByLine("./input.txt", part1);
    const result = process1();
    printResults(136, result);
  } else {
    await lineByLine("./input.txt", part1);
    const result = process2();
    printResults(400, result);
  }
}

let lines: string[][] = [];

function part1(line: string) {
  lines.push(line.split(''))
}

function process2() {
  const full = 1_000_000_000
  const onePercentile = full / 1000

  for (let i = 0; i < 1_000_000_000; i++) {
    if (i % onePercentile === 0) {
      console.log((i / onePercentile) / 10 + "%");
    }
    spinCycle()
  }

  print()

  return count();
}

function spinCycle() {
  for (let x = 0; x < lines[0].length; x++) {
    for (let y  = 0; y < lines.length; y++) {
      const d = lines[y][x];
      if (d === 'O') {
        moveNorth(lines, x, y)
      }
    }
  }
  // print()
  // console.log('==========');

  for (let x = 0; x < lines[0].length; x++) {
    for (let y  = 0; y < lines.length; y++) {
      const d = lines[y][x];
      if (d === 'O') {
        moveWest(lines, x, y)
      }
    }
  }
  // print()
  // console.log('==========');

  for (let x = 0; x < lines[0].length; x++) {
    for (let y = lines.length - 1; y >= 0; y--) {
      const d = lines[y][x];
      if (d === 'O') {
        moveSouth(lines, x, y)
      }
    }
  }
  // print()
  // console.log('==========');

  for (let x = lines[0].length -1; x >= 0; x--) {
    for (let y  = 0; y < lines.length; y++) {
      const d = lines[y][x];
      if (d === 'O') {
        moveEast(lines, x, y)
      }
    }
  }
  // print()
  // console.log('==========');
}

function process1() {
  for (let x = 0; x < lines[0].length; x++) {
    for (let y  = 0; y < lines.length; y++) {
      const d = lines[y][x];
      if (d === 'O') {
        moveNorth(lines, x, y)
      }
    }
  }

  print();

  return count();
}

function count() {
  const counts: number[] = [];
  for (let x = 0; x < lines[0].length; x++) {
    for (let y = 0; y < lines.length; y++) {
      const d = lines[y][x];
      if (d === 'O') {
        const score = lines.length - y;
        counts.push(score);
      }
    }
  }

  return counts;
}

function print() {
  console.log(lines.map(l => l.join("")).join('\n'));
}

function moveNorth(lines: string[][], x: number, y: number) {
  let ny = y;
  let canGoNorth = y !== 0;
  while(canGoNorth) {
    const nextD = lines[ny-1]?.[x] || '#';
    canGoNorth = ny > 0 && nextD === '.'
    if (canGoNorth) {
      ny--
    }
  }

  if (ny !== y) {
    lines[ny][x] = "O"
    lines[y][x] = "."
  }
}

function moveWest(lines: string[][], x: number, y: number) {
  let nx = x;
  let canGoWest = x !== 0;

  while(canGoWest) {
    const nextD = lines[y]?.[nx-1] || '#';
    canGoWest = nx > 0 && nextD === '.'
    if (canGoWest) {
      nx--
    }
  }

  if (nx !== x) {
    lines[y][nx] = "O"
    lines[y][x] = "."
  }
}

function moveSouth(lines: string[][], x: number, y: number) {
  let ny = y;
  let canGoNorth = y !== lines.length -1;
  while(canGoNorth) {
    const nextD = lines[ny+1]?.[x] || '#';
    canGoNorth = ny < lines.length -1 && nextD === '.'
    if (canGoNorth) {
      ny++
    }
  }

  if (ny !== y) {
    lines[ny][x] = "O"
    lines[y][x] = "."
  }
}

function moveEast(lines: string[][], x: number, y: number) {
  let nx = x;
  let canGoWest = x !== lines[0].length -1;

  while(canGoWest) {
    const nextD = lines[y]?.[nx+1] || '#';
    canGoWest = nx <  lines[0].length -1 && nextD === '.'
    if (canGoWest) {
      nx++
    }
  }

  if (nx !== x) {
    lines[y][nx] = "O"
    lines[y][x] = "."
  }
}

function arrayRotate(arr: string[][]) {
  const newArr: string[][] = [];

  for (let y = 0; y < arr.length; y++) {
    const a = arr[y];
    for (let x = 0; x < a.length; x++) {
      const nx = a.length - x - 1
      if (!newArr[nx]) {
        newArr[nx] = Array.from(new Array(arr.length));
      }
      const b = a[x];
      newArr[nx][y] = b;
    }
  }

  return newArr;
}


run();
