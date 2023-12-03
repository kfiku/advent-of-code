import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";

async function run() {
  const f = await Deno.open("./input.txt");

  const numbers = [];
  const lines = ["", ""];

  for await (const line of readline(f)) {
    const textLine = new TextDecoder().decode(line);
    if (lines.length < 3) {
      lines.push(`.${textLine}.`)
    } else {
      lines.shift()
      lines.push(`.${textLine}.`)
      const nr = processLine(lines);
      numbers.push(nr);
    }
  }

  lines.shift()
  lines.push('')
  const nr = processLine(lines);
  numbers.push(nr);

  console.log(numbers);
  console.log(4361, sum(numbers));

  f.close();
}

function processLine(lines: string[]) {
  const properNumbers = [0]
  let current = ""
  let border = ""
  for (let i = 0; i < lines[1].length; i++) {
    const d = lines[1][i];
    if (Number.isInteger(+d)) {
      if (border === "" && i > 0) {
        border += lines[1][i - 1]
      }

      current += d
    } else if(current) {
      const start = i - current.length - 1
      const end = i + 1
      border += d
      border += lines[0].substring(start, end)
      border += lines[2].substring(start, end)

      if (border.replace(/[\d. ]/g, '') !== "") {
        // console.log(current, 'OK');
        properNumbers.push(+current)
      } else {
        console.log(current);
      }

      current = border = ""
    }

  }
  // const properNumbers = numbersInLine.map(n => {
  //   const pos = lines[1].indexOf(n);
  //   const start = !pos ? pos : pos - 1;
  //   const end = pos + n.length
  //   const border = ""

  //   if (border.replace(/[\d. ]/g, '') === "") {
  //     console.log(n, "wrong", border, start, end);

  //     return 0
  //   }

  //   console.log(n, 'OK');

  //   return +n
  // });

  // console.log(properNumbers);

  return sum(properNumbers)
}

function sum(numbers: number[]) {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

run();
