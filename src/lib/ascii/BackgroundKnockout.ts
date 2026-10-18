import type { Rgba } from "#/lib/ascii/types";

export class BackgroundKnockout {
  private static readonly MAX_DISTANCE = Math.hypot(255, 255, 255);

  private readonly cells: Rgba[];
  private readonly columns: number;

  constructor(cells: Rgba[], columns: number) {
    this.cells = cells;
    this.columns = columns;
  }

  mask(tolerance: number): Uint8Array {
    const mask = new Uint8Array(this.cells.length);
    const edge = this.edgeCells();
    if (edge.length === 0) return mask;

    const backdrop = this.averageOf(edge);
    const limit = tolerance * BackgroundKnockout.MAX_DISTANCE;
    const matches = (i: number) => this.distance(this.cells[i], backdrop) <= limit;

    const stack = edge.filter(matches);
    stack.forEach((i) => (mask[i] = 1));

    while (stack.length > 0) {
      const index = stack.pop()!;
      for (const next of this.neighbours(index)) {
        if (mask[next] || !this.isVisible(next) || !matches(next)) continue;
        mask[next] = 1;
        stack.push(next);
      }
    }

    return mask;
  }

  private edgeCells(): number[] {
    return this.cells.flatMap((_, i) => {
      if (!this.isVisible(i)) return [];
      const neighbours = this.neighbours(i);
      const onBorder = neighbours.length < 4 || neighbours.some((n) => !this.isVisible(n));
      return onBorder ? [i] : [];
    });
  }

  private neighbours(index: number): number[] {
    const col = index % this.columns;
    const candidates = [
      col > 0 ? index - 1 : -1,
      col < this.columns - 1 ? index + 1 : -1,
      index - this.columns,
      index + this.columns,
    ];
    return candidates.filter((n) => n >= 0 && n < this.cells.length);
  }

  private isVisible(index: number) {
    return this.cells[index].a > 0.5;
  }

  private averageOf(indices: number[]): Rgba {
    const sum = indices.reduce(
      (acc, i) => ({
        r: acc.r + this.cells[i].r,
        g: acc.g + this.cells[i].g,
        b: acc.b + this.cells[i].b,
        a: 1,
      }),
      { r: 0, g: 0, b: 0, a: 1 },
    );
    return {
      r: sum.r / indices.length,
      g: sum.g / indices.length,
      b: sum.b / indices.length,
      a: 1,
    };
  }

  private distance(a: Rgba, b: Rgba) {
    return Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);
  }
}
