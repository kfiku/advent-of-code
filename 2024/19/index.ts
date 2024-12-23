import { byLine } from '../../utils/files'
import { sum } from '../../utils/numbers'
import { type Answers, InputType, run } from '../../utils/run'

const answers: Answers = {
  test1: 6,
  input1: 0,
  test2: 0,
  input2: 0,
}

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string, type: InputType) {
  const [p, d] = input.split('\n\n')
  const patterns = p.split(', ')
  const designs = d.split('\n')

  const availableDesigns = designs.map((d) => isPatternPossible('', d, patterns)).filter(Boolean)

  return availableDesigns.length
}

function isPatternPossible(current: string, design: string, patterns: string[]) {
  const designLeft = design.substring(current.length, design.length)

  const patternsAvailable = patterns.filter((p) => designLeft.startsWith(p))
  const patternsMatched = patterns.some((p) => design === current + p)

  if (patternsMatched) {
    return true
  }

  if (patternsAvailable.length === 0) {
    return false
  }

  return patternsAvailable.flatMap((p) => isPatternPossible(current + p, design, patterns)).some(Boolean)
}

function runSecondPart(input: string, type: InputType) {
  const lints = byLine(input)

  return sum([lints.length])
}
