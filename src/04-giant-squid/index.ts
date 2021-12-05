import Solution from '@/common/Solution';
import Board from '@/04-giant-squid/Board';

export default class GiantSquid extends Solution {
  private readonly prng: number[];

  private readonly boards: Board[];

  constructor(input: string[]) {
    super(input);

    this.prng = this.input[0]!.split(',').map((x) => Number(x));
    this.boards = this.parseBoards();
  }

  private parseBoards(): Board[] {
    const result: Board[] = [];

    let buffer: string[] = [];

    for (let i = 2; i < this.input.length + 1; ++i) {
      if (this.input[i]) {
        buffer.push(this.input[i]!);
      } else {
        if (buffer.length > 0) {
          result.push(new Board(buffer));
        }

        buffer = [];
      }
    }

    return result;
  }

  private *nextNumber(): Generator<number> {
    for (const x of this.prng) {
      yield x;
    }
  }

  private resetBoards(): void {
    for (const b of this.boards) {
      b.reset();
    }
  }

  private *unwonBoards(): Generator<Board> {
    for (const b of this.boards) {
      if (!b.isWon()) {
        yield b;
      }
    }
  }

  public getLastWinningScore(): number | null {
    this.resetBoards();

    let lastSum = null;

    for (const n of this.nextNumber()) {
      for (const b of this.unwonBoards()) {
        b.markNumber(n);

        if (b.isWon()) {
          lastSum = b.getUnmarkedSum() * n;
        }
      }
    }

    return lastSum;
  }

  public getFirstWinningScore(): number | null {
    this.resetBoards();

    for (const n of this.nextNumber()) {
      for (const b of this.boards) {
        b.markNumber(n);

        if (b.isWon()) {
          return b.getUnmarkedSum() * n;
        }
      }
    }

    return null;
  }

  public async run(): Promise<void> {
    const firstWinningScore = this.getFirstWinningScore();
    const lastWinningScore = this.getLastWinningScore();

    console.log(`first winning score: ${firstWinningScore}`);
    console.log(`last winning score: ${lastWinningScore}`);
  }
}
