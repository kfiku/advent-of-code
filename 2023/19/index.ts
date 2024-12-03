import { printResults, sum } from '../utils/utils.ts'
import { file, part, readFileLineByLine } from '../utils/bunUtils.ts'
import '@total-typescript/ts-reset'

async function run() {
  if (part === 1) {
    await readFileLineByLine(file, part1)
    const result = process1()
    printResults(19114, result)
  } else {
    await readFileLineByLine(file, part1)
    const result = process2()
    printResults(167409079868000, result)
  }
}

type Part = {
  x: number
  m: number
  a: number
  s: number
}
type PartRange = {
  x: number[]
  m: number[]
  a: number[]
  s: number[]
  result: string
}
type Rule = {
  key?: string
  operator?: string
  value?: number
  result: string
}
type Process = (part: Part) => string
type Workflow = {
  name: string
  rules: Rule[]
  process: Process
}

let fillInParts = false
const workflows = new Map<string, Workflow>()
const parts: Part[] = []

function part1(line: string) {
  if (line.trim() === '') {
    fillInParts = true

    return
  }

  if (fillInParts) {
    const la = line.split(',')
    const part = la.reduce((acc, curr) => {
      const [key, value] = curr.replace(/(\{|\})/g, '').split('=')
      return {
        ...acc,
        [key]: +value,
      }
    }, {}) as Part

    parts.push(part)
  } else {
    const [name, rulesString] = line.split('{')
    const rules: Rule[] = rulesString
      .replace(/(\{|\})/g, '')
      .split(',')
      .map((r) => {
        const [a, b] = r.split(':')

        if (!b) {
          return {
            result: a,
          }
        }

        const key = a.slice(0, 1)
        const operator = a.slice(1, 2)
        const value = +a.slice(2)

        return {
          key,
          operator,
          value,
          result: b,
        }
      })

    const fnString = `(part) => {
      ${rules
        .map(({ key, operator, value, result }) =>
          !key
            ? `return "${result}"`
            : `if (part["${key}"] ${operator} ${value}) {
            return "${result}"
          }`,
        )
        .join('\n')}
    }`
    const process = eval(fnString)

    const workflow: Workflow = {
      name,
      rules,
      process,
    }

    workflows.set(name, workflow)
  }
}

function process1() {
  const acceptedParts: Part[] = []
  for (let i = 0; i < parts.length; i++) {
    const part = processPart(parts[i])

    if (part) {
      acceptedParts.push(part)
    }
  }

  console.log(acceptedParts)

  const aps = acceptedParts.map(({ x, m, a, s }) => x + m + a + s)

  return aps
}

function processPart(part: Part) {
  let workflowName = 'in'
  let result = ''

  while (!result) {
    const workflow = workflows.get(workflowName)

    if (workflow) {
      workflowName = workflow.process(part)
    } else {
      result = workflowName
    }
  }

  return result === 'A' ? part : null
}

function process2() {
  let newPr: PartRange[] = [{ x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000], result: 'in' }]

  let result = ''

  while (!result) {
    const nextPr: PartRange[][] = []

    const possible = newPr.filter(({ result }) => workflows.has(result))
    const noMoreWF = possible.length === 0

    if (noMoreWF) {
      result = '1'
    }

    for (let i = 0; i < newPr.length; i++) {
      const partRange = newPr[i]
      const workflow = workflows.get(partRange.result)

      if (workflow) {
        const next = processPartRangeInWorkflow(partRange, workflow)
        nextPr.push(next)
      } else {
        if (partRange.result === 'A') {
          nextPr.push([partRange])
        }
      }
    }

    newPr = nextPr.flat()
  }

  const accepted = newPr.filter(({ result }) => result === 'A')

  // const volume = getVolume(accepted);
  const testData: PartRange[] = [
    { x: [0, 10], m: [0, 10], a: [0, 10], s: [-1, 10], result: 'A' },
    { x: [-1, 1], m: [0, 10], a: [0, 10], s: [0, 10], result: 'B' },
    { x: [0, 10], m: [0, 10], a: [-1, 10], s: [0, 10], result: 'C' },
  ]
  const volume = getVolume(testData)

  return volume
}

