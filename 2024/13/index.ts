import { sum } from '../../utils/numbers'
import { type Answers, run } from '../../utils/run'

const answers: Answers = {
  test1: 480,
  input1: 35255,
  test2: 875318608908,
  input2: 87582154060429,
}

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string) {
  const configs = getConfigs(input)
  const costs = getConst(configs)

  return sum(costs)
}

function runSecondPart(input: string) {
  let addToPrize = 10000000000000
  const configs = getConfigs(input).map(({ prize, ...rest }) => {
    return {
      ...rest,
      prize: [prize[0] + addToPrize, prize[1] + addToPrize],
    }
  })

  const costs = getConst(configs)

  return sum(costs)
}

function getConfigs(input: string) {
  return input.split('\n\n').map((c) => {
    const [a, b, p] = c.split('\n')
    const buttonA = a
      .split(': ')[1]
      .split(', ')
      .map((cords) => +cords.split('+')[1])
    const buttonB = b
      .split(': ')[1]
      .split(', ')
      .map((cords) => +cords.split('+')[1])
    const prize = p
      .split(': ')[1]
      .split(', ')
      .map((cords) => +cords.split('=')[1])

    return { buttonA, buttonB, prize }
  })
}

function getConst(configs: { buttonA: number[]; buttonB: number[]; prize: number[] }[]) {
  return configs
    .map(({ buttonA: [ax, ay], buttonB: [bx, by], prize: [px, py] }) => {
      const y = +((py - (ay * px) / ax) * (ax / (by * ax - ay * bx))).toFixed(3)

      if (y === Math.round(y)) {
        const diff = px - y * bx
        const x = diff / ax

        return x * 3 + y
      }
    })
    .filter(Boolean)
    .map((x) => x || 0)
}
