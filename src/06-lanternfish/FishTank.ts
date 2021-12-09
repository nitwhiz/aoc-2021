export default class FishTank {
  private gen: number = 0;

  private registers: Record<number, number> = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  };

  constructor(timers: number[]) {
    for (const t of timers) {
      ++this.registers[t];
    }
  }

  public tick(): void {
    let reproducingFishes = this.registers[0]!;

    for (let i = 1; i < 9; ++i) {
      this.registers[i - 1] = this.registers[i]!;
    }

    this.registers[6] += reproducingFishes;
    this.registers[8] = reproducingFishes;

    ++this.gen;
  }

  public tickUntil(gen: number): FishTank {
    while (this.gen < gen) {
      this.tick();
    }

    return this;
  }

  public getFishCount(): number {
    return Object.values(this.registers).reduce((a, c) => a + c, 0);
  }
}
