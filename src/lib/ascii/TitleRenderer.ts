import type { TitleSettings } from "#/lib/ascii/types";

export class TitleRenderer {
  render(context: CanvasRenderingContext2D, title: TitleSettings) {
    if (!title.text.trim()) return;

    const { width, height } = context.canvas;
    const margin = width * 0.05;
    const lineHeight = title.size * 1.02;

    context.save();
    context.font = `400 ${title.size}px "${title.font}", sans-serif`;
    context.letterSpacing = `${-title.size * 0.035}px`;
    context.textAlign = "left";
    context.textBaseline = "alphabetic";
    context.fillStyle = title.color;

    const lines = this.wrap(context, title.text, width - margin * 2);
    const baseline = height - margin - title.size * 0.22;
    lines.forEach((line, i) => {
      context.fillText(line, margin, baseline - (lines.length - 1 - i) * lineHeight);
    });

    context.restore();
  }

  private wrap(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
    return text.split("\n").flatMap((paragraph) => {
      const lines: string[] = [];
      let current = "";

      for (const word of paragraph.trim().split(/\s+/)) {
        const candidate = current ? `${current} ${word}` : word;
        if (current && context.measureText(candidate).width > maxWidth) {
          lines.push(current);
          current = word;
        } else {
          current = candidate;
        }
      }

      return current ? [...lines, current] : lines;
    });
  }
}
