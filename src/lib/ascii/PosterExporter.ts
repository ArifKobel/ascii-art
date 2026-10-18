export class PosterExporter {
  private static readonly FILE_NAME = "ascii-poster";

  static downloadPng(canvas: HTMLCanvasElement) {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${PosterExporter.FILE_NAME}-${canvas.width}x${canvas.height}.png`;
      link.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  static copyText(text: string) {
    return navigator.clipboard.writeText(text);
  }
}
