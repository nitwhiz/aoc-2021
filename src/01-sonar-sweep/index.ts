import Solution from '@/common/Solution';

export default class SonarSweep extends Solution {
  private parsedInput: number[];

  public constructor(input: string[]) {
    super(input);

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
