import { configureStore } from "@reduxjs/toolkit";
import * as api from "../../api/client";
import vacanciesReducer, {
  fetchVacancies,
  filterData,
  resetFilters,
  setCenter,
  setCityFilter,
  setMarketplacesFilter,
  setPositionFilter,
  setVacancyTypeFilter
} from "./vacanciesSlice";

jest.mock("../../api/client", () => ({
  getVacancies: jest.fn()
}));

const sampleVacancies = [
  {
    _id: "v1",
    is_active: true,
    vacancy_type: "full-time",
    work_duration: "8",
    marketplace: "hh",
    address: { city: "Москва" },
    position: "Dev"
  },
  {
    _id: "v2",
    is_active: true,
    vacancy_type: "part-time",
    work_duration: "4",
    marketplace: "ozon",
    address: { city: "СПб" },
    position: "Cook"
  }
];

describe("vacanciesSlice reducers", () => {
  it("setCenter updates center", () => {
    const s = vacanciesReducer(undefined, setCenter([1, 2]));
    expect(s.center).toEqual([1, 2]);
  });

  it("filter chain updates filteredData", () => {
    let s = vacanciesReducer(undefined, { type: "@@UNKNOWN" });
    s = { ...s, data: sampleVacancies };
    s = vacanciesReducer(s, setCityFilter("москва"));
    s = vacanciesReducer(s, filterData());
    expect(s.filteredData.map(v => v._id)).toEqual(["v1"]);
  });

  it("resetFilters restores defaults", () => {
    let s = vacanciesReducer(undefined, { type: "@@UNKNOWN" });
    s = { ...s, data: sampleVacancies, filters: { ...s.filters, city: "X" } };
    s = vacanciesReducer(s, resetFilters());
    expect(s.filters.city).toBe("");
  });

  it("setVacancyTypeFilter setMarketplacesFilter setPositionFilter", () => {
    let s = vacanciesReducer(undefined, setVacancyTypeFilter("part-time"));
    expect(s.filters.vacancy_type).toBe("part-time");
    s = vacanciesReducer(s, setMarketplacesFilter(["hh"]));
    expect(s.filters.marketplaces).toEqual(["hh"]);
    s = vacanciesReducer(s, setPositionFilter("Cook"));
    expect(s.filters.position).toBe("Cook");
  });
});

describe("fetchVacancies thunk", () => {
  it("fulfilled stores data and filteredData", async () => {
    api.getVacancies.mockResolvedValue([
      { _id: "a", is_active: true, vacancy_type: "full-time", work_duration: "8", marketplace: "m", address: {}, position: "P" }
    ]);
    const store = configureStore({ reducer: { vacancies: vacanciesReducer } });
    await store.dispatch(fetchVacancies());
    const v = store.getState().vacancies;
    expect(v.loading).toBe(false);
    expect(v.data).toHaveLength(1);
    expect(v.filteredData).toHaveLength(1);
  });
});
