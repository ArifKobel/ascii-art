import { useCallback, useState } from "react";
import { UploadPreference, type UploadChoice } from "#/lib/preferences/UploadPreference";

export function useUploadPrompt(reset: () => void) {
  const [open, setOpen] = useState(false);

  const prompt = useCallback(() => {
    const saved = UploadPreference.read();
    if (saved === "fresh") reset();
    if (!saved) setOpen(true);
  }, [reset]);

  const choose = useCallback(
    (choice: UploadChoice, remember: boolean) => {
      if (remember) UploadPreference.remember(choice);
      if (choice === "fresh") reset();
      setOpen(false);
    },
    [reset],
  );

  return { open, prompt, choose };
}
