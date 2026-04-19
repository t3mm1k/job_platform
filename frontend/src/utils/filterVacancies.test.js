import { filterVacancies } from "./filterVacancies";

const baseFilters = () => ({
  vacancy_type: "",
  time: "",
  marketplaces: [],
  city: "",
  position: ""
});

describe("filterVacancies", () => {
  it("returns empty when data missing", () => {
    expect(filterVacancies(null, baseFilters())).toEqual([]);
    expect(filterVacancies(undefined, baseFilters())).toEqual([]);
  });

  it("drops inactive vacancies", () => {
    const data = [
      { _id: "1", is_active: true, vacancy_type: "full-time", work_duration: "8", marketplace: "hh", address: {}, position: "Dev" },
      { _id: "2", is_active: false, vacancy_type: "full-time", work_duration: "8", marketplace: "hh", address: {}, position: "Dev" }
    ];
    expect(filterVacancies(data, baseFilters())).toHaveLength(1);
    expect(filterVacancies(data, baseFilters())[0]._id).toBe("1");
  });

  it("filters by vacancy_type case-insensitive on vacancy", () => {
    const data = [
      { _id: "1", is_active: true, vacancy_type: "PART-TIME", work_duration: "4", marketplace: "x", address: {}, position: "P" }
    ];
    const filters = { ...baseFilters(), vacancy_type: "part-time" };
    expect(filterVacancies(data, filters)).toHaveLength(1);
  });

  it("filters by city", () => {
    const data = [
      { _id: "1", is_active: true, vacancy_type: "", work_duration: "", marketplace: "m", address: { city: "Москва" }, position: "" }
    ];
    const filters = { ...baseFilters(), city: "москва" };
    expect(filterVacancies(data, filters)).toHaveLength(1);
  });

  it("filters by marketplaces when list non-empty", () => {
    const data = [
      { _id: "1", is_active: true, vacancy_type: "", work_duration: "", marketplace: "ozon", address: {}, position: "" },
      { _id: "2", is_active: true, vacancy_type: "", work_duration: "", marketplace: "hh", address: {}, position: "" }
    ];
    const filters = { ...baseFilters(), marketplaces: ["ozon"] };
    expect(filterVacancies(data, filters).map(v => v._id)).toEqual(["1"]);
  });

  it("filters by position exact match", () => {
    const data = [
      { _id: "1", is_active: true, vacancy_type: "", work_duration: "", marketplace: "", address: {}, position: "Cook" }
    ];
    const filters = { ...baseFilters(), position: "Cook" };
    expect(filterVacancies(data, filters)).toHaveLength(1);
  });

  it("filters by work_duration when time filter set", () => {
    const data = [
      { _id: "1", is_active: true, vacancy_type: "", work_duration: "8h", marketplace: "", address: {}, position: "" }
    ];
    const filters = { ...baseFilters(), time: "8h" };
    expect(filterVacancies(data, filters)).toHaveLength(1);
    expect(filterVacancies(data, { ...filters, time: "4h" })).toHaveLength(0);
  });
});
