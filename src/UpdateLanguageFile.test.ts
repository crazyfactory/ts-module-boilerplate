import {UpdateLanguageFile} from "./UpdateLanguageFile";

describe("UpdateLanguageFile", () => {
  it("should be defined", () => {
    expect(UpdateLanguageFile).toBeDefined();
  });
  it("should be newable", () => {
    expect(() => {
      const instance = new UpdateLanguageFile("crazyfactory", "translation_updater", "GH_TOKEN");
      expect(instance).toBeDefined();
    }).not.toThrow();
  });
  it("should have a public create PR method", () => {
    const instance = new UpdateLanguageFile("crazyfactory", "translation_updater", "GH_TOKEN");
    expect(typeof instance.createFileAndPr).toBe("function");
  });
});