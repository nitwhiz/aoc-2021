import Solution from '@/common/Solution';
import { Cached } from '@/common/decorators';
import { RawSignal } from '@/08-seven-segment/Segment';

export default class SevenSegment extends Solution {
  @Cached()
  private get data(): RawSignal[] {
    return this.input.map((line) => {
      const [signalPatterns, outputValue] = line.split(' | ');

      return {
        patterns: signalPatterns!.split(' '),
        values: outputValue!.split(' '),
      };
    });
  }

  private countDigits(segmentCounts: number[]): number {
    return this.data.reduce((a, c) => {
      return (
        a +
        c.values.reduce((oa, oc) => {
          return oa + (segmentCounts.includes(oc.length) ? 1 : 0);
        }, 0)
      );
    }, 0);
  }

  public async run(): Promise<void> {
    const c = this.countDigits([2, 4, 3, 7]);

    console.log(c);
  }
}
