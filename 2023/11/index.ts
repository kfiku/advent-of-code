import { lineByLine, printResults } from "../utils/utils.ts";

const part = +Deno.args[0] || 1;
let expandRate = 1;

async function run() {
  if (part === 1) {
    await lineByLine("./input.txt", part1);
    const result = process1();
    printResults(374, result);
  } else {
    expandRate = 1_000_000 - 1
    await lineByLine("./input.txt", part1);
    const result = process1();
    printResults(648458253817, result);
  }
}

interface Galaxy {
  id: number;
  cords: [number, number]
}
const space: string[][] = []
const galaxies: Galaxy[] = []

function part1(line: string) {
  space.push(line.split(''))
}

function process1() {
  expandGalaxy();
  findGalaxies();
  const distances = findDistances()

  return Object.values(distances);
}

function findGalaxies() {
  for (let y = 0; y < space.length; y++) {
    const line = space[y];
    for (let x = 0; x < line.length; x++) {
      const element = line[x];
      if (element === '#') {
        galaxies.push({
          id: galaxies.length + 1,
          cords: [x, y]
        })
      }
    }
  }
}

function findDistances() {
  const distances: Record<string, number> = {}

  for (let i = 1; i < galaxies.length; i++) {
    const g1 = galaxies[i-1];

    for (let j = 1; j < galaxies.length; j++) {
      const g2 = galaxies[j];
      const key = `${g1.id}-${g2.id}`
      const key2 = `${g2.id}-${g1.id}`
      if (distances[key] || distances[key2]) {
        continue
      }
      const diff = Math.abs(g1.cords[0] - g2.cords[0]) + Math.abs(g1.cords[1] - g2.cords[1])
      const emptyLines = getEmptyLinesBetween(g1.cords, g2.cords)

      distances[key] = diff + emptyLines * expandRate
    }
  }

  return distances
}

function getEmptyLinesBetween([ax, ay]: number[], [bx,by]: number[]) {
  let xb = 0
  const startX = ax > bx ? bx : ax
  const endX = ax > bx ? ax : bx
  for (let x = startX; x < endX; x++) {
    if (emptyLines.x.includes(x)) {
      xb++
    }
  }

  let yb = 0
  const startY = ay > by ? by : ay
  const endY = ay > by ? ay : by

  for (let y = startY; y < endY; y++) {
    if (emptyLines.y.includes(y)) {
      yb++
    }
  }

  return xb + yb
}

const emptyLines = {
  x: [-1],
  y: [-1]
}
function expandGalaxy() {
  // vertical
  for (let i = 0; i < space.length; i++) {
    const l = space[i];
    const isEmpty = !l.includes('#')

    if (isEmpty) {
      emptyLines.y.push(i)
      // expandTimes(i, l)
      // i += expandRate
    }
  }

  // horizontal
  for (let j = 0; j < space[0].length; j++) {
    const l = getHorizontalLine(j);
    const isEmpty = !l.includes('#')

    if (isEmpty) {
      emptyLines.x.push(j)
      // insertHorizontalLine(j)
      // j += expandRate
    }
  }
}

function expandTimes(i: number, l: string[]) {
  for (let j = 0; j < expandRate; j++) {
    space.splice(i, 0, [...l])
  }
}

function getHorizontalLine(i: number) {
  return space.map(l => l[i])
}

function insertHorizontalLine(i: number) {
  return space.forEach(l => {
    for (let j = 0; j < expandRate; j++) {
      l.splice(i, 0, l[i])
    }
  })
}

run();
