import { printResults } from "../utils/utils.ts";
import { part, file, readFileLineByLine } from "../utils/bunUtils.ts";


async function run() {
  if (part === 1) {
    await readFileLineByLine(file, part1);
    const result = process1();
    printResults(19114, result);
  } else {
    await readFileLineByLine(file, part1);
    const result = process1();
    printResults(145, result);
  }
}

type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
}
type Rule = {
  key?: string;
  operator?: string;
  value?: number;
  result: string;
}
type Process = (part: Part) => string;
type Workflow = {
  name: string;
  rules: Rule[];
  process: Process;
}

let fillInParts = false
const workflows = new Map<string, Workflow>()
const parts: Part[] = []

function part1(line: string) {
  if (line.trim() === '') {
    fillInParts = true

    return;
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
      .map(r => {
        const [a, b] = r.split(':')

        if (!b) {
          return {
            result: a
          }
        }

        const key = a.slice(0,1)
        const operator = a.slice(1,2)
        const value = +a.slice(2)

        return {
          key,
          operator,
          value,
          result: b,
        }
      })

    const fnString = `(part) => {
      ${rules.map(({key, operator, value, result }) => !key
        ? `return "${result}"`
        : `if (part["${key}"] ${operator} ${value}) {
            return "${result}"
          }`
      ).join('\n')}
    }`
    const process = eval(fnString)

    const workflow: Workflow = {
      name,
      rules,
      process,
    }

    workflows.set(name, workflow)
  }

  // steps.push(step)
}


function process1() {
  const acceptedParts: Part[] = []
  for (let i = 0; i < parts.length; i++) {
    const part = processPart(parts[i])

    if (part) {
      acceptedParts.push(part)
    }
  }

  const aps = acceptedParts.map(({x, m, a, s}) => x+m+a+s)

  return aps
}

function processPart(part: Part) {
  let workflowName = "in";
  let result = "";

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

run();
