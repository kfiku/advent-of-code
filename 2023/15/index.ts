import { lineByLine, printResults, sum } from "../utils/utils.ts";

const part = +Deno.args[0] || 1;

async function run() {
  if (part === 1) {
    await lineByLine("./input.txt", part1);
    const result = process1();
    printResults(1320, result);
  } else {
    await lineByLine("./input.txt", part1);
    const result = process2();
    printResults(145, result);
  }
}

let inputs: string[] = [];

function part1(line: string) {
  inputs = line.split(",");
}

function process1() {
  let values: number[] = []

  for (let i = 0; i < inputs.length; i++) {
    values.push(countInput(0, inputs[i]))
  }

  return values
}

function process2() {
  const boxes: Record<string, number>[] = []
  const labelsInBoxes: Record<string, number> = {}

  for (let i = 0; i < inputs.length; i++) {
    const [label, lens] = inputs[i].split("=")
    let labelToRemove
    if (inputs[i].includes("-")) {
      labelToRemove = inputs[i].split("-")[0]
      const boxId = labelsInBoxes[labelToRemove]
      if(boxes[boxId]?.[labelToRemove]) {
        // console.log('to remove', labelToRemove, "from box", boxId, labelsInBoxes);
        delete boxes[boxId]?.[labelToRemove]
        delete labelsInBoxes[labelToRemove]
      }
    } else {
      const boxId = countLens(label)

      if(!boxes[boxId]) {
        boxes[boxId] = {}
      }

      boxes[boxId] = {
        ...boxes[boxId],
        [label]: +lens,
      }

      labelsInBoxes[label] = boxId

      // console.log(boxes[boxId]);
    }
  }

  const values = [0]

  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i];

    if (box) {
      Object.entries(box).forEach(([, value], id) => {
        console.log("BOX", i, id+1, value);
        values.push((i+1) * (id+1) * value)
      })
    }
  }



  return values
}

function countInput(startValue: number, input: string) {
  let v = startValue

  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    v = ((v + code) * 17) % 256
  }

  return v
}

function countLens(input: string) {
  let v = 0

  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    v = ((v + code) * 17) % 256
  }

  return v
}


run();
