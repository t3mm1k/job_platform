import { buildApiUrl, joinApiPath, normalizeApiBase } from "./url";

describe("normalizeApiBase", () => {
  it("trims trailing slash", () => {
    expect(normalizeApiBase("https://a.com/api/")).toBe("https://a.com/api");
  });

  it("handles null and undefined", () => {
    expect(normalizeApiBase(null)).toBe("");
    expect(normalizeApiBase(undefined)).toBe("");
  });
});

describe("joinApiPath", () => {
  it("adds leading slash to path", () => {
    expect(joinApiPath("", "users")).toBe("/users");
  });

  it("keeps leading slash", () => {
    expect(joinApiPath("https://x", "/v1")).toBe("https://x/v1");
  });
});

describe("buildApiUrl", () => {
  it("combines base and path", () => {
    expect(buildApiUrl("https://host/api/", "/users")).toBe("https://host/api/users");
    expect(buildApiUrl("", "vacancies")).toBe("/vacancies");
  });
});
