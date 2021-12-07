type WordSize = 8 | 16 | 32;

const SIZE_8: WordSize = 8;
const SIZE_16: WordSize = 16;
const SIZE_32: WordSize = 32;

const POW_8 = Math.pow(2, SIZE_8);
const POW_16 = Math.pow(2, SIZE_16);

export interface Position {
  x: number;
  y: number;
}

export default class WorldMap {
  private wordSize: WordSize;

  private data: Uint8Array | Uint16Array | Uint32Array;

  private width: number;
  private height: number;

  constructor() {
    this.data = new Uint8Array(1);
    this.wordSize = SIZE_8;

    this.width = 1;
    this.height = 1;
  }

  public reset(): void {
    this.data = new Uint8Array(1);
    this.wordSize = SIZE_8;

    this.width = 1;
    this.height = 1;
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  public getWordSize(): number {
    return this.wordSize;
  }

  public *getCoordinates(): Generator<Position> {
    for (let y = 0; y < this.height; ++y) {
      for (let x = 0; x < this.width; ++x) {
        yield { x, y };
      }
    }
  }

  private ensureSize(pos: Position, v?: number): void {
    if (
      this.shouldScaleUpDimensions(pos) ||
      (v ? this.shouldScaleUpWordSize(v) : false)
    ) {
      this.scaleUp(
        pos.x + 1,
        pos.y + 1,
        v ? WorldMap.getFittingWordSize(v) : this.wordSize,
      );
    }
  }

  private shouldScaleUpDimensions(pos: Position): boolean {
    return pos.x >= this.width || pos.y >= this.height;
  }

  private static getFittingWordSize(v: number): WordSize {
    return v > POW_8 ? SIZE_16 : v > POW_16 ? SIZE_32 : SIZE_8;
  }

  private shouldScaleUpWordSize(v: number): boolean {
    return WorldMap.getFittingWordSize(v) > this.wordSize;
  }

  private scaleUp(
    newWidth: number,
    newHeight: number,
    newWordSize: WordSize,
  ): void {
    const w = Math.max(this.width, newWidth);
    const h = Math.max(this.height, newHeight);
    const b = Math.max(this.wordSize, newWordSize) as WordSize;

    if (w === this.width && h === this.height && b === this.wordSize) {
      return;
    }

    console.log(
      `scaling up: ${this.width}x${this.height} -> ${w}x${h} @ ${this.wordSize}b -> ${b}b`,
    );

    let newData: Uint8Array | Uint16Array | Uint32Array;

    switch (newWordSize) {
      case 16:
        newData = new Uint16Array(w * h);
        break;
      case 32:
        newData = new Uint32Array(w * h);
        break;
      case 8:
      default:
        newData = new Uint8Array(w * h);
        break;
    }

    if (w !== this.width || h !== this.height) {
      for (const pos of this.getCoordinates()) {
        newData[pos.x + pos.y * w] = this.getXY(pos);
      }
    } else {
      // word size change only
      newData.set(this.data);
    }

    this.data = newData;
    this.width = w;
    this.height = h;
    this.wordSize = b;
  }

  public setXY(pos: Position, v: number) {
    this.data[pos.x + pos.y * this.width] = v;
  }

  public getXY(pos: Position): number {
    return this.data[pos.x + pos.y * this.width] || 0;
  }

  private static *getLineCoordinates(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): Generator<Position> {
    // Bresenham

    const dx = Math.abs(x2 - x1);
    const sx = x1 < x2 ? 1 : -1;
    const dy = -Math.abs(y2 - y1);
    const sy = y1 < y2 ? 1 : -1;

    let err = dx + dy;

    let x = x1;
    let y = y1;

    while (true) {
      yield { x, y };

      if (x === x2 && y === y2) {
        break;
      }

      const e2 = 2 * err;

      if (e2 >= dy) {
        err += dy;
        x += sx;
      }

      if (e2 <= dx) {
        err += dx;
        y += sy;
      }
    }
  }

  public putLine(x1: number, y1: number, x2: number, y2: number): void {
    this.ensureSize({ x: x1, y: y1 });
    this.ensureSize({ x: x2, y: y2 });

    for (const pos of WorldMap.getLineCoordinates(x1, y1, x2, y2)) {
      const newVal = this.getXY(pos) + 1;

      this.ensureSize(pos, newVal);
      this.setXY(pos, newVal);
    }
  }

  public stringify(): string {
    let str = '';

    for (const pos of this.getCoordinates()) {
      const val = this.getXY(pos);

      if (val === 0) {
        str += '.';
      } else {
        str += val;
      }

      if (pos.x === this.getWidth() - 1) {
        str += '\n';
      }
    }

    return str;
  }
}
