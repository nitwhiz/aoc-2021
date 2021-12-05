import Solution from '@/common/Solution';

interface SplitBuffer {
  most: string[];
  least: string[];
  stepMost: boolean;
  stepLeast: boolean;
}

interface PowerConsumption {
  e: number;
  g: number;
  pc: number;
}

interface LifeSupportRating {
  o2: number;
  co2: number;
  ls: number;
}

export default class BinaryDiagnostic extends Solution {
  private readonly wordSize: number = 0;

  private readonly lineCount: number = 0;

  constructor(input: string[]) {
    super(input);

    this.wordSize = input[0]!.length;
    this.lineCount = input.length;
  }

  public getPowerConsumption(): PowerConsumption {
    const oneCounter = new Array(this.wordSize).fill(0);

    for (let y = 0; y < this.lineCount; ++y) {
      for (let x = 0; x < this.wordSize; ++x) {
        if (this.input[y]!.charAt(x) === '1') {
          ++oneCounter[x];
        }
      }
    }

    const gammaBits = new Array(this.wordSize).fill(0);
    const epsilonBits = new Array(this.wordSize).fill(1);

    for (let b = 0; b < this.wordSize; ++b) {
      if (oneCounter[b] > this.lineCount / 2) {
        gammaBits[b] = 1;
        epsilonBits[b] = 0;
      }
    }

    const g = parseInt(gammaBits.join(''), 2);
    const e = parseInt(epsilonBits.join(''), 2);

    return {
      g,
      e,
      pc: g * e,
    };
  }

  private static splitBuffer(
    lookupOffset: number,
    preference: 1 | 0,
    buffer: string[],
  ): SplitBuffer {
    const result: SplitBuffer = {
      most: [],
      least: [],
      stepMost: true,
      stepLeast: true,
    };

    const bufOne: string[] = [];
    const bufZero: string[] = [];

    let oneCounter = 0;

    for (let y = 0; y < buffer.length; ++y) {
      if (buffer[y]!.charAt(lookupOffset) === '1') {
        ++oneCounter;

        bufOne.push(buffer[y]!);
      } else {
        bufZero.push(buffer[y]!);
      }
    }

    const halfSize = buffer.length / 2;

    if (oneCounter === halfSize) {
      if (preference === 1) {
        result.most = bufOne;
        result.least = bufOne;
      } else {
        result.most = bufZero;
        result.least = bufZero;
      }
    } else {
      if (oneCounter > halfSize) {
        result.most = bufOne;
        result.least = bufZero;
      } else {
        result.most = bufZero;
        result.least = bufOne;
      }
    }

    return result;
  }

  private iterateSplitBuffers(
    begin: number,
    end: number,
    buffers: SplitBuffer,
  ): SplitBuffer {
    if (begin === end) {
      return buffers;
    }

    const result: SplitBuffer = {
      ...buffers,
    };

    if (result.most.length === 1) {
      result.stepMost = false;
    }

    if (result.least.length === 1) {
      result.stepLeast = false;
    }

    if (result.stepMost) {
      result.most = BinaryDiagnostic.splitBuffer(begin, 1, buffers.most).most;
    }

    if (result.stepLeast) {
      result.least = BinaryDiagnostic.splitBuffer(
        begin,
        0,
        buffers.least,
      ).least;
    }

    return this.iterateSplitBuffers(begin + 1, end, result);
  }

  public getLifeSupportRating(): LifeSupportRating {
    const bufs = this.iterateSplitBuffers(0, this.wordSize, {
      most: this.input,
      least: this.input,
      stepMost: true,
      stepLeast: true,
    });

    const o2 = parseInt(bufs.most.join(''), 2);
    const co2 = parseInt(bufs.least.join(''), 2);

    return {
      o2,
      co2,
      ls: o2 * co2,
    };
  }

  public async run(): Promise<void> {
    const power = this.getPowerConsumption();
    const lifeSupport = this.getLifeSupportRating();

    console.log(`power: ${Solution.inspect(power)}`);
    console.log(`lifeSupport: ${Solution.inspect(lifeSupport)}`);
  }
}
