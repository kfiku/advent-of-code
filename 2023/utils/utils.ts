console.clear()
console.time('process')

export function factorial(num: number) {
  if (num < 0) {
    return Infinity
  }

  let fact = 1
  for (let i = num; i > 1; i--) {
    fact *= i
  }

  return fact
}

export function printResults(expected: number, numbers: number | number[]) {
  const result = Array.isArray(numbers) ? sum(numbers) : numbers

  if (expected === result) {
    console.log('OK', result)
  } else {
    console.log('WRONG', result + ' !== ' + expected)
  }

  console.timeEnd('process')
}

export function sum(numbers: number[]) {
  return numbers.reduce((acc, curr) => acc + curr, 0)
}

export function sub(numbers: number[]) {
  return numbers.reduce((acc, curr) => curr - acc, 0)
}

export function multiply(numbers: number[]) {
  return numbers.reduce((acc, curr) => acc * curr, 1)
}

function gcd(a: number, b: number) {
  while (b != 0) {
    let t = b
    b = a % b
    a = t
  }
  return a
}

function lcm(a: number, b: number) {
  return (a * b) / gcd(a, b)
}

export function lcmOfArray(arr: number[]) {
  let currentLcm = arr[0]
  for (let i = 1; i < arr.length; i++) {
    currentLcm = lcm(currentLcm, arr[i])
  }
  return currentLcm
}

export function zip(arr1: any[], arr2: any[]) {
  const arr = []
  for (let i = 0; i < arr1.length; i++) {
    const e1 = arr1[i]
    const e2 = arr2[i]

    arr.push(e1)

    if (e2) {
      arr.push(e2)
    }
  }

  return arr
}

export function hexToDec(s: string) {
  var i,
    j,
    digits = [0],
    carry
  for (i = 0; i < s.length; i += 1) {
    carry = parseInt(s.charAt(i), 16)
    for (j = 0; j < digits.length; j += 1) {
      digits[j] = digits[j] * 16 + carry
      carry = (digits[j] / 10) | 0
      digits[j] %= 10
    }
    while (carry > 0) {
      digits.push(carry % 10)
      carry = (carry / 10) | 0
    }
  }
  return digits.reverse().join('')
}
