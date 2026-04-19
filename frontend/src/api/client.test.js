import { getUser, normalizeUser, upsertUserFromTelegram } from "./client";

describe("normalizeUser", () => {
  it("returns null for falsy", () => {
    expect(normalizeUser(null)).toBeNull();
    expect(normalizeUser(undefined)).toBeNull();
  });

  it("maps _id to id", () => {
    expect(normalizeUser({ _id: 5, name: "U" })).toEqual({
      _id: 5,
      name: "U",
      id: 5
    });
  });

  it("prefers _id over id for id field", () => {
    expect(normalizeUser({ _id: 1, id: 99 })).toMatchObject({ id: 1 });
  });
});

describe("client fetch wrappers", () => {
  const origFetch = global.fetch;
  const origEnv = process.env.REACT_APP_API_URL;

  afterEach(() => {
    global.fetch = origFetch;
    process.env.REACT_APP_API_URL = origEnv;
  });

  beforeEach(() => {
    process.env.REACT_APP_API_URL = "";
  });

  it("getUser parses JSON body", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ _id: 7, name: "N" })
    });
    const u = await getUser(7);
    expect(u).toEqual({ _id: 7, name: "N", id: 7 });
    expect(fetch).toHaveBeenCalledWith("/users/7", expect.any(Object));
  });

  it("upsertUserFromTelegram posts built payload", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ _id: 9, username: "bot" })
    });
    const u = await upsertUserFromTelegram({
      id: 9,
      username: "bot",
      first_name: "A",
      last_name: "B"
    });
    expect(u.id).toBe(9);
    const [, init] = fetch.mock.calls[0];
    expect(JSON.parse(init.body)).toEqual({
      user_id: 9,
      username: "bot",
      first_name: "A",
      last_name: "B",
      name: "A B"
    });
  });

  it("throws on non-ok response", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Err",
      json: async () => ({ detail: "fail" })
    });
    await expect(getUser(1)).rejects.toThrow("fail");
  });
});
