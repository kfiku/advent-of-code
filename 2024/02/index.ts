import { byLine } from '../../utils/files';
import { sum } from '../../utils/numbers';
import { type Answers, run } from '../../utils/run';

const answers: Answers = {
  test1: 2,
  input1: 598,
  test2: 4,
  input2: 0
}

run(runFirstPart, runSecondPart, answers);

function runFirstPart(input: string) {
  const lints = byLine(input)
    .map(l => l.split(' ').map(n => +n))
    .filter(l => {
      const diff = l[0] - l[1]
      
      if (diff > 3) {
        return false
      }

      const plus = diff > 0

      for (let index = 0; index < l.length -1; index++) {
        const a = l[index];
        const b = l[index + 1];

        const diff = plus ? a - b : b - a
        if (diff <= 0 || diff > 3) {
          return false
        }
      }

      return true
    })

  return sum([lints.length])
}

function runSecondPart(input: string) {
  const lints = byLine(input)
    .map(l => l.split(' ').map(n => +n))
    .filter(l => {

      const r = testLine(l)

      return r
    })
  
  return sum([lints.length])
}

function testLine(l: number[], remove = true) {
  const diffs: number[] = []

  for (let index = 0; index < l.length -1; index++) {
    const a = l[index];
    const b = l[index + 1];
    diffs.push(a - b)
  }
  const dp = diffs.filter(v => v > 0)
  const dm = diffs.filter(v => v < 0)
  
  if(dp.length < dm.length) {
    return testLine(l.reverse(), remove)
  }

  let wrongIndex = diffs.findIndex(e => e <= 0 || e > 3)


  if (wrongIndex > -1 && remove) {
    for (let index = 0; index < l.length; index++) {
      
      const rNoFirst = testLine(removeIndexFromArray(l, index), false)
      if (rNoFirst) {
        return true
      }
    }
  }

  if(wrongIndex > -1 && remove) {
    const fails = diffs.filter(e => e >= 0 || e < -3)
    if(fails.length < 2) {
      console.log('UNSAFE', l.join(' '), ';', diffs.join(' '), ';', wrongIndex);
    }
    if(fails.length == 3) {
      console.log('3 UNSAFE', diffs.join(' '), ';', l.join(' '), ';', wrongIndex);
    }
  }

  return wrongIndex == -1

}

function removeIndexFromArray(a: number[], index: number) {
  return a.filter((a, i) => i !== index)
}
