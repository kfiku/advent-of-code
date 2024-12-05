import { byLine } from '../../utils/files'
import { sum } from '../../utils/numbers'
import { type Answers, run } from '../../utils/run'

const answers: Answers = {
  test1: 143,
  input1: 5329,
  test2: 123,
  input2: 5833,
}

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string) {
  const [rulesString, updatesString] = input.split('\n\n')
  const rules = {}
  rulesString.split('\n').map((r) => {
    const [before, after] = r.split('|').map((v) => +v)

    if (!rules[before]) {
      rules[before] = []
    }

    rules[before].push(after)
  })
  const updates = updatesString.split('\n').map((o) => o.split(',').map((v) => +v))

  const correctUpdates = updates.filter((u) => {
    return validateUpdate(u, rules)
  })

  const middles = correctUpdates.map((u) => {
    return u[(u.length - 1) / 2]
  })

  return sum(middles)
}

function runSecondPart(input: string) {
  const [rulesString, updatesString] = input.split('\n\n')
  const rules = {}
  rulesString.split('\n').map((r) => {
    const [before, after] = r.split('|').map((v) => +v)

    if (!rules[before]) {
      rules[before] = []
    }

    rules[before].push(after)
  })
  const updates = updatesString.split('\n').map((o) => o.split(',').map((v) => +v))

  const incorrectUpdates = updates.filter((u) => {
    return validateUpdate(u, rules) === false
  })

  const fixedUpdates = incorrectUpdates.map((u) => fixUpdate(u, rules))

  const middles = fixedUpdates.map((u) => {
    return u[(u.length - 1) / 2]
  })

  return sum(middles)
}

function fixUpdate(update, rules) {
  const before: string[] = []

  for (let index = 0; index < update.length; index++) {
    const u = update[index]
    let swap: number[] = []
    const isAfter = !before
      .map((b) => {
        const rule = rules[b] || []
        const t = rule.includes(u)

        if (t === false) {
          swap = [b, u]
        }

        return t
      })
      .some((v) => v === false)

    before.push(u)

    if (isAfter === false) {
      const [a, b] = swap
      const ia = update.indexOf(a)
      const ib = update.indexOf(b)
      const newUpdate = [...update]
      newUpdate[ia] = b
      newUpdate[ib] = a

      return fixUpdate(newUpdate, rules)
    }
  }

  return update
}

function validateUpdate(update, rules) {
  const before: string[] = []

  for (let index = 0; index < update.length; index++) {
    const u = update[index]

    const isAfter = !before
      .map((b) => {
        const rule = rules[b] || []
        const t = rule.includes(u)

        return t
      })
      .some((v) => v === false)

    before.push(u)

    if (isAfter === false) {
      return isAfter
    }
  }

  return true
}
