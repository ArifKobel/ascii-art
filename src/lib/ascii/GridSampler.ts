import type { ImageSource, PlacementSettings, Rgba } from "#/lib/ascii/types";

export class GridSampler {
  private static readonly SUPERSAMPLE = 3;

  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d", { willReadFrequently: true })!;
  }

  sample(
    source: ImageSource,
    placement: PlacementSettings,
    poster: { width: number; height: number },
    grid: { columns: number; rows: number },
  ): Rgba[] {
    const ss = GridSampler.SUPERSAMPLE;
    const width = grid.columns * ss;
    const height = grid.rows * ss;
    this.canvas.width = width;
    this.canvas.height = height;
    this.context.clearRect(0, 0, width, height);
    this.context.imageSmoothingQuality = "high";

    const fit =
      Math.min(poster.width / source.width, poster.height / source.height) * placement.scale;
    const drawWidth = source.width * fit;
    const drawHeight = source.height * fit;
    const left = (poster.width - drawWidth) / 2 + (placement.x * poster.width) / 2;
    const top = (poster.height - drawHeight) / 2 - (placement.y * poster.height) / 2;
    const kx = width / poster.width;
    const ky = height / poster.height;
    this.context.drawImage(source.element, left * kx, top * ky, drawWidth * kx, drawHeight * ky);

    const pixels = this.context.getImageData(0, 0, width, height).data;
    const cells: Rgba[] = [];

    for (let row = 0; row < grid.rows; row++) {
      for (let col = 0; col < grid.columns; col++) {
        cells.push(this.averageCell(pixels, width, col, row));
      }
    }

    return cells;
  }

  private averageCell(pixels: Uint8ClampedArray, stride: number, col: number, row: number): Rgba {
    const ss = GridSampler.SUPERSAMPLE;
    let r = 0;
    let g = 0;
    let b = 0;
    let a = 0;

    for (let y = 0; y < ss; y++) {
      for (let x = 0; x < ss; x++) {
        const i = ((row * ss + y) * stride + col * ss + x) * 4;
        const alpha = pixels[i + 3] / 255;
        r += pixels[i] * alpha;
        g += pixels[i + 1] * alpha;
        b += pixels[i + 2] * alpha;
        a += alpha;
      }
    }

    if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
    return { r: r / a, g: g / a, b: b / a, a: a / (ss * ss) };
  }
}
