import { useState, type DragEvent, type ReactNode, type Ref } from "react";

type PosterPreviewProps = {
  canvasRef: Ref<HTMLCanvasElement>;
  ready: boolean;
  onDropFile: (file: File) => void;
  children?: ReactNode;
};

export function PosterPreview({ canvasRef, ready, onDropFile, children }: PosterPreviewProps) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) onDropFile(file);
  };

  return (
    <section
      className="relative flex min-h-0 flex-col items-center gap-5 overflow-hidden bg-[radial-gradient(circle_at_center,#1a1a1c_0%,#0c0c0d_70%)] p-6 sm:p-10"
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <div className="flex min-h-0 w-full flex-1 items-center justify-center">
        {!ready && (
          <div className="aspect-4/5 h-full max-w-full animate-pulse rounded-sm bg-[#2b45f5]/40" />
        )}

        <canvas
          ref={canvasRef}
          className={`max-h-full max-w-full rounded-sm shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/5 transition-opacity duration-500 starting:opacity-0 ${ready ? "opacity-100" : "hidden"}`}
        />
      </div>

      {children}

      <div
        className={`pointer-events-none absolute inset-4 flex items-center justify-center rounded-2xl border border-dashed border-white/30 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${dragging ? "opacity-100" : "opacity-0"}`}
      >
        <p className="font-mono text-sm text-white">Drop image to convert</p>
      </div>
    </section>
  );
}
