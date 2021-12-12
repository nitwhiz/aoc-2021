import Solution from '@/common/Solution';

export const CHUNK_OPEN_ROUND = '(';
export const CHUNK_OPEN_SQUARE = '[';
export const CHUNK_OPEN_CURLY = '{';
export const CHUNK_OPEN_ANGLE = '<';

export const CHUNK_CLOSE_ROUND = ')';
export const CHUNK_CLOSE_SQUARE = ']';
export const CHUNK_CLOSE_CURLY = '}';
export const CHUNK_CLOSE_ANGLE = '>';

export const CHUNK_OPEN = [
  CHUNK_OPEN_ROUND,
  CHUNK_OPEN_SQUARE,
  CHUNK_OPEN_CURLY,
  CHUNK_OPEN_ANGLE,
];

export const CHUNK_CLOSE = [
  CHUNK_CLOSE_ROUND,
  CHUNK_CLOSE_SQUARE,
  CHUNK_CLOSE_CURLY,
  CHUNK_CLOSE_ANGLE,
];

export const CHUNK_PAIRS = {
  [CHUNK_OPEN_ROUND]: CHUNK_CLOSE_ROUND,
  [CHUNK_OPEN_SQUARE]: CHUNK_CLOSE_SQUARE,
  [CHUNK_OPEN_CURLY]: CHUNK_CLOSE_CURLY,
  [CHUNK_OPEN_ANGLE]: CHUNK_CLOSE_ANGLE,
};

type ChunkOpener = keyof typeof CHUNK_PAIRS;

const getErrorScore = (char: string): number => {
  switch (char) {
    case CHUNK_CLOSE_ROUND:
      return 3;
    case CHUNK_CLOSE_SQUARE:
      return 57;
    case CHUNK_CLOSE_CURLY:
      return 1197;
    case CHUNK_CLOSE_ANGLE:
      return 25137;
    default:
      return 0;
  }
};

const getAutocompleteScore = (char: string): number => {
  switch (char) {
    case CHUNK_OPEN_ROUND:
      return 1;
    case CHUNK_OPEN_SQUARE:
      return 2;
    case CHUNK_OPEN_CURLY:
      return 3;
    case CHUNK_OPEN_ANGLE:
      return 4;
    default:
      return 0;
  }
};

export const LINE_INCOMPLETE = -10;

export const validateLine = (
  line: string,
  stack: ChunkOpener[] = [],
): number => {
  for (let i = 0, l = line.length; i < l; ++i) {
    const c = line.charAt(i);

    if (CHUNK_OPEN.includes(c)) {
      stack.push(c as ChunkOpener);
    } else if (CHUNK_CLOSE.includes(c)) {
      const l = stack.pop()!;

      if (CHUNK_PAIRS[l] !== c) {
        return getErrorScore(c);
      }
    } else {
      console.error(`illegal character encountered: '${c}'`);
    }
  }

  if (stack.length > 0) {
    return LINE_INCOMPLETE;
  }

  return 0;
};

export const LINE_CORRUPTED = -20;

export const autocompleteLine = (line: string): number => {
  let score = 0;
  const stack: ChunkOpener[] = [];

  if (validateLine(line, stack) === LINE_INCOMPLETE) {
    for (const c of [...stack].reverse()) {
      score = score * 5 + getAutocompleteScore(c);
    }
  } else {
    return LINE_CORRUPTED;
  }

  return score;
};

export default class SyntaxScoring extends Solution {
  private printValidationScore(): void {
    const scores = [];

    for (const line of this.input) {
      const score = validateLine(line);

      if (score > 0) {
        scores.push(score);
      }
    }

    const errorScore = scores.reduce((a, c) => a + c, 0);

    console.log(`Error Score: ${errorScore}`);
  }

  private printAutocompleteScore(): void {
    const scores = [];

    for (const line of this.input) {
      const score = autocompleteLine(line);

      if (score !== LINE_CORRUPTED) {
        scores.push(score);
      }
    }

    scores.sort((a, b) => a - b);

    const middleIndex = Math.floor(scores.length / 2);

    console.log(`Autocomplete Score: ${scores[middleIndex]}`);
  }

  public async run(): Promise<void> {
    this.printValidationScore();
    this.printAutocompleteScore();
  }
}
