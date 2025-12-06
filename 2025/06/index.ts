import { byLine } from '../../utils/files'
import { sum } from '../../utils/numbers'
import { type Answers, InputType, run } from '../../utils/run'

const answers: Answers = {
  test1: 4277556,
  input1: 4580995422905,
  test2: 3263827,
  input2: 10875057285868,
}

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string, type: InputType) {
  const lines = byLine(input)
  const cols = lines.map((l) =>
    l
      .trim()
      .split(/ +/)
      .map((n) => +n || n),
  )

  const operationIndex = cols.length - 1
  const results = cols[0].map((c, i) => {
    const list = cols.map((c) => c[i]).filter((n) => Number.isInteger(n)) as number[]
    const operation = cols[operationIndex][i]

    let res = 0
    if (operation === '*') {
      res = list.reduce((acc, curr) => acc * curr, 1)
    } else {
      res = list.reduce((acc, curr) => acc + curr, 0)
    }

    return res
  })

  return sum(results)
}

function runSecondPart(input: string, type: InputType) {
  const lines = byLine(input)
  const operationIndex = lines.length - 1
  const splits: number[] = []

  for (let index = 0; index < lines[operationIndex].length; index++) {
    const e = lines[operationIndex][index]

    if (e !== ' ') {
      splits.push(index)
    }
  }

  const cols: number[][] = []
  const operations: string[] = []

  for (let index = 0; index < splits.length; index++) {
    const s1 = splits[index]
    const s2 = splits[index + 1] ? splits[index + 1] - 1 : Infinity

    const op = lines.map((l) => l.slice(s1, s2))
    const strings = op.splice(0, operationIndex)
    const numbers = strings[0].split('').map((d, index) => {
      return +strings
        .map((s) => s[index])
        .join('')
        .trim()
    })
    operations.push(op[0].trim())
    cols.push(numbers)
  }

  const results = cols.map((c, index) => {
    const operation = operations[index]

    let res = 0
    if (operation === '*') {
      res = c.reduce((acc, curr) => acc * curr, 1)
    } else {
      res = c.reduce((acc, curr) => acc + curr, 0)
    }

    return res
  })

  return sum(results)
}
