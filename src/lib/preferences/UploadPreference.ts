export type UploadChoice = "keep" | "fresh";

export class UploadPreference {
  private static readonly KEY = "ascii-studio:upload-choice";

  static read(): UploadChoice | null {
    try {
      const value = localStorage.getItem(UploadPreference.KEY);
      return value === "keep" || value === "fresh" ? value : null;
    } catch {
      return null;
    }
  }

  static remember(choice: UploadChoice) {
    try {
      localStorage.setItem(UploadPreference.KEY, choice);
    } catch {
      return;
    }
  }
}
