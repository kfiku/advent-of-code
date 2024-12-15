export function clone<T>(obj: T) {
  if (Array.isArray(obj) && Array.isArray(obj[0])) {
    return obj.map((l) => [...l])
  }

  return JSON.parse(JSON.stringify(obj)) as T
}
