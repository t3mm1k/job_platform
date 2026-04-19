import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const initialState = {
  isFilterOpen: false,
  isSearchOpen: false,
  isClusterSelectionOpen: false,
  isTgMiniApp: true
};
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setIsTgMiniApp: (state, action) => {
      state.isTgMiniApp = action.payload;
      console.log("isTgMiniApp", state.isTgMiniApp);
    },
    setFilterVisibility: (state, action) => {
      state.isFilterOpen = action.payload;
    },
    setSearchVisibility: (state, action) => {
      state.isSearchOpen = action.payload;
    },
    setIsClusterSelectionOpen: (state, action) => {
      state.isClusterSelectionOpen = action.payload;
    }
  }
});
export const {
  setFilterVisibility,
  setSearchVisibility,
  setIsClusterSelectionOpen,
  setIsTgMiniApp
} = uiSlice.actions;
export default uiSlice.reducer;
export const toggleFilterVisibility = createAsyncThunk('ui/toggleFilterVisibility', async (_, {
  getState,
  dispatch
}) => {
  const {
    isSearchOpen,
    isClusterSelectionOpen
  } = getState().ui;
  if (isSearchOpen) {
    dispatch(setSearchVisibility(false));
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  if (isClusterSelectionOpen) {
    dispatch(setIsClusterSelectionOpen(false));
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  dispatch(setFilterVisibility(!getState().ui.isFilterOpen));
});
export const toggleSearchVisibility = createAsyncThunk('ui/toggleSearchVisibility', async (_, {
  getState,
  dispatch
}) => {
  const {
    isFilterOpen,
    isClusterSelectionOpen
  } = getState().ui;
  if (isFilterOpen) {
    dispatch(setFilterVisibility(false));
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  if (isClusterSelectionOpen) {
    dispatch(setIsClusterSelectionOpen(false));
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  dispatch(setSearchVisibility(!getState().ui.isSearchOpen));
});
export const toggleClusterSelectionVisibility = createAsyncThunk('ui/toggleClusterSelectionVisibility', async (_, {
  getState,
  dispatch
}) => {
  const {
    isFilterOpen,
    isSearchOpen
  } = getState().ui;
  if (isFilterOpen) {
    dispatch(setFilterVisibility(false));
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  if (isSearchOpen) {
    dispatch(setSearchVisibility(false));
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  dispatch(setIsClusterSelectionOpen(!getState().ui.isClusterSelectionOpen));
});
