import { byLine } from '../../utils/files'
import { Matrix, matrixToPosMap, Pos } from '../../utils/matrix/matrix'
import { sum } from '../../utils/numbers'
import { type Answers, InputType, run } from '../../utils/run'

const answers: Answers = {
  test1: 126384,
  input1: 179444,
  test2: 0,
  input2: 0,
}

const numpad: Matrix = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['', '0', 'A'],
]

const arrowKeys = [
  ['', '^', 'A'],
  ['<', 'v', '>'],
]

class Robot {
  private keyMap: Map<string, Pos>
  private currentKey: string

  constructor(
    private keyboard: Matrix,
    startKey: string,
    private nextRobot?: Robot,
  ) {
    this.keyMap = matrixToPosMap(keyboard)
    this.currentKey = startKey
  }

  getTypeSequence(sequences: string[]) {
    if (this.nextRobot) {
      sequences = this.nextRobot.getTypeSequence(sequences)
    }

    const baseMoves = this.getFirstSequenceLength(sequences[0])
    const baseLen = baseMoves.length

    const sl = sequences.length
    let allMoves: string[][] = []

    for (let s = 0; s < sl; s++) {
      let moves = ['']

      for (let index = 0; index < sequences[s].length; index++) {
        const nextKey = sequences[s][index]
        const [nx, ny] = this.keyMap.get(nextKey)!
        const [x, y] = this.keyMap.get(this.currentKey)!
        const diff: Pos = [nx - x, ny - y]
        const nextSeq = this.diffToSequence(diff)
        const arrMoves = nextSeq.length === 2
        const ml = moves.length

        for (let i = 0; i < ml; i++) {
          if (moves[i].length + nextSeq[0].length > baseLen) {
            continue
          }

          if (arrMoves) {
            moves.push(moves[i] + nextSeq[1])
          }

          moves[i] += nextSeq[0]
        }

        this.currentKey = nextKey
      }

      allMoves.push(moves)
    }

    return allMoves.flatMap((m) => m)
  }

  getFirstSequenceLength(sequence: string) {
    const startKey = this.currentKey
    let moves = ''

    for (let index = 0; index < sequence.length; index++) {
      const nextKey = sequence[index]
      const [nx, ny] = this.keyMap.get(nextKey)!
      const [x, y] = this.keyMap.get(this.currentKey)!
      const diff: Pos = [nx - x, ny - y]
      const nextSeq = this.diffToSequence(diff)

      moves += nextSeq[0]

      this.currentKey = nextKey
    }

    this.currentKey = startKey

    return moves
  }

  diffToSequence([dx, dy]: Pos) {
    let seq1 = ''
    let seq2 = ''

    const [x, y] = this.keyMap.get(this.currentKey)!
    const emptyY = this.keyboard[y + dy]?.[x] === ''
    const emptyX = this.keyboard[y]?.[x + dx] === ''
    const linear = dx === 0 || dy === 0

    for (let i = 0; i < Math.abs(dy); i++) {
      seq1 += dy > 0 ? 'v' : '^'
    }

    for (let i = 0; i < Math.abs(dx); i++) {
      seq1 += dx > 0 ? '>' : '<'
      seq2 += dx > 0 ? '>' : '<'
    }

    for (let i = 0; i < Math.abs(dy); i++) {
      seq2 += dy > 0 ? 'v' : '^'
    }

    if (linear) {
      return [seq1 + 'A']
    }

    if (emptyY) {
      return [seq2 + 'A']
    }

    if (emptyX) {
      return [seq1 + 'A']
    }

    return [seq1 + 'A', seq2 + 'A']
  }
}

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string, type: InputType) {
  const codes = byLine(input)

  const results = codes.map((code) => {
    const robot = new Robot(numpad, 'A')
    const radioactiveRobot = new Robot(arrowKeys, 'A', robot)
    const arcticRobot = new Robot(arrowKeys, 'A', radioactiveRobot)

    const sequences = arcticRobot.getTypeSequence([code])
    const sequencesSorted = sequences.sort((a, b) => a.length - b.length)
    const sequence = sequencesSorted[0]

    const numericPart = parseInt(code, 10)

    return sequence.length * numericPart
  })

  return sum(results)
}

function runSecondPart(input: string, type: InputType) {
  const codes = byLine(input)

  const results = codes.map((code) => {
    const firstRobot = new Robot(numpad, 'A')
    let prevRobot: Robot = firstRobot

    // const totalRobots = 25 - 1
    const totalRobots = 3 - 1
    for (let r = 0; r < totalRobots; r++) {
      const robot = new Robot(arrowKeys, 'A', prevRobot)

      prevRobot = robot
    }

    const sequences = prevRobot!.getTypeSequence([code])
    const sequencesSorted = sequences.sort((a, b) => a.length - b.length)
    const sequence = sequencesSorted[0]

    const numericPart = parseInt(code, 10)

    return sequence.length * numericPart
  })

  return sum(results)
}
