import { useRef, useState } from "react";
import { Button } from "#/components/ui/Button";

type ToolbarProps = {
  fileName: string | null;
  onUpload: (file: File) => void;
  onCopyText: () => Promise<void>;
  onExport: () => void;
};

export function Toolbar({ fileName, onUpload, onCopyText, onExport }: ToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await onCopyText();
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-white/8 px-5">
      <div className="flex min-w-0 items-center gap-3">
        <span className="font-mono text-sm font-bold tracking-tight text-white">
          ASCII<span className="text-neutral-500">/</span>Studio
        </span>
        <span className="hidden truncate font-mono text-xs text-neutral-500 sm:block">
          {fileName ?? "demo.sphere"}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onUpload(file);
            event.target.value = "";
          }}
        />
        <Button onClick={() => inputRef.current?.click()}>Upload</Button>
        <Button onClick={copy} className="hidden sm:inline-flex">
          {copied ? "Copied" : "Copy text"}
        </Button>
        <Button variant="primary" onClick={onExport} className="ml-2">
          Export PNG
        </Button>
      </div>
    </header>
  );
}
