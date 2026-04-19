import { configureStore } from "@reduxjs/toolkit";
import * as api from "../../api/client";
import companyReducer, { addCompany, fetchAllCompanies, setSelectedCompanyId, toggleEditMode } from "./companySlice";
import userReducer from "./userSlice";

jest.mock("../../api/client");

describe("companySlice", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("setSelectedCompanyId persists to localStorage", () => {
    const s = companyReducer(undefined, setSelectedCompanyId("cid"));
    expect(s.selectedCompanyId).toBe("cid");
    expect(localStorage.getItem("selectedCompanyId")).toBe("cid");
  });

  it("setSelectedCompanyId null clears storage", () => {
    localStorage.setItem("selectedCompanyId", "x");
    companyReducer(undefined, setSelectedCompanyId(null));
    expect(localStorage.getItem("selectedCompanyId")).toBeNull();
  });

  it("toggleEditMode flips flag", () => {
    let s = companyReducer(undefined, toggleEditMode());
    expect(s.isEditMode).toBe(true);
    s = companyReducer(s, toggleEditMode());
    expect(s.isEditMode).toBe(false);
  });

  it("addCompany appends", () => {
    let s = companyReducer(undefined, { type: "@@UNKNOWN" });
    s = companyReducer(s, addCompany({ _id: "n" }));
    expect(s.allCompanies).toEqual([{ _id: "n" }]);
  });

  it("fetchAllCompanies fulfilled filters user companies", async () => {
    api.getCompanies.mockResolvedValue([
      { _id: "1", creator_id: 10, companyName: "A" },
      { _id: "2", creator_id: 11, companyName: "B" }
    ]);
    const userInitial = userReducer(undefined, { type: "@@UNKNOWN" });
    const companyInitial = companyReducer(undefined, { type: "@@UNKNOWN" });
    const store = configureStore({
      reducer: { company: companyReducer, user: userReducer },
      preloadedState: {
        user: { ...userInitial, id: 10 },
        company: companyInitial
      }
    });
    await store.dispatch(fetchAllCompanies());
    const { company } = store.getState();
    expect(company.loading).toBe("succeeded");
    expect(company.allCompanies).toHaveLength(2);
    expect(company.userCompanies).toEqual([{ _id: "1", creator_id: 10, companyName: "A" }]);
  });
});
