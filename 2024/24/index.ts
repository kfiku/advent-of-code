import { byLine } from '../../utils/files'
import { sum } from '../../utils/numbers'
import { type Answers, InputType, run } from '../../utils/run'

const answers: Answers = {
  test1: 2024,
  input1: 38869984335432,
  test2: 0,
  input2: 0,
}

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string, type: InputType) {
  const [i, o] = input.split('\n\n')
  const inputs = byLine(i).reduce((acc, curr) => {
    const [key, val] = curr.split(': ')
    return { ...acc, [key]: +val }
  }, {})

  let operates = byLine(o).map((oo) => {
    const [ooo, output] = oo.split(' -> ')
    const [left, operator, right] = ooo.split(' ')

    return { left, operator, right, output }
  }, [])

  while (operates.length > 0) {
    for (let index = 0; index < operates.length; index++) {
      const { left, right, operator, output } = operates[index]
      const leftValue = inputs[left]
      const rightValue = inputs[right]

      if (leftValue !== undefined && rightValue !== undefined) {
        operates.splice(index, 1)
        const returnValue = process(leftValue, rightValue, operator)

        if (inputs[output] === undefined) {
          inputs[output] = returnValue
        }

        // console.log(leftValue, operator, rightValue, '=>', output, returnValue)
      }
    }
  }

  const z = Object.entries(inputs)
    .filter(([key]) => key.startsWith('z'))
    .map(([key, val]) => ({ key, val, index: +key.replace('z', '') }))
    .sort((a, b) => a.index - b.index)
    .map(({ val }) => val)
    .reverse()
    .join('')

  const result = parseInt(z, 2)

  return result
}

function process(a: number, b: number, operator: string) {
  if (operator === 'XOR') {
    return a ^ b
  }

  if (operator === 'OR') {
    return a || b
  }

  if (operator === 'AND') {
    return a && b
  }

  throw new Error('unknown operator')
}

function runSecondPart(input: string, type: InputType) {
  const lints = byLine(input)

  return sum([lints.length])
}
