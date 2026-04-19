import userReducer, {
  setFavorites,
  setUser,
  toggleFavoriteVacancy,
  updateUserBalance,
  updateUserResume
} from "./userSlice";

const baseState = userReducer(undefined, { type: "@@unknown" });

describe("userSlice reducers", () => {
  it("setUser merges payload", () => {
    const next = userReducer(baseState, setUser({ name: "X", id: 3 }));
    expect(next.name).toBe("X");
    expect(next.id).toBe(3);
  });

  it("setFavorites replaces list", () => {
    const next = userReducer(baseState, setFavorites(["a", "b"]));
    expect(next.favorites).toEqual(["a", "b"]);
  });

  it("toggleFavoriteVacancy adds and removes", () => {
    let s = userReducer(baseState, setFavorites(["v1"]));
    s = userReducer(s, toggleFavoriteVacancy("v2"));
    expect(s.favorites).toEqual(["v1", "v2"]);
    s = userReducer(s, toggleFavoriteVacancy("v1"));
    expect(s.favorites).toEqual(["v2"]);
  });

  it("updateUserResume and updateUserBalance", () => {
    let s = userReducer(baseState, updateUserResume({ phone: "1" }));
    expect(s.resume.phone).toBe("1");
    s = userReducer(s, updateUserBalance(500));
    expect(s.balance).toBe(500);
  });
});
