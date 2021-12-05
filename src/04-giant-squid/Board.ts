export default class Board {
  private readonly boardSize: number;

  private readonly data: Uint16Array;

  constructor(data: string[]) {
    this.boardSize = data.length;

    this.data = new Uint16Array(this.boardSize * this.boardSize);

    this.populateBoard(data);
  }

  private populateBoard(data: string[]): void {
    for (let y = 0; y < data.length; ++y) {
      const numbers = data[y]!.trim()
        .split(/\s+/)
        .map((x) => Number(x));

      for (let x = 0; x < numbers.length; ++x) {
        this.setXY(x, y, numbers[x]!);
      }
    }
  }

  public setXY(x: number, y: number, v: number): void {
    this.data[y * this.boardSize + x] = v;
  }

  public getXY(x: number, y: number): number {
    return this.data[y * this.boardSize + x]! & 0xff;
  }

  public getI(i: number): number {
    return this.data[i]! & 0xff;
  }

  public markXY(x: number, y: number): void {
    const i = x + y * this.boardSize;

    this.data[i] = 0 | (1 << 8) | this.data[i]!;
  }

  private markI(i: number): void {
    this.data[i] = 0 | (1 << 8) | this.data[i]!;
  }

  private unmarkI(i: number): void {
    this.data[i] = this.getI(i);
  }

  private isMarkedI(i: number): boolean {
    return (this.data[i]! & 0xff00) > 0;
  }

  public isMarkedXY(x: number, y: number): boolean {
    return (this.data[y * this.boardSize + x]! & 0xff00) > 0;
  }

  private *markedIndexGenerator(): Generator<number> {
    for (let i = 0; i < this.data.length; ++i) {
      if (this.isMarkedI(i)) {
        yield i;
      }
    }
  }

  public reset(): void {
    for (const i of this.markedIndexGenerator()) {
      this.unmarkI(i);
    }
  }

  private *indexGenerator(): Generator<number> {
    for (let i = 0; i < this.data.length; ++i) {
      yield i;
    }
  }

  private *valueGenerator(keepMarked: boolean): Generator<number> {
    const gen = this.indexGenerator();

    for (const i of gen) {
      if (!keepMarked && this.isMarkedI(i)) {
        continue;
      }

      yield this.getI(i);
    }
  }

  public markNumber(n: number): void {
    const gen = this.indexGenerator();

    for (const i of gen) {
      if (this.getI(i) === n) {
        this.markI(i);
      }
    }
  }

  public getUnmarkedSum(): number {
    return [...this.valueGenerator(false)].reduce((a, c) => a + c, 0);
  }

  private check(dir: 'col' | 'row'): boolean {
    let streak = true;

    for (let i = 0; i < this.boardSize; ++i) {
      streak = true;

      for (let j = 0; j < this.boardSize; ++j) {
        if (dir === 'col') {
          streak = this.isMarkedXY(i, j);
        } else {
          streak = this.isMarkedXY(j, i);
        }

        if (!streak) {
          break;
        }
      }

      if (streak) {
        break;
      }
    }

    return streak;
  }

  public isWon(): boolean {
    return this.check('row') || this.check('col');
  }

  public printBoard(): void {
    const stdout = process.stdout;

    stdout.write('--- BEGIN BOARD ---\n');

    for (let y = 0; y < this.boardSize; ++y) {
      for (let x = 0; x < this.boardSize; ++x) {
        const marked = this.isMarkedXY(x, y);

        if (marked) {
          stdout.write('[');
        } else {
          stdout.write(' ');
        }

        stdout.write(this.getXY(x, y).toString(10).padStart(2, ' '));

        if (marked) {
          stdout.write(']');
        } else {
          stdout.write(' ');
        }

        if (x < this.boardSize - 1) {
          stdout.write(' ');
        }
      }

      stdout.write('\n');
    }

    stdout.write('--- END BOARD ---\n');
  }
}
