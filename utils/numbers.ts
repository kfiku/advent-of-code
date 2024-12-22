export function sum(numbers: number[]) {
  return numbers.reduce((acc, curr) => acc + curr, 0)
}

export function sumBigInt(numbers: bigint[]) {
  return numbers.reduce((acc, curr) => acc + curr, 0n)
}
