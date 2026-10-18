export class GrainTexture {
  private canvas: HTMLCanvasElement | null = null;

  apply(context: CanvasRenderingContext2D, amount: number) {
    if (amount <= 0) return;
    const { width, height } = context.canvas;

    context.save();
    context.globalCompositeOperation = "overlay";
    context.globalAlpha = amount;
    context.drawImage(this.texture(width, height), 0, 0);
    context.restore();
  }

  private texture(width: number, height: number) {
    if (this.canvas?.width === width && this.canvas.height === height) return this.canvas;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d")!;
    const noise = context.createImageData(width, height);

    for (let i = 0; i < noise.data.length; i += 4) {
      const value = Math.random() * 255;
      noise.data[i] = value;
      noise.data[i + 1] = value;
      noise.data[i + 2] = value;
      noise.data[i + 3] = 255;
    }

    context.putImageData(noise, 0, 0);
    this.canvas = canvas;
    return canvas;
  }
}
