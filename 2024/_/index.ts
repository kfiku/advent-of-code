import { byLine } from '../../utils/files';
import { sum } from '../../utils/numbers';
import { type Answers, run } from '../../utils/run';

const answers: Answers = {
  test1: 77,
  input1: 54304,
  test2: 281,
  input2: 54418
}

run(runFirstPart, runSecondPart, answers);

function runFirstPart(input: string) {
  const lints = byLine(input)

  return sum([lints.length])
}

function runSecondPart(input: string) {
  const lints = byLine(input)
  
  return sum([lints.length])
}
