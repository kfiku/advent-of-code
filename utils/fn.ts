export function cachedFn(fn) {
  const cache = new Map()
  return (...props) => {
    const key = JSON.stringify(props)
    const cachedResults = cache.get(key)
    if (cachedResults) {
      return cachedResults
    }

    const freshResults = fn(...props)
    cache.set(key, freshResults)

    return freshResults
  }
}
