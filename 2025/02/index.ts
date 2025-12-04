import { byLine } from '../../utils/files'
import { sum } from '../../utils/numbers'
import { type Answers, InputType, run } from '../../utils/run'

const answers: Answers = {
  test1: 1227775554,
  input1: 38158151648,
  test2: 4174379265,
  input2: 45283684555,
}

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string, type: InputType) {
  const lines = byLine(input)
  const ranges = lines.flatMap((l) =>
    l
      .split(',')
      .filter(Boolean)
      .map((r) => r.split('-').map((n) => +n)),
  )

  const invalids: number[] = []
  ranges.map(([s, e]) => {
    const n = []
    for (let i = s; i <= e; i++) {
      n.push(i)

      if (isInvalid(i)) {
        invalids.push(i)
      }
    }

    return n
  })

  return sum(invalids)
}

function isInvalid(number: number) {
  const s = `${number}`
  const r = s.slice(0, s.length / 2)

  if (s === r + r) {
    return true
  }

  return false
}

function runSecondPart(input: string, type: InputType) {
  const lines = byLine(input)
  const ranges = lines.flatMap((l) =>
    l
      .split(',')
      .filter(Boolean)
      .map((r) => r.split('-').map((n) => +n)),
  )

  const invalids: number[] = []
  ranges.map(([s, e]) => {
    const n = []
    for (let i = s; i <= e; i++) {
      n.push(i)

      if (isInvalid2(i)) {
        invalids.push(i)
      }
    }

    return n
  })

  return sum(invalids)
}

function isInvalid2(number: number) {
  const s = `${number}`

  const repeaters: string[] = []

  for (let i = 1; i <= s.length / 2; i++) {
    let repeat = ''

    for (let j = 0; j < i; j++) {
      repeat += s[j]
    }

    repeaters.push(repeat)
  }

  const r = repeaters.some((r) => {
    let val = ''
    for (let i = 0; i < s.length / r.length; i++) {
      val += r
    }

    // if (val === s) {
    //   console.log(s)
    // }

    return val === s
  })

  return r
}
