import type { ImageSource } from "#/lib/ascii/types";

export class ImageLoader {
  static async fromFile(file: File): Promise<ImageSource> {
    const image = await ImageLoader.decode(file);
    return { element: image, width: image.naturalWidth, height: image.naturalHeight };
  }

  private static decode(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        resolve(image);
        URL.revokeObjectURL(url);
      };
      image.onerror = () => {
        reject(new Error(`Could not read ${file.name}`));
        URL.revokeObjectURL(url);
      };
      image.src = url;
    });
  }

  static demo(size = 800): ImageSource {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d")!;
    const center = size / 2;
    const radius = size * 0.36;

    context.fillStyle = "#000";
    context.fillRect(0, 0, size, size);

    const light = context.createRadialGradient(
      center - radius * 0.4,
      center - radius * 0.45,
      radius * 0.05,
      center,
      center,
      radius * 1.05,
    );
    light.addColorStop(0, "#ffffff");
    light.addColorStop(0.35, "#bdbdbd");
    light.addColorStop(0.8, "#3a3a3a");
    light.addColorStop(1, "#111111");

    context.fillStyle = light;
    context.beginPath();
    context.arc(center, center, radius, 0, Math.PI * 2);
    context.fill();

    return { element: canvas, width: size, height: size };
  }
}
