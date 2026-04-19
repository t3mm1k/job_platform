import { persistSelectedCompanyId, readSelectedCompanyId } from "./selectedCompanyStorage";

describe("selectedCompanyStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("readSelectedCompanyId returns null for missing key", () => {
    expect(readSelectedCompanyId()).toBeNull();
  });

  it("readSelectedCompanyId normalizes empty and literal null string", () => {
    localStorage.setItem("selectedCompanyId", "");
    expect(readSelectedCompanyId()).toBeNull();
    localStorage.setItem("selectedCompanyId", "null");
    expect(readSelectedCompanyId()).toBeNull();
  });

  it("readSelectedCompanyId returns stored id", () => {
    localStorage.setItem("selectedCompanyId", "abc123");
    expect(readSelectedCompanyId()).toBe("abc123");
  });

  it("persistSelectedCompanyId removes key for null and empty string", () => {
    localStorage.setItem("selectedCompanyId", "x");
    persistSelectedCompanyId(null);
    expect(localStorage.getItem("selectedCompanyId")).toBeNull();
    localStorage.setItem("selectedCompanyId", "x");
    persistSelectedCompanyId("");
    expect(localStorage.getItem("selectedCompanyId")).toBeNull();
  });

  it("persistSelectedCompanyId stringifies id", () => {
    persistSelectedCompanyId(42);
    expect(localStorage.getItem("selectedCompanyId")).toBe("42");
  });
});
