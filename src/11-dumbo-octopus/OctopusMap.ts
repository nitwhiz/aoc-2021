import WorldMap, { Position } from '@/05-hydrothermal-venture/WorldMap';

const FLAG_FLASHED = 0b0001;

export const hasFlashed = (v: number) => (((v & 0xf0) >> 4) & 0b0001) > 0;
export const setFlashed = (v: number) =>
  (v & 0xf0) | (FLAG_FLASHED << 4) | (v & 0x0f);
export const unsetFlashed = (v: number) =>
  ((((v & 0xf0) >> 4) & ~FLAG_FLASHED) << 4) | (v & 0x0f);

interface Octopus {
  position: Position;
  energyLevel: number;
  hasFlashed: boolean;
}

export default class OctopusMap extends WorldMap {
  private static readonly NEIGHBOUR_VECTS = [
    { x: -1, y: 0 },
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: -1 },
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: 1, y: -1 },
  ];

  public static fromInput(data: number[][]): OctopusMap {
    const h = data.length;
    const w = data[0]!.length;

    const map = new OctopusMap(w, h);

    map.ensureSize({ x: w - 1, y: h - 1 });

    for (let y = 0; y < h; ++y) {
      for (let x = 0; x < w; ++x) {
        map.putOctopus({
          position: { x, y },
          energyLevel: data[y]![x]!,
          hasFlashed: false,
        });
      }
    }

    return map;
  }

  private flashQueue: Position[] = [];

  private flashCount: number = 0;

  private step: number = 0;

  private getOctopusXY(pos: Position): Octopus | null {
    const v = this.getXY(pos);

    if (v === -1) {
      return null;
    }

    return {
      position: { ...pos },
      energyLevel: v & 0x0f,
      hasFlashed: hasFlashed(v),
    };
  }

  private putOctopus(octopus: Octopus): void {
    super.setXY(
      octopus.position,
      octopus.hasFlashed
        ? setFlashed(octopus.energyLevel)
        : octopus.energyLevel,
    );
  }

  private *getChargeableNeighbours(pos: Position): Generator<Octopus> {
    for (const nVect of OctopusMap.NEIGHBOUR_VECTS) {
      const octopus = this.getOctopusXY({
        x: pos.x + nVect.x,
        y: pos.y + nVect.y,
      });

      if (octopus !== null && !octopus.hasFlashed) {
        yield octopus;
      }
    }
  }

  private flash(octopus: Octopus): void {
    octopus.energyLevel = 0;
    octopus.hasFlashed = true;

    ++this.flashCount;

    for (const neighbourOctopus of this.getChargeableNeighbours(
      octopus.position,
    )) {
      this.chargeOctopus(neighbourOctopus);
    }
  }

  private chargeOctopus(octopus: Octopus): void {
    ++octopus.energyLevel;

    if (octopus.energyLevel >= 10) {
      this.flashQueue.push(octopus.position);
    }

    this.putOctopus(octopus);
  }

  private chargeAll(): void {
    for (const pos of this.getPositions()) {
      const octopus = this.getOctopusXY(pos);

      if (octopus === null) {
        continue;
      }

      this.chargeOctopus(octopus);
    }
  }

  private processFlashQueue(): void {
    while (this.flashQueue.length > 0) {
      const pos = this.flashQueue.pop();

      if (!pos) {
        continue;
      }

      const octopus = this.getOctopusXY(pos);

      if (!octopus) {
        continue;
      }

      if (!octopus.hasFlashed) {
        this.flash(octopus);
        this.putOctopus(octopus);
      }
    }
  }

  private unsetFlashedFlag(): void {
    for (const pos of this.getPositions()) {
      this.setXY(pos, unsetFlashed(this.getXY(pos)));
    }
  }

  public tick(times: number = 1): void {
    this.chargeAll();
    this.processFlashQueue();
    this.unsetFlashedFlag();

    ++this.step;

    if (times > 1) {
      this.tick(times - 1);
    }
  }

  public get allFlashed(): boolean {
    for (const pos of this.getPositions()) {
      const octopus = this.getOctopusXY(pos);

      if (octopus === null) {
        continue;
      }

      if (octopus.energyLevel !== 0) {
        return false;
      }
    }

    return true;
  }

  public getFlashCount(): number {
    return this.flashCount;
  }

  public getStep(): number {
    return this.step;
  }

  public stringify(): string {
    let str = '';

    for (const pos of this.getPositions()) {
      const octopus = this.getOctopusXY(pos);

      if (octopus === null) {
        str += '.';
      } else {
        str += octopus.energyLevel;
      }

      if (pos.x === this.getWidth() - 1) {
        str += '\n';
      }
    }

    return str;
  }
}
