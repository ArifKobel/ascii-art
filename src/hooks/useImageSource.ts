import { useCallback, useEffect, useRef, useState } from "react";
import { ImageLoader } from "#/lib/ascii/ImageLoader";
import type { ImageSource } from "#/lib/ascii/types";

export function useImageSource(onLoad: () => void) {
  const [source, setSource] = useState<ImageSource | null>(() =>
    typeof document === "undefined" ? null : ImageLoader.demo(),
  );
  const [fileName, setFileName] = useState<string | null>(null);
  const onLoadRef = useRef(onLoad);
  onLoadRef.current = onLoad;

  const load = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setSource(await ImageLoader.fromFile(file));
    setFileName(file.name);
    onLoadRef.current();
  }, []);

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const file = Array.from(event.clipboardData?.files ?? []).find((f) =>
        f.type.startsWith("image/"),
      );
      if (file) void load(file);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [load]);

  return { source, fileName, load };
}
