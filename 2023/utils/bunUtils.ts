export const part = +Bun.argv[2] || 1;
export const file = Bun.argv[3] || "./input.txt";

export async function readFileLineByLine(
  file: string,
  callback: (line: string) => void,
) {
  // const path = "/path/to/package.json";
  const f = Bun.file(file);
  const text = await f.text();
  const lines = text.split("\n");

  for (const line of lines) {
    callback(line);
  }
}
