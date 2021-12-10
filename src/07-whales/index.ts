import Solution from '@/common/Solution';

export default class Whales extends Solution {
  private readonly originalCrabPositions: number[];

  constructor(input: string[]) {
    super(input);

    this.originalCrabPositions = this.input[0]!.split(',').map((x) =>
      Number(x),
    );
  }

  private static getMovementCost(p: number, pos: number): number {
    const t = Math.max(pos, p) - Math.min(pos, p);
    let result = 0;

    for (let i = t; i > 0; --i) {
      result += i;
    }

    return result;
  }

  private getFuelCost(pos: number): number {
    return this.originalCrabPositions
      .map((p) => Whales.getMovementCost(p, pos))
      .reduce((a, c) => a + c, 0);
  }

  /**
   * returns the amount of fuel used to position
   */
  public alignCrabs(): number {
    const maxPos = this.originalCrabPositions.reduce(
      (a, c) => (a < c ? c : a),
      -1,
    );
    let lowestCost = Infinity;

    for (let i = 0; i < maxPos; ++i) {
      let c = this.getFuelCost(i);

      if (c < lowestCost) {
        lowestCost = c;
      }
    }

    return lowestCost;
  }

  public async run(): Promise<void> {
    const lowestFuelCost = this.alignCrabs();

    console.log(`lowestFuelCost: ${lowestFuelCost}`);
  }
}
