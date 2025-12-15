import { byLine } from '../../utils/files'
import { sum } from '../../utils/numbers'
import { type Answers, InputType, run } from '../../utils/run'

const answers: Answers = {
  test1: 7,
  input1: 0,
  test2: 0,
  input2: 0,
}

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string, type: InputType) {
  const lines = parseInput(input)

  const results = [0]
  for (const line of lines) {
    const result = tryToPress([0], line)

    results.push(result)
  }

  return sum(results)
}

function runSecondPart(input: string, type: InputType) {
  const lines = byLine(input)

  return sum([lines.length])
}

function tryToPress(starts: number[], config: ReturnType<typeof parseInput>[number], index = 1) {
  const { buttons, lightBitmask } = config
  const nextStarts = []
  let success = false

  for (let s = 0; s < starts.length; s++) {
    const start = starts[s]

    for (let index = 0; index < buttons.length; index++) {
      const btn = buttons[index]

      const nextStart = start ^ btn

      if (nextStart === lightBitmask) {
        success = true
      }

      nextStarts.push(nextStart)
    }
  }

  if (success) {
    return index
  }

  return tryToPress(nextStarts, config, index + 1)
}

function parseInput(input: string) {
  return byLine(input).map((l) => {
    const [lightString, ...buttonsStrings] = l.split(' ')

    const light = lightString.replaceAll(/(\[|\])/g, '')
    const lightLength = light.length
    const lightArray = light
      .split('')
      .map((l, index) => (l === '#' ? index : undefined))
      .filter((l) => l !== undefined)
    const lightBitmask = arrayToBitmask(lightArray, lightLength)

    const joltage = buttonsStrings
      .splice(-1)[0]
      .replaceAll(/(\{|\})/g, '')
      .split(',')
      .map((j) => +j)

    const buttons = buttonsStrings.map((button) => {
      const array = button
        .replaceAll(/(\(|\))/g, '')
        .split(',')
        .map((j) => +j)

      return arrayToBitmask(array, lightLength)
    })

    return {
      light,
      lightLength,
      lightBitmask,
      buttons,
      joltage,
    }
  })
}

function arrayToBitmask(arr: number[], bits = 4) {
  let mask = 0

  for (const index of arr) {
    mask |= 1 << (bits - 1 - index)
  }

  return mask
}

function bitmaskToBinary(mask: number, bits = 4) {
  return mask.toString(2).padStart(bits, '0')
}

function bitmaskToString(mask: number, bits = 4) {
  return bitmaskToBinary(mask, bits)
    .split('')
    .map((s) => (s === '0' ? '.' : '#'))
    .join('')
}
