import { byLine } from '../../utils/files'
import { sum } from '../../utils/numbers'
import { type Answers, InputType, run } from '../../utils/run'

const answers: Answers = {
  test1: 0,
  input1: 0,
  test2: 0,
  input2: 0,
}

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string, type: InputType) {
  const lints = byLine(input)

  return sum([lints.length])
}

function runSecondPart(input: string, type: InputType) {
  const lints = byLine(input)

  return sum([lints.length])
}
