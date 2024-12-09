import { byLetter, byLine, byLineAndLetter } from '../../utils/files'
import { sum } from '../../utils/numbers'
import { type Answers, run } from '../../utils/run'

const answers: Answers = {
  test1: 1928,
  input1: 6430446922192,
  test2: 2858,
  input2: 6460170593016,
}

run(runFirstPart, runSecondPart, answers)

function runFirstPart(input: string) {
  const letters = byLetter(input)

  let fi = 0
  let files: string[] = []

  for (let index = 0; index < letters.length; index++) {
    const e = +letters[index]
    if (index % 2 === 0) {
      fill(files, e, fi.toString())
      fi++
    } else {
      fill(files, e, '.')
    }
  }

  for (let i = 0; i < files.length; i++) {
    const e = files[i]
    if (e === '.') {
      const lastFileIndex = getLastFileIndex(files)
      const lastFile = files[lastFileIndex]

      if (lastFileIndex > i) {
        files[lastFileIndex] = '.'
        files[i] = lastFile
      }
    }
  }

  let result = 0
  for (let i = 0; i < files.length; i++) {
    const e = files[i]
    if (e !== '.') {
      result += +e * i
    }
  }

  return sum([result])
}

type File = { file: string | number; length: number; index: number }

function runSecondPart(input: string) {
  const letters = byLetter(input)

  let fi = 0
  let files: File[] = []

  for (let index = 0; index < letters.length; index++) {
    const e = +letters[index]
    if (index % 2 === 0) {
      files.push({ file: fi, length: e, index: files.length })
      fi++
    } else {
      files.push({ file: '.', length: e, index: files.length })
    }
  }

  const justFiles = files.filter((f) => f.file !== '.').reverse()
  let justEmpty = files.filter((f) => f.file === '.')

  for (let i = 0; i < justFiles.length - 1; i++) {
    const file = justFiles[i]

    for (let j = 0; j < justEmpty.length; j++) {
      const empty = justEmpty[j]

      if (empty.index < file.index) {
        if (empty.length > file.length) {
          const newEmpty = { ...empty, length: empty.length - file.length }
          const newEmpty2 = { ...empty, length: empty.length - newEmpty.length }
          files[newEmpty.index] = newEmpty
          files[file.index] = newEmpty2
          justEmpty = files.filter((f) => f.file === '.')
          files.splice(newEmpty.index, 0, file)
          updateIndexes(files)
          break
        } else if (empty.length === file.length) {
          files[empty.index] = file
          files[file.index] = empty
          updateIndexes(files)
          justEmpty = files.filter((f) => f.file === '.')
          break
        }
      }
    }
  }

  const finalFiles: string[] = []
  for (let i = 0; i < files.length; i++) {
    const f = files[i]

    fill(finalFiles, f.length, f.file.toString())
  }

  let result = 0
  for (let i = 0; i < finalFiles.length; i++) {
    const e = finalFiles[i]
    if (e !== '.') {
      result += +e * i
    }
  }

  return sum([result])
}

function updateIndexes(files: File[]) {
  for (let i = 0; i < files.length; i++) {
    const element = files[i]
    element.index = i
  }
}

function getLastFileIndex(files) {
  let i = files.length - 1
  let file = files[i]

  while (file === '.') {
    i--
    file = files[i]
  }

  return i
}

function fill(str: string[], count: number, num: string) {
  for (let index = 0; index < count; index++) {
    str.push(num)
  }

  return str
}
