import Solution from '@/common/Solution';
import FishTank from '@/06-lanternfish/FishTank';

export default class Lanternfish extends Solution {
  private tank: FishTank;

  constructor(input: string[]) {
    super(input);

    this.tank = new FishTank(this.input[0]!.split(',').map((x) => Number(x)));
  }

  public async run(): Promise<void> {
    console.log(`fish count: ${this.tank.tickUntil(256).getFishCount()}`);
  }
}
