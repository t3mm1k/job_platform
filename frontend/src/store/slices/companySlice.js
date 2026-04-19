import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api/client";
export const fetchAllCompanies = createAsyncThunk("company/fetchAllCompanies", async (_, {
  getState
}) => {
  const state = getState();
  const userId = state.user.id;
  const data = await api.getCompanies();
  return {
    companies: data,
    userId
  };
});
const initialState = {
  userCompanies: [],
  allCompanies: [],
  selectedCompanyId: null,
  isEditMode: false,
  isShowCompanySelector: false,
  loading: "idle",
  error: null
};
const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setSelectedCompanyId: (state, action) => {
      const v = action.payload;
      state.selectedCompanyId = v;
      state.isShowCompanySelector = false;
      if (v == null || v === "") {
        localStorage.removeItem("selectedCompanyId");
      } else {
        localStorage.setItem("selectedCompanyId", String(v));
      }
    },
    toggleEditMode: state => {
      state.isEditMode = !state.isEditMode;
    },
    toggleIsShowCompanySelector: state => {
      state.isShowCompanySelector = !state.isShowCompanySelector;
    },
    setUserCompanies: state => {
      const userId = state.userSlice.id;
      state.userCompanies = state.allCompanies.filter(company => company.creatorId === userId);
    },
    addCompany: (state, action) => {
      state.allCompanies.push(action.payload);
      console.log(state.allCompanies);
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchAllCompanies.pending, state => {
      state.loading = "pending";
    });
    builder.addCase(fetchAllCompanies.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.allCompanies = action.payload.companies;
      state.userCompanies = action.payload.companies.filter(company => company.creator_id === action.payload.userId);
    });
    builder.addCase(fetchAllCompanies.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.error.message;
    });
  }
});
export const {
  setSelectedCompanyId,
  toggleEditMode,
  toggleIsShowCompanySelector,
  setUserCompanies,
  addCompany
} = companySlice.actions;
export default companySlice.reducer;
