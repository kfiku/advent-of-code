import { printResults, sum } from '../utils/utils.ts'
import { readFileLineByLine } from '../utils/denoUtils.ts'

const part = +Deno.args[0] || 1

async function run() {
  if (part === 1) {
    await readFileLineByLine('./input.txt', part1)
    const result = process1()
    printResults(405, result)
  } else {
    await readFileLineByLine('./input.txt', part1)
    const result = process2()
    printResults(400, result)
  }
}

const mirrors: string[][] = [[]]
let mirrorId = 0
function part1(line: string) {
  if (line.trim() === '') {
    mirrorId++
    mirrors.push([])
    return
  }

  mirrors[mirrorId].push(line)
}

function process2() {
  const counts: number[] = []

  for (let id = 0; id < mirrors.length; id++) {
    const mirror = mirrors[id]

    const v1 = findVerticalReflection(mirror)
    const h1 = findHorizontalReflection(mirror)
    let v2 = findVerticalSmudge(mirror)
    let h2 = findHorizontalSmudge(mirror)

    if (v1 === v2) {
      v2 = 0
    }

    if (h1 === h2) {
      h2 = 0
    }

    const result = v2 + h2 * 100
    if (result === 0) {
      console.log({
        v1,
        h1,
        v2,
        h2,
      })

      console.log('AAAAA')
    }
    counts.push(result)
  }

  return counts
}

function process1() {
  const counts: number[] = []

  for (let id = 0; id < mirrors.length; id++) {
    const mirror = mirrors[id]

    const v = findVerticalReflection(mirror)
    const h = findHorizontalReflection(mirror)

    const result = v + h * 100

    if (result === 0) {
      console.log('ERROR')
    }

    counts.push(result)
  }

  return counts
}

function findVerticalSmudge(mirror: string[]) {
  const m2 = arrayReverse(mirror)

  return findHorizontalSmudge(m2)
}

function findHorizontalSmudge(mirror: string[]) {
  for (let i = 0; i < mirror.length; i++) {
    if (isHorizontalReflection(mirror, i, 1)) {
      // console.log('REFLECTION at', i);
      return i + 1
    }
  }

  return 0
}

function findVerticalReflection(mirror: string[]) {
  const m2 = arrayReverse(mirror)

  return findHorizontalReflection(m2)
}

function arrayReverse(arr: string[]) {
  const newArr: string[] = []

  for (let y = 0; y < arr.length; y++) {
    const a = arr[y]
    for (let x = 0; x < a.length; x++) {
      if (!newArr[x]) {
        newArr[x] = ''
      }
      const b = a[x]
      newArr[x] += b
    }
  }

  return newArr
}

function findHorizontalReflection(mirror: string[]) {
  for (let i = 0; i < mirror.length; i++) {
    if (isHorizontalReflection(mirror, i)) {
      // console.log('REFLECTION at', i);
      return i + 1
    }
  }

  return 0
}

function isHorizontalReflection(mirror: string[], id: number, requiredError = 0) {
  let oneMatch = false
  let errors = 0

  for (let i = 0; i < mirror.length - id; i++) {
    const l1 = mirror[id - i]
    const l2 = mirror[id + i + 1]

    if (l1 && l1 === l2) {
      oneMatch = true
    } else if (oneMatch && (!l1 || !l2)) {
      // console.log('reflection continues');
    } else {
      errors += getMissCount(l1, l2, oneMatch)
      if (errors > requiredError) {
        return false
      } else {
        oneMatch = true
      }
    }
  }

  return errors === requiredError
}

function getMissCount(a: string, b: string, oneMatch: boolean) {
  let misses = 0

  if (!a || !b) {
    return oneMatch ? 0 : 999
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      misses++
    }
  }

  return misses
}

run()
