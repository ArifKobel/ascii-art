export class FontLoader {
  static isReady(families: string[]) {
    return families.every((family) => document.fonts.check(FontLoader.descriptor(family)));
  }

  static async ensure(families: string[]) {
    await Promise.all(families.map((family) => document.fonts.load(FontLoader.descriptor(family))));
  }

  private static descriptor(family: string) {
    return `500 32px "${family}"`;
  }
}
