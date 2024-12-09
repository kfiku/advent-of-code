import { readFileSync } from 'node:fs'

export function readFile(filePath: string) {
  return readFileSync(filePath).toString()
}

export function byLine(input: string) {
  return input.split('\n')
}

export function byLineAndLetter(input: string) {
  return input.split('\n').map((l) => l.split(''))
}

export function byLetter(input: string) {
  return input.split('')
}
