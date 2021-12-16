export type RawSignal = {
  patterns: string[];
  values: string[];
};

export const getSignal = (line: string): RawSignal => {
  const [signalPatterns, outputValue] = line.split(' | ');

  return {
    patterns: signalPatterns!.split(' '),
    values: outputValue!.split(' '),
  };
};

// top: 7, 8
// upper right: 1, 7, 4, 8
// lower right: 1, 7, 4, 8
// bottom: 8
// lower left: 8
// upper left: 4, 8
// center: 4, 8

/**
 *  aaaaa
 * f     b
 * f     b
 *  ggggg
 * e     c
 * e     c
 *  ddddd
 */

type SegmentPosition = 'T' | 'UR' | 'LR' | 'B' | 'LL' | 'UL' | 'C';

export default class SegmentController {
  private patterns: Record<string, number> = {};

  // @ts-ignore
  private wires: Record<SegmentPosition, string[]> = {
    T: [],
    UR: [],
    LR: [],
    B: [],
    LL: [],
    UL: [],
    C: [],
  };

  // @ts-ignore
  private get isMappingFinished(): boolean {
    return Object.values(this.wires).every((w) => w.length === 1);
  }

  public registerWire(segment: SegmentPosition, wire: string): void {
    if (!this.wires[segment].includes(wire)) {
      this.wires[segment].push(wire);
    }
  }

  public unregisterWire(segment: SegmentPosition, wire: string): void {
    const i = this.wires[segment].indexOf(wire);

    if (i === -1) {
      return;
    }

    this.wires[segment].splice(i, 1);
  }

  public static getSegments(digit: number): SegmentPosition[] {
    switch (digit) {
      case 0:
        return ['T', 'UR', 'LR', 'B', 'LL', 'UL'];
      case 1:
        return ['UR', 'LR'];
      case 2:
        return ['T', 'UR', 'C', 'LL', 'B'];
      case 3:
        return ['T', 'UR', 'C', 'LR', 'B'];
      case 4:
        return ['UR', 'C', 'LR', 'UL'];
      case 5:
        return ['T', 'LR', 'C', 'UL', 'B'];
      case 6:
        return ['T', 'C', 'LR', 'B', 'LL', 'UL'];
      case 7:
        return ['T', 'UR', 'LR'];
      case 8:
        return ['T', 'UR', 'C', 'LR', 'B', 'LL', 'UL'];
      case 9:
        return ['T', 'UR', 'C', 'LR', 'B', 'UL'];
      default:
        return [];
    }
  }

  public getWires(digit: number): Record<SegmentPosition, string[]> {
    return SegmentController.getSegments(digit).reduce((a, c) => {
      a[c] = [...this.wires[c]];

      return a;
    }, {} as Record<SegmentPosition, string[]>);
  }

  public fitDigits(unmapped: string[]): void {
    let wires = this.getWires(0);

    // if (wires['C'].length > 1) {
    //   // todo
    // }

    console.log(wires);
  }

  public registerDigit(pattern: string, digit: number): void {
    this.patterns[pattern] = digit;
  }

  private getDigitsByWire(w: string): { [n: number]: boolean; count: number } {
    return Object.entries(this.patterns)
      .filter(([p]) => p.includes(w))
      .map(([, d]) => d)
      .reduce(
        (a, c) => {
          a[c] = true;
          ++a.count;

          return a;
        },
        {
          1: false,
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
          7: false,
          8: false,
          count: 0,
        } as { [n: number]: boolean; count: number },
      );
  }

  public processSignal(signal: RawSignal): void {
    const unmapped = [];

    for (const p of signal.patterns) {
      switch (p.length) {
        case 2:
          this.registerDigit(p, 1);
          break;
        case 3:
          this.registerDigit(p, 7);
          break;
        case 4:
          this.registerDigit(p, 4);
          break;
        case 7:
          this.registerDigit(p, 8);
          break;
        default:
          unmapped.push(p);
          break;
      }
    }

    console.log(this.patterns);

    for (const p of Object.keys(this.patterns)) {
      p.split('').forEach((w) => {
        const d = this.getDigitsByWire(w);

        if (d.count === 1 && d[8]) {
          this.registerWire('B', w);
          this.registerWire('LL', w);
        } else if (d.count === 4) {
          this.registerWire('UR', w);
          this.registerWire('LR', w);
        } else if (d.count === 2 && d[4] && d[8]) {
          this.registerWire('UL', w);
          this.registerWire('C', w);
        } else if (d.count === 2 && d[7] && d[8]) {
          this.registerWire('T', w);
        }
      });
    }

    console.log(this.wires);

    this.fitDigits(unmapped);
  }
}
