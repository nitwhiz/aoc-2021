import { input } from '@/common/helpers';
import Solution from '@/common/Solution';
import path from 'path';

export default class SonarSweep extends Solution {
  @input(path.basename(__dirname))
  private input!: string[];

  private parsedInput: number[];

  public constructor() {
    super();

    this.parsedInput = this.input.map((v) => Number(v));
  }

  private inputWindowSum(size: number, offset: number): number {
    return this.parsedInput.slice(offset, offset + size).reduce((a, c) => {
      return a + c;
    }, 0);
  }

  public async run(): Promise<void> {
    const ws = 3;

    let inc = 0;
    let prev = Infinity;

    for (let i = 0; i < this.parsedInput.length - ws + 1; ++i) {
      const curr = this.inputWindowSum(ws, i);

      if (curr > prev) {
        ++inc;
      }

      prev = curr;
    }

    console.log(`increases: ${inc}`);
  }
}
