import uiReducer, {
  setFilterVisibility,
  setIsClusterSelectionOpen,
  setIsTgMiniApp,
  setSearchVisibility
} from "./uiSlice";

describe("uiSlice", () => {
  it("toggles visibility flags", () => {
    let s = uiReducer(undefined, setFilterVisibility(true));
    expect(s.isFilterOpen).toBe(true);
    s = uiReducer(s, setSearchVisibility(true));
    expect(s.isSearchOpen).toBe(true);
    s = uiReducer(s, setIsClusterSelectionOpen(true));
    expect(s.isClusterSelectionOpen).toBe(true);
    s = uiReducer(s, setIsTgMiniApp(false));
    expect(s.isTgMiniApp).toBe(false);
  });
});
