import { filterCompaniesByCreatorId } from "./companyFilters";

describe("filterCompaniesByCreatorId", () => {
  it("returns empty for nullish list", () => {
    expect(filterCompaniesByCreatorId(null, 1)).toEqual([]);
    expect(filterCompaniesByCreatorId(undefined, 1)).toEqual([]);
  });

  it("filters by creator_id", () => {
    const list = [
      { _id: "a", creator_id: 1 },
      { _id: "b", creator_id: 2 },
      { _id: "c", creator_id: 1 }
    ];
    expect(filterCompaniesByCreatorId(list, 1)).toEqual([list[0], list[2]]);
  });
});
