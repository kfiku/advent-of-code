import { lineByLine, printResults } from "../utils/utils.ts";

const part = +Deno.args[0] || 1;

async function run() {
  if (part === 1) {
    await lineByLine("./input.txt", part1);

    const result = process();

    printResults(35, [result]);
  } else {
    // await lineByLine("./input.txt", part2);

    // printResults(30, [cards]);
  }
}

interface Mapper {
  name: string;
  maps: {
    src: [number, number];
    destFrom: number;
  }[];
}

let seeds: number[] = [];
let currentMap: Partial<Mapper> = {};
const maps: Mapper[] = [];

function process() {
  const locationResults = seeds.map((seed) =>
    maps.reduce((acc, curr) => {
      const map = curr.maps.find((map) =>
        acc >= map.src[0] && acc <= map.src[1]
      );

      if (map) {
        return map.destFrom + (acc - map.src[0]);
      }

      return acc;
    }, seed)
  );

  return locationResults.sort((a, b) => {
    return a - b;
  })[0];
}

function part1(line: string) {
  if (!seeds.length) {
    seeds = line.split("seeds: ")[1].split(" ").map((seed) => +seed);

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