function getVolume(allRanges: PartRange[], fullVolume = 0) {
  for (let i = 0; i < allRanges.length; i++) {
    const range = allRanges[i]
    const rests = allRanges.slice(i + 1)

    const volume = getHyperVolume(range)

    const commons = rests.map((r) => findCommonRange([range, r])).filter(Boolean)

    let commonsVolume = 0

    if (commons.length === 1) {
      console.log('one common volume', commons.length)
      commonsVolume += getHyperVolume(commons[0])
    } else if (commons.length > 1) {
      // multiple commons
      console.log('multiple common volume', commons.length, commons)
      const common0 = commons[0]
      const commonCommons = commons
        .slice(1)
        .map((r) => findCommonRange([common0, r]))
        .filter(Boolean)

      if (commonCommons.length === 0) {
        // NO common commons
        console.log('OK ? 3')

        commonsVolume += sum(commons.map((c) => getHyperVolume(c)))
      } else if (commonCommons.length === 1) {
        commonsVolume += sum(commons.map((c) => getHyperVolume(c))) - getHyperVolume(commonCommons[0])
        console.log('ERROR 1')
      } else {
        console.log('ERROR 2')
      }
    } else {
      console.log('no common volume', commons.length)
    }

    console.log(
      range.result,
      rests.map((r) => r.result),
      volume,
      commonsVolume,
    )

    fullVolume += volume - commonsVolume
  }

  return fullVolume

  // const volumes = allRanges.reduce((acc, partRange) => {
  //   const volume = getHyperVolume(partRange);

  //   return acc + volume;
  // }, 0);

  // const diff = commonRanges(allRanges);
  // return diff;
}

function equal(a: any, b: any) {
  return JSON.stringify(a) === JSON.stringify(b)
}

function getHyperVolume({ x, m, a, s }: PartRange) {
  return 1 * (x[1] - x[0]) * (m[1] - m[0]) * (a[1] - a[0]) * (s[1] - s[0])
}

function processPartRangeInWorkflow(pr: PartRange, w: Workflow) {
  let newPr: PartRange[] = []
  let nextPr: PartRange

  for (let i = 0; i < w.rules.length; i++) {
    const { key, operator, value, result } = w.rules[i]

    if (operator && key && value) {
      let newValue, nextValue
      if (operator === '<') {
        if (pr[key][0] > value - 1) {
          nextValue = pr[key]
        } else if (pr[key][1] < value - 1) {
          newValue = pr[key]
        } else {
          newValue = [pr[key][0], value - 1]
          nextValue = [value + 1, pr[key][1]]
        }
      } else {
        if (pr[key][1] < value - 1) {
          nextValue = pr[key]
        } else if (pr[key][0] > value - 1) {
          newValue = pr[key]
        } else {
          newValue = [value + 1, pr[key][1]]
          nextValue = [pr[key][0], value - 1]
        }
      }

      if (newValue) {
        newPr.push({
          ...pr,
          [key]: newValue,
          result: result,
        })
      }

      if (nextValue) {
        nextPr = {
          ...pr,
          [key]: nextValue,
        }
      }
    } else {
      if (result === 'R') {
        continue
      }

      newPr.push({ ...nextPr, result: result })
    }
  }

  return newPr
}

run()

function findCommonRange(sets: PartRange[]) {
  let commonRange = {
    x: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
    m: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
    a: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
    s: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
    result: 'A',
  }

  sets.forEach((set) => {
    commonRange.x = [Math.max(commonRange.x[0], set.x[0]), Math.min(commonRange.x[1], set.x[1])]
    commonRange.m = [Math.max(commonRange.m[0], set.m[0]), Math.min(commonRange.m[1], set.m[1])]
    commonRange.a = [Math.max(commonRange.a[0], set.a[0]), Math.min(commonRange.a[1], set.a[1])]
    commonRange.s = [Math.max(commonRange.s[0], set.s[0]), Math.min(commonRange.s[1], set.s[1])]
  })

  if (
    commonRange.x[0] > commonRange.x[1] ||
    commonRange.m[0] > commonRange.m[1] ||
    commonRange.a[0] > commonRange.a[1] ||
    commonRange.s[0] > commonRange.s[1]
  ) {
    return null
  }

  return commonRange
}
