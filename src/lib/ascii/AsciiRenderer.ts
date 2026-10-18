import { BackgroundKnockout } from "#/lib/ascii/BackgroundKnockout";
import { GlyphColor } from "#/lib/ascii/GlyphColor";
import { GrainTexture } from "#/lib/ascii/GrainTexture";
import { GridSampler } from "#/lib/ascii/GridSampler";
import { TitleRenderer } from "#/lib/ascii/TitleRenderer";
import { ToneMapper } from "#/lib/ascii/ToneMapper";
import type { AsciiSettings, ImageSource } from "#/lib/ascii/types";

type Grid = {
  columns: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  top: number;
};

export class AsciiRenderer {
  private readonly canvas: HTMLCanvasElement;
  private readonly sampler = new GridSampler();
  private readonly grain = new GrainTexture();
  private readonly title = new TitleRenderer();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  render(source: ImageSource | null, settings: AsciiSettings): string {
    this.canvas.width = settings.width;
    this.canvas.height = settings.height;
    const context = this.canvas.getContext("2d")!;

    context.fillStyle = settings.background;
    context.fillRect(0, 0, settings.width, settings.height);

    const text = source ? this.drawGlyphs(context, source, settings) : "";
    this.title.render(context, settings.title);
    this.grain.apply(context, settings.grain);

    return text;
  }

  private drawGlyphs(
    context: CanvasRenderingContext2D,
    source: ImageSource,
    settings: AsciiSettings,
  ) {
    const grid = this.createGrid(settings);
    const cells = this.sampler.sample(source, settings.placement, settings, grid);
    const knockout = settings.knockout.enabled
      ? new BackgroundKnockout(cells, grid.columns).mask(settings.knockout.tolerance)
      : null;
    const tone = new ToneMapper(settings.tone);
    const chars = Array.from(settings.glyphs.charset || " ");
    const lines: string[] = [];

    context.font = `500 ${grid.cellHeight * settings.glyphs.glyphSize}px "${settings.glyphs.font}", monospace`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = settings.color.ink;

    for (let row = 0; row < grid.rows; row++) {
      let line = "";

      for (let col = 0; col < grid.columns; col++) {
        const index = row * grid.columns + col;
        const cell = cells[index];
        const level = cell.a < 0.5 || knockout?.[index] ? null : tone.map(cell);
        const char = level === null ? " " : this.pickChar(chars, level, col, row, settings);
        line += char;

        if (char === " " || level === null) continue;
        context.globalAlpha = 1 - settings.tone.fade * (1 - level);
        if (settings.color.imageColors) {
          context.fillStyle = GlyphColor.fromCell(cell, settings.color.saturation);
        }
        context.fillText(
          char,
          (col + 0.5) * grid.cellWidth,
          grid.top + (row + 0.5) * grid.cellHeight,
        );
      }

      lines.push(line.trimEnd());
    }

    context.globalAlpha = 1;
    return this.trimEmptyLines(lines).join("\n");
  }

  private createGrid(settings: AsciiSettings): Grid {
    const columns = Math.max(4, Math.round(settings.glyphs.columns));
    const cellWidth = settings.width / columns;
    const cellHeight = cellWidth * settings.glyphs.rowHeight;
    const rows = Math.max(1, Math.floor(settings.height / cellHeight));
    const top = (settings.height - rows * cellHeight) / 2;
    return { columns, rows, cellWidth, cellHeight, top };
  }

  private pickChar(
    chars: string[],
    level: number,
    col: number,
    row: number,
    settings: AsciiSettings,
  ) {
    const { jitter, seed } = settings.glyphs;
    const noise = (this.hash(col, row, seed) - 0.5) * jitter * chars.length;
    const index = Math.round(level * (chars.length - 1) + noise);
    return chars[Math.min(chars.length - 1, Math.max(0, index))];
  }

  private hash(x: number, y: number, seed: number) {
    let h = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967295;
  }

  private trimEmptyLines(lines: string[]) {
    const first = lines.findIndex(Boolean);
    if (first === -1) return [];
    const last = lines.findLastIndex(Boolean);
    return lines.slice(first, last + 1);
  }
}
