import searchReducer, { setSearchResult, setSearchValue, updateSearchPrompts } from "./searchSlice";

describe("searchSlice", () => {
  it("updateSearchPrompts and setters", () => {
    let s = searchReducer(undefined, updateSearchPrompts([1, 2]));
    expect(s.searchPrompts).toEqual([1, 2]);
    s = searchReducer(s, setSearchValue("q"));
    expect(s.searchValue).toBe("q");
    s = searchReducer(s, setSearchResult({ id: "x" }));
    expect(s.searchResult).toEqual({ id: "x" });
  });
});
