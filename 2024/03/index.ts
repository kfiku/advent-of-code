import { byLine } from '../../utils/files'
import { sum } from '../../utils/numbers'
import { type Answers, run } from '../../utils/run'

const answers: Answers = {
  test1: 161,
  input1: 159833790,
  test2: 48,
  input2: 89349241,
}

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string) {
  const lints = byLine(input)
  const res = lints.map((l) => {
    const muls = l.match(/mul\([0-9]{1,3},[0-9]{1,3}\)/g)
    const lr = muls?.map((m) => {
      const [a, b] = m.split('mul(')[1].split(')')[0].split(',')

      return +a * +b
    })!

    return sum(lr)
  })

  return sum(res)
}

function runSecondPart(input: string) {
  const doLines: string[] = []
  const lints = [byLine(input).join('')]
  lints.forEach((ll) => {
    ll.split('do()').map((l) => {
      const dontLines = l.split("don't()")

      if (dontLines[0]) {
        doLines.push(dontLines[0])
      }
    })
  })

  const res = doLines.map((l) => {
    const muls = l.match(/mul\([0-9]{1,3},[0-9]{1,3}\)/g)
    const lr = muls?.map((m) => {
      const [a, b] = m.split('mul(')[1].split(')')[0].split(',')

      return +a * +b
    })!

    return sum(lr)
  })

  return sum(res)
}
