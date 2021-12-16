import Solution from '@/common/Solution';
import { Cached } from '@/common/decorators';
import OctopusMap from '@/11-dumbo-octopus/OctopusMap';

export default class DumboOctopus extends Solution {
  public octopii: OctopusMap;

  @Cached()
  private get worldData(): number[][] {
    return this.input.map((l) => l.split('').map((x) => Number(x)));
  }

  constructor(input: string[]) {
    super(input);

    this.octopii = OctopusMap.fromInput(this.worldData);
  }

  public async run(): Promise<void> {
    while (1) {
      this.octopii.tick();

      if (this.octopii.getStep() === 100) {
        console.log(`flash count @100: ${this.octopii.getFlashCount()}`);
      }

      if (this.octopii.allFlashed) {
        console.log(`all octopi flashed at step: ${this.octopii.getStep()}`);
        break;
      }
    }
  }
}
