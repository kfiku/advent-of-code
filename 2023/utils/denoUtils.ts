import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";

export const part = +Deno.args[0] || 1;
export const file = Deno.args[1] || "./input.txt";

export async function readFileLineByLine(
  file: string,
  callback: (line: string) => void
) {
  const f = await Deno.open(file);

  for await (const line of readline(f)) {
    const textLine = new TextDecoder().decode(line);

    callback(textLine);
  }

  f.close();
}
