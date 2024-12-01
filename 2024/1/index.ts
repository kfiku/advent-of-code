import { byLine } from '../../utils/files';
import { sum } from '../../utils/numbers';
import { type Answers, run } from '../../utils/run';

const answers: Answers = {
  test1: 11,
  input1: 2164381,
  test2: 31,
  input2: 20719933
}

run(runFirstPart, runSecondPart, answers);

function runFirstPart(input: string) {
  const lints = byLine(input)
  const a: number[] = []
  const b: number[] = []
  lints.forEach(line => {
    const [aa, bb] = line.split(/ +/).map(e => +(e.trim()))
    a.push(aa)
    b.push(bb)
  })

  const as = a.sort()
  const bs = b.sort()

  const result = as.map((ae, i) => {
    const be = bs[i]
    return Math.abs(ae - be)
  })

  return sum(result)
}

function runSecondPart(input: string) {
  const lints = byLine(input)
  const a: number[] = []
  const b: number[] = []
  lints.forEach(line => {
    const [aa, bb] = line.split(/ +/).map(e => +(e.trim()))
    a.push(aa)
    b.push(bb)
  })

  const result = a.map((ae, i) => {
    const bm = b.filter((be) => be === ae)
    return ae * bm.length
  })
  
  return sum(result)
}

