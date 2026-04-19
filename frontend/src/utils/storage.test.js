import getSelectedCompanyId from "./storage";

describe("storage default export", () => {
  beforeEach(() => localStorage.clear());

  it("delegates to readSelectedCompanyId", () => {
    localStorage.setItem("selectedCompanyId", "z");
    expect(getSelectedCompanyId()).toBe("z");
  });
});
