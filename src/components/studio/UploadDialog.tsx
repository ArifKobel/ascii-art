import { useEffect, useRef, useState } from "react";
import { Button } from "#/components/ui/Button";
import type { UploadChoice } from "#/lib/preferences/UploadPreference";

type UploadDialogProps = {
  open: boolean;
  onChoose: (choice: UploadChoice, remember: boolean) => void;
};

export function UploadDialog({ open, onChoose }: UploadDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const choose = (choice: UploadChoice) => {
    onChoose(choice, remember);
    setRemember(false);
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onChoose("keep", false);
      }}
      className="m-auto w-[min(100%-2rem,380px)] scale-100 rounded-2xl bg-[#161618] p-6 text-white opacity-100 shadow-2xl ring-1 ring-white/10 transition duration-200 backdrop:bg-black/60 backdrop:backdrop-blur-sm starting:scale-95 starting:opacity-0"
    >
      <h2 className="text-base font-medium">New image</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-400">
        Keep your current settings for this image, or start fresh with the defaults?
      </p>

      <label className="mt-5 flex w-fit cursor-pointer items-center gap-2.5 text-sm text-neutral-300 select-none">
        <input
          type="checkbox"
          checked={remember}
          onChange={(event) => setRemember(event.target.checked)}
          className="size-4 cursor-pointer accent-white"
        />
        Don't ask again
      </label>

      <div className="mt-6 flex justify-end gap-2">
        <Button onClick={() => choose("fresh")}>Start fresh</Button>
        <Button variant="primary" onClick={() => choose("keep")} autoFocus>
          Keep settings
        </Button>
      </div>
    </dialog>
  );
}
