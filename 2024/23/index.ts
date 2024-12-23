import { byLine } from '../../utils/files'
import { sum } from '../../utils/numbers'
import { type Answers, InputType, run } from '../../utils/run'

const answers: Answers = {
  test1: 7,
  input1: 1227,
  test2: 'co,de,ka,ta',
  input2: 0,
}

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string, type: InputType) {
  const connections = byLine(input).map((l) => l.split('-').sort())
  const connectionsMap = new Map<string, string[]>()
  const networks = new Map<string, string>()

  for (let i = 0; i < connections.length; i++) {
    const [a1, a2] = connections[i]
    const c1 = connectionsMap.get(a1) || []
    c1.push(a2)
    connectionsMap.set(a1, c1)

    const c2 = connectionsMap.get(a2) || []
    c2.push(a1)
    connectionsMap.set(a2, c2)
  }

  ;[...connectionsMap.entries()].forEach(([pc, conn]) => {
    for (let i = 0; i < conn.length; i++) {
      for (let j = 0; j < conn.length; j++) {
        if (j === i) continue

        if (connectionsMap.get(conn[i])?.includes(conn[j])) {
          const key = [pc, conn[i], conn[j]].sort().join(',')
          networks.set(key, key)
        }
      }
    }
  })

  const tNetworks = [...networks.values()].filter((net) => net.startsWith('t') || net.includes(',t'))

  return tNetworks.length
}

function runSecondPart(input: string, type: InputType) {}
