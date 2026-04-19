import store from "./store/store";

describe("store", () => {
  it("configures with all reducers", () => {
    const s = store.getState();
    expect(s).toHaveProperty("user");
    expect(s).toHaveProperty("vacancies");
    expect(s).toHaveProperty("company");
    expect(s).toHaveProperty("ui");
    expect(s).toHaveProperty("search");
  });
});
