import { useEffect, useRef, useState } from "react";
import { AsciiRenderer } from "#/lib/ascii/AsciiRenderer";
import { FontLoader } from "#/lib/ascii/FontLoader";
import type { AsciiSettings, ImageSource } from "#/lib/ascii/types";

export function useAsciiRenderer(source: ImageSource | null, settings: AsciiSettings) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<AsciiRenderer | null>(null);
  const [text, setText] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    rendererRef.current ??= new AsciiRenderer(canvas);
    const renderer = rendererRef.current;
    const fonts = [settings.glyphs.font, settings.title.font];

    const draw = () => {
      setText(renderer.render(source, settings));
      setReady(true);
    };

    draw();
    if (FontLoader.isReady(fonts)) return;

    let cancelled = false;
    void FontLoader.ensure(fonts).then(() => {
      if (!cancelled) draw();
    });

    return () => {
      cancelled = true;
    };
  }, [source, settings]);

  return { canvasRef, text, ready };
}
