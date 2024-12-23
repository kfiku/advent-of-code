import { type Answers, InputType, run } from '../../utils/run'

const answers: Answers = {
  test1: 6,
  input1: 317,
  test2: 16,
  input2: 0,
}

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string, type: InputType) {
  const [p, d] = input.split('\n\n')
  const patterns = p.split(', ')
  const designs = d.split('\n')

  const availableDesigns = designs.filter((design) => {
    const designPatterns = patterns.filter((pattern) => design.includes(pattern))

    return isPatternPossible('', design, designPatterns) === true
  })

  return availableDesigns.length
}

function runSecondPart(input: string, type: InputType) {
  const [p, d] = input.split('\n\n')
  const patterns = p.split(', ')
  const designs = d.split('\n')

  const availableDesigns = designs.flatMap((design, i) => {
    const designPatterns = patterns.filter((pattern) => design.includes(pattern))

    console.log(i + 1)

    return getPossiblePattern('', design, designPatterns)
  })

  return availableDesigns.length
}

function isPatternPossible(current: string, design: string, patterns: string[], cache = new Map<string, boolean>()) {
  const designLeft = design.substring(current.length, design.length)
  const key = current + '_' + design

  if (cache.has(key)) {
    return false
  }

  cache.set(key, true)

  const patternsMatched = patterns.some((pattern) => design === current + pattern)
  if (patternsMatched) {
    return true
  }

  const patternsAvailable = patterns.filter((p) => designLeft.startsWith(p))

  if (patternsAvailable.length === 0) {
    return false
  }

  return patternsAvailable
    .flatMap((pattern) => isPatternPossible(current + pattern, design, patterns, cache))
    .some(Boolean)
}

function getPossiblePattern(current: string, design: string, patterns: string[], cache = new Map<string, boolean>()) {
  const designLeft = design.substring(current.length, design.length)
  const key = current + '_' + design

  if (cache.has(key)) {
    return false
  }

  cache.set(key, true)

  const patternsMatched = patterns.some((pattern) => design === current + pattern)
  if (patternsMatched) {
    return true
  }

  const patternsAvailable = patterns.filter((p) => designLeft.startsWith(p))

  if (patternsAvailable.length === 0) {
    return false
  }

  return patternsAvailable.flatMap((pattern) => getPossiblePattern(current + pattern, design, patterns))
}
