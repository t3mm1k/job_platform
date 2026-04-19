import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api/client";
import { filterVacancies } from "../../utils/filterVacancies";
export const fetchVacancies = createAsyncThunk("mapData/fetchVacancies", async (_, {
  signal
}) => {
  const controller = new AbortController();
  signal.addEventListener("abort", () => controller.abort());
  try {
    return await api.getVacancies(true, signal);
  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }
    throw error;
  }
});
const initialState = {
  data: [],
  center: [37.588144, 55.733842],
  filters: {
    vacancy_type: "",
    time: "",
    marketplaces: [],
    city: "",
    position: ""
  },
  filteredData: [],
  clusterData: [],
  loading: false,
  error: null
};
const vacanciesSlice = createSlice({
  name: "vacancies",
  initialState,
  reducers: {
    setCenter: (state, action) => {
      state.center = action.payload;
    },
    setVacancyTypeFilter: (state, action) => {
      state.filters.vacancy_type = action.payload;
      if (action.payload === "full-time" || action.payload === "") {
        state.filters.time = [];
      }
    },
    setTimeFilter: (state, action) => {
      state.filters.time = action.payload;
    },
    setMarketplacesFilter: (state, action) => {
      state.filters.marketplaces = action.payload;
    },
    setCityFilter: (state, action) => {
      state.filters.city = action.payload;
    },
    setPositionFilter: (state, action) => {
      state.filters.position = action.payload;
    },
    filterData: state => {
      state.filteredData = filterVacancies(state.data, state.filters);
    },
    resetFilters: state => {
      state.filters = initialState.filters;
      state.filteredData = [];
    },
    setClusterData: (state, action) => {
      state.clusterData = action.payload;
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchVacancies.pending, state => {
      state.loading = true;
      state.error = null;
    }).addCase(fetchVacancies.fulfilled, (state, action) => {
      state.loading = false;
      const payload = action.payload ?? [];
      state.data = payload;
      state.filteredData = filterVacancies(payload, state.filters);
    }).addCase(fetchVacancies.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  }
});
export const {
  setVacancyTypeFilter,
  setTimeFilter,
  setMarketplacesFilter,
  setCityFilter,
  setPositionFilter,
  filterData,
  resetFilters,
  setClusterData,
  setCenter
} = vacanciesSlice.actions;
export const selectMapDataLoading = state => state.vacancies.loading;
export const selectMapDataError = state => state.vacancies.error;
export default vacanciesSlice.reducer;
