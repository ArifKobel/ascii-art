import { DialRoot } from "dialkit";
import { useState } from "react";
import { PanelSkeleton } from "#/components/studio/PanelSkeleton";
import { PosterPreview } from "#/components/studio/PosterPreview";
import { TitleInput } from "#/components/studio/TitleInput";
import { Toolbar } from "#/components/studio/Toolbar";
import { UploadDialog } from "#/components/studio/UploadDialog";
import { useAsciiRenderer } from "#/hooks/useAsciiRenderer";
import { useHydrated } from "#/hooks/useHydrated";
import { useImageSource } from "#/hooks/useImageSource";
import { usePosterSettings } from "#/hooks/usePosterSettings";
import { useUploadPrompt } from "#/hooks/useUploadPrompt";
import { PosterExporter } from "#/lib/ascii/PosterExporter";

export function Studio() {
  const [title, setTitle] = useState("ASCII Studio");
  const { settings, reset } = usePosterSettings(title);
  const uploadPrompt = useUploadPrompt(reset);
  const { source, fileName, load } = useImageSource(uploadPrompt.prompt);
  const { canvasRef, text, ready } = useAsciiRenderer(source, settings);
  const hydrated = useHydrated();

  const exportPng = () => {
    if (canvasRef.current) PosterExporter.downloadPng(canvasRef.current);
  };

  return (
    <div className="grid h-dvh grid-rows-[auto_minmax(0,1fr)] overflow-hidden">
      <Toolbar
        fileName={fileName}
        onUpload={load}
        onCopyText={() => PosterExporter.copyText(text)}
        onExport={exportPng}
      />

      <main className="grid min-h-0 grid-rows-[60%_40%] lg:grid-cols-[minmax(0,1fr)_340px] lg:grid-rows-1">
        <PosterPreview canvasRef={canvasRef} ready={ready} onDropFile={load}>
          <TitleInput value={title} onChange={setTitle} />
        </PosterPreview>
        <aside className="min-h-0 overflow-y-auto border-t border-white/8 bg-panel lg:border-t-0 lg:border-l">
          {hydrated ? (
            <div className="animate-[fade-in_400ms_ease-out] px-3 pb-6">
              <DialRoot mode="inline" theme="dark" productionEnabled />
            </div>
          ) : (
            <PanelSkeleton />
          )}
        </aside>
      </main>

      <UploadDialog open={uploadPrompt.open} onChoose={uploadPrompt.choose} />
    </div>
  );
}
