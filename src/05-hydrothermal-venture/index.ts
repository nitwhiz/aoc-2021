import Solution from '@/common/Solution';
import WorldMap from '@/05-hydrothermal-venture/WorldMap';

export default class HydrothermalVenture extends Solution {
  private readonly map: WorldMap;

  constructor(input: string[]) {
    super(input);

    this.map = new WorldMap();
  }

  public parseInput(diagonals: boolean): void {
    for (const line of this.input) {
      const [begin, end] = line
        .split(' -> ')
        .map((s) => s.split(',').map((p) => Number(p)));

      if (begin && end) {
        if (
          diagonals ||
          (!diagonals && (begin[0] === end[0] || begin[1] === end[1]))
        ) {
          this.map.putLine(begin[0]!, begin[1]!, end[0]!, end[1]!);
        }
      }
    }
  }

  public getMapAsString(): string {
    return this.map.stringify();
  }

  public getOverlaps(): number {
    let overlaps = 0;

    for (const pos of this.map.getPositions()) {
      if (this.map.getXY(pos) > 1) {
        ++overlaps;
      }
    }

    return overlaps;
  }

  public async run(): Promise<void> {
    this.parseInput(false);

    let overlaps = this.getOverlaps();

    console.log(`overlaps (no diagonals): ${overlaps}`);

    this.map.reset();

    this.parseInput(true);

    overlaps = this.getOverlaps();

    console.log(`overlaps (w/ diagonals): ${overlaps}`);
  }
}
