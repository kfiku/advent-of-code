import { lineByLine, multiply, printResults, sum } from "../utils/utils.ts";

const part = +Deno.args[0] || 1;

async function run() {
  if (part === 1) {
    await lineByLine("./input.txt", part1);
    const result = process();
    printResults(5905, result);
  } else {
    await lineByLine("./input.txt", part1);
    const result = process();

    printResults(5905, result);
  }
}

const results: ReturnType<typeof getScore>[] = [];

function part1(line: string) {
  const score = getScore(line);

  results.push(score);
}

function process() {
  //249088209
  const scores = results
    .sort((a, b) => {
      return a.score > b.score ? 1 : -1;
    })
    .map((score, i) => {
      console.log(i+1,  score.hand, score.score);
      return score.bid * (i + 1);
    });
;

  return scores;
}

function getScore(line: string) {
  const [hand, bid] = line.split(" ");
  const typeScore = getTypeScore(hand);
  const highCardScore = getHighCardScore(hand);

  const score = +(typeScore + highCardScore);

  return {
    score,
    hand,
    bid: +bid,
  };
}

const scores = {
  A: "13",
  K: "12",
  Q: "11",
  J: part === 1 ? "10" : "00",
  T: "09",
  9: "08",
  8: "07",
  7: "06",
  6: "05",
  5: "04",
  4: "03",
  3: "02",
  2: "01",
};

function getHighCardScore(hand: string) {
  let score = "";

  for (let i = 0; i < hand.length; i++) {
    const card = hand[i] as keyof typeof scores;

    score += scores[card];
  }

  return score;
}

function getTypeScore(hand: string) {
  if (hand === 'JJJJJ') {
    // Five of a kind
    return 7
  }

  const cards: Record<string, number> = {};

  for (let i = 0; i < hand.length; i++) {
    const card = hand[i];

    if (!cards[card]) {
      cards[card] = 0;
    }

    cards[card]++;
  }

  const counts = Object.entries(cards).reduce((acc, [sym, count]) => {
    acc[count] = (acc[count] || "") + sym;

    return acc;
  }, [] as string[]);

  const jCount = part === 2 ? cards.J : 0;

  if (jCount) {
    const updatedHand = updateBestScoreWithJ(hand, counts)

    return getTypeScore(updatedHand)
  }

  if (counts[5]) {
    // Five of a kind
    return 7;
  }

  if (counts[4]) {
    // Four of a kind
    return 6;
  }

  if (counts[3] && counts[2]) {
    // Full house
    return 5;
  }

  if (counts[3]) {
    // Three of a kind
    return 4;
  }

  if (counts[2] && counts[2].length > 1) {
    // Two pair
    return 3;
  }

  if (counts[2]) {
    // One pair
    return 2;
  }

  // High card
  return 1;
}

run();

function updateBestScoreWithJ(hand: string, counts: string[]) {
  const bestSymbol = counts[counts.length - 1];

  if (bestSymbol === "J" || bestSymbol === undefined) {
    if (counts.length <= 1) {
      console.log(hand);

      return hand
    }

    return updateBestScoreWithJ(hand, counts.slice(0, counts.length - 1))
  }

  const symbolToReplace = bestSymbol.replace(/J/, '')[0]
  const newHand = hand.replace(/J/g, symbolToReplace);

  // console.log(hand, bestSymbol, symbolToReplace, newHand);
  return newHand
}
