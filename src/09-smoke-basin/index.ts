import Solution from '@/common/Solution';
import { Cached } from '@/common/decorators';
import chalk from 'chalk';

interface Location {
  x: number;
  y: number;
}

export default class SmokeBasin extends Solution {
  private static readonly NEIGHBOUR_VECTS = [
    { x: -1, y: 0 },
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ];

  @Cached()
  private get mapWidth(): number {
    return this.input[0]!.length;
  }

  @Cached()
  private get mapHeight(): number {
    return this.input.length;
  }

  @Cached()
  private get heightmap(): Uint8Array {
    return this.input.reduce((a, c, i) => {
      a.set(
        c.split('').map((x) => Number(x)),
        i * this.mapWidth,
      );

      return a;
    }, new Uint8Array(this.mapWidth * this.mapHeight));
  }

  public getXY(x: number, y: number): number {
    if (x < 0 || y < 0 || x > this.mapWidth - 1 || y > this.mapHeight - 1) {
      return -1;
    }

    return this.heightmap[y * this.mapWidth + x]!;
  }

  private isLowXY(x: number, y: number): boolean {
    const value = this.getXY(x, y);

    for (const vect of SmokeBasin.NEIGHBOUR_VECTS) {
      const n = this.getXY(x + vect.x, y + vect.y);

      if (n !== -1 && value >= n) {
        return false;
      }
    }

    return true;
  }

  public *getLowPoints(): Generator<Location> {
    for (let y = 0; y < this.mapHeight; ++y) {
      for (let x = 0; x < this.mapWidth; ++x) {
        if (this.isLowXY(x, y)) {
          yield { x, y };
        }
      }
    }
  }

  private *getBasinLocations(low: Location): Generator<Location> {
    const stack: Location[] = [low];
    const dirty: Location[] = [];

    while (stack.length > 0) {
      const loc = stack.pop()!;

      for (const vect of SmokeBasin.NEIGHBOUR_VECTS) {
        const nX = loc.x + vect.x;
        const nY = loc.y + vect.y;
        const nV = this.getXY(nX, nY);

        if (
          nV !== -1 &&
          nV !== 9 &&
          !dirty.some((l) => l.x === nX && l.y === nY)
        ) {
          const nLoc = {
            x: nX,
            y: nY,
          };

          stack.push(nLoc);
          dirty.push(nLoc);

          yield nLoc;
        }
      }
    }
  }

  public *getBasinSizes(): Generator<number> {
    for (const low of this.getLowPoints()) {
      let size = 0;

      for (const _ of this.getBasinLocations(low)) {
        ++size;
      }

      yield size;
    }
  }

  public getRiskLevelSum(): number {
    let sum = 0;

    for (const loc of this.getLowPoints()) {
      sum += 1 + this.getXY(loc.x, loc.y);
    }

    return sum;
  }

  private renderMap(): void {
    const stdout = process.stdout;
    let c = chalk.white;

    for (let y = 0; y < this.mapHeight; ++y) {
      for (let x = 0; x < this.mapWidth; ++x) {
        const val = this.getXY(x, y);

        if (this.isLowXY(x, y)) {
          c = chalk.red;
        } else if (val === 9) {
          c = chalk.blue;
        } else {
          c = chalk.grey;
        }

        stdout.write(c(val));
      }

      stdout.write('\n');
    }

    stdout.write('\n');
  }

  public async run(): Promise<void> {
    this.renderMap();

    const riskLevel = this.getRiskLevelSum();

    console.log(`Risk Level: ${riskLevel}`);

    let maxSizes = [0, 0, 0];

    for (const size of this.getBasinSizes()) {
      if (maxSizes.some((s) => size > s)) {
        maxSizes.pop();
        maxSizes.push(size);
        maxSizes.sort((a, b) => b - a);
      }
    }

    const basinSizeResult = maxSizes.reduce((a, c) => a * c, 1);

    console.log(`3 Biggest Basin Sizes Result: ${basinSizeResult}`);
  }
}
