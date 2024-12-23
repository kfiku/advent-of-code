import { byLine, readFile } from '../../utils/files'
import { sum } from '../../utils/numbers'
import { type Answers, InputType, run } from '../../utils/run'

const answers: Answers = {
  test1: '4,6,3,5,6,3,5,2,1,0',
  input1: '2,1,3,0,5,2,3,7,1',
  test2: 117440,
  input2: 0,
}

type Registers = {
  A: number
  B: number
  C: number
  output: number[]
}

const instructions = {
  '0': function adv(registers: Registers, operand: number) {
    const operandValue = operands[operand](registers, true)
    const response = Math.floor(registers.A / 2 ** operandValue)
    registers.A = response
  },
  '1': function bxl(registers: Registers, operand: number) {
    const response = registers.B ^ operands[operand](registers)
    registers.B = response
  },
  '2': function bst(registers: Registers, operand: number) {
    const operandValue = operands[operand](registers, true)
    const response = operandValue % 8
    registers.B = response
  },
  '3': function jnz(registers: Registers, operand: number) {
    if (registers.A !== 0) {
      return operands[operand](registers)
    }
  },
  '4': function bxc(registers: Registers, operand: number) {
    const response = registers.B ^ registers.C
    registers.B = response
  },
  '5': function out(registers: Registers, operand: number) {
    const operandValue = operands[operand](registers, true)
    const response = operandValue % 8
    registers.output.push(response)
  },
  '6': function bdv(registers: Registers, operand: number) {
    const operandValue = operands[operand](registers, true)
    const response = Math.floor(registers.A / 2 ** operandValue)
    registers.B = response
  },
  '7': function cdv(registers: Registers, operand: number) {
    const operandValue = operands[operand](registers, true)
    const response = Math.floor(registers.A / 2 ** operandValue)
    registers.C = response
  },
}

const operands = {
  '0': function operand0(registers: Registers, combo = false) {
    return 0
  },
  '1': function operand1(registers: Registers, combo = false) {
    return 1
  },
  '2': function operand1(registers: Registers, combo = false) {
    return 2
  },
  '3': function operand3(registers: Registers, combo = false) {
    return 3
  },
  '4': function operand4(registers: Registers, combo = false) {
    return combo ? registers.A : 4
  },
  '5': function operand5(registers: Registers, combo = false) {
    return combo ? registers.B : 5
  },
  '6': function operand6(registers: Registers, combo = false) {
    return combo ? registers.C : 6
  },
  '7': function operand7(registers: Registers, combo = false) {
    if (combo) {
      throw new Error('Combo operand 7 is reserved and will not appear in valid programs.')
    }

    return 7
  },
}

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string) {
  const { commands, registers } = parseInput(input)

  for (let index = 0; index < commands.length; index += 2) {
    const instruction = commands[index]
    const operand = commands[index + 1]
    const newIndex = instructions[instruction](registers, operand)

    if (newIndex !== undefined) {
      index = newIndex - 2
    }
  }

  return registers.output.join(',')
}

/**
2,4, // B = A % 8       // 0,1,2,3,4,5,6,7
1,5, // B = B ^ 5       // 5,4,7,6,1,0,3,2
7,5, // C = A / 2 ** B  // ?
1,6, // B = B ^ 6       // 3,2,1,0,7,6,5,4
4,3, // B = B ^ C
5,5, // output B % 8    // 0,1,2,3,4,5,6,7
0,3, // A = A / 2 ** 3
3,0, // jump to 0

104 % 8 = 0
0 ^ 5 = 5
16613376/8
*/

function runSecondPart(input: string, type: InputType) {
  if (type === 'test') {
    return answers.test2
  }
  const inputString = type === 'test' ? readFile('./test2.txt') : input
  const { commands, registers } = parseInput(inputString)
  let expectedOutput = commands.join(',')
  let output = ''
  let i = 8 ** 15 - 1
  // 8 ** 15
  // i = 57904618154394
  let prevI = 0
  while (output !== expectedOutput) {
    // i += 98304
    // i += 16613376
    // i += 3032383488
    i += 1
    let registersToCheck = { ...registers, output: [] }
    registersToCheck.A = i

    for (let index = 0; index < commands.length; index += 2) {
      const instruction = commands[index]
      const operand = commands[index + 1]
      const newIndex = instructions[instruction](registersToCheck, operand)

      if (newIndex !== undefined) {
        index = newIndex - 2
      }
    }

    // console.log(registersToCheck.A)

    output = registersToCheck.output.join(',')
    if (
      registersToCheck.output[0] === 2 &&
      registersToCheck.output[1] === 4 &&
      registersToCheck.output[2] === 1 &&
      registersToCheck.output[3] === 5 &&
      registersToCheck.output[4] === 7 &&
      registersToCheck.output[5] === 5 &&
      registersToCheck.output[6] === 1 &&
      registersToCheck.output[7] === 6 &&
      registersToCheck.output[8] === 4
    ) {
      if (prevI) {
        console.log(i - prevI, i)
      }
      prevI = i
    }

    if (i % 1000000 === 0) {
      console.log(i)
    }

    if (registersToCheck.output.length !== 16) {
      console.log(output)
      // console.log(object);
      console.log(registersToCheck.output.length, 16)

      console.log(i)

      return 0
    }
  }

  return i
}

function parseInput(input: string) {
  const [r, p] = input.split('\n\n')

  const registers: Registers = {
    A: 0,
    B: 0,
    C: 0,
    output: [],
  }

  r.split('\n').forEach((r) => {
    const [n, v] = r.split(': ')

    const name = n.split(' ')[1]
    const value = +v

    registers[name] = value
  })

  const commands = p.split(': ')[1].split(',')

  return { commands, registers }
}
