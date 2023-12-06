import { lineByLine, printResults } from "../utils/utils.ts";

// const part = +Deno.args[0] || 1;

async function run() {
  await lineByLine("./input.txt", part1);

  const result = process();

  printResults(46, [result]);
}

interface Mapper {
  name: string;
  maps: {
    src: [number, number];
    destFrom: number;
  }[];
}

const seeds: [number, number][] = [];
let currentMap: Partial<Mapper> = {};
const maps: Mapper[] = [];

function process() {
  let minResult = Infinity;

  seeds.forEach(([start, end], id) => {
    console.log(`${id}/${seeds.length}`, start, end);
    for (let i = start; i < end; i++) {
      const result = maps.reduce((acc, curr) => {
        // console.log(acc);

        const map = curr.maps.find((map) =>
          acc >= map.src[0] && acc <= map.src[1]
        );

        if (map) {
          return map.destFrom + (acc - map.src[0]);
        }

        return acc;
      }, i);

      if (minResult > result) {
        minResult = result;
      }
    }
  });

  return minResult;
}

function part1(line: string) {
  if (!seeds.length) {
    const seedPairs = line.split("seeds: ")[1].split(" ").map((seed) => +seed);
    seedPairs.forEach((end, id) => {
      if (id % 2 !== 0) {
        const start = seedPairs[id - 1];
        seeds.push([start, start + end - 1]);
      }
    });

    return;
  }

  if (!currentMap.name) {
    currentMap.name = line.replace(" map:", "");

    return;
  }

  if (line === "") {
    maps.push(currentMap as Mapper);
    currentMap = {};
  } else {
    if (!currentMap.maps) {
      currentMap.maps = [];
    }
    const [dest, src, range] = line.split(" ").map((d) => +d);

    currentMap.maps.push({
      src: [src, src + range - 1],
      destFrom: dest,
    });
  }
}

function part2(line: string) {
}

run();
