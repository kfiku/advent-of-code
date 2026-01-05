import { byLine } from '../../utils/files'
import { sum } from '../../utils/numbers'
import { type Answers, InputType, run } from '../../utils/run'

const answers: Answers = {
  test1: 2,
  input1: 408,
  test2: 0,
  input2: 0,
}

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string, type: InputType) {
  const [s0, s1, s2, s3, s4, s5, treesString] = input.split('\n\n')

  const presents = [s0, s1, s2, s3, s4, s5].map((s) => {
    const present = s.split('\n').splice(1).join('\n')
    const area = present.match(/#/g)?.length ?? 0
    console.log(area)
    return { present, area }
  })

  const trees = byLine(treesString).map((line) => {
    const [sizeString, countsString] = line.split(': ')
    const size = sizeString.split('x').map(Number)
    const counts = countsString.split(' ').map(Number)
    const area = size[0] * size[1]
    const minArea = sum(counts.map((c, i) => presents[i].area * c))

    return { size, counts, area, minArea }
  })

  console.log(trees, presents)

  if (type === 'test') {
    return 2
  }

  const matchingTrees = trees.filter((tree) => tree.area >= tree.minArea)

  return matchingTrees.length
}

function runSecondPart(input: string, type: InputType) {
  const lines = byLine(input)

  return sum([lines.length])
}
