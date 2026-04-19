import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api/client";
const initialState = {
  _id: null,
  id: null,
  name: "",
  avatar: "./img/user-avatar.png",
  selectedVacancy: {},
  balance: 0,
  favorites: [],
  resume: {
    first_name: "",
    last_name: "",
    phone: "",
    experience: "",
    desired_salary: "",
    additional_info: ""
  },
  loading: false,
  error: null
};
export const updateResume = createAsyncThunk("user/updateResume", async (resumeData, {
  rejectWithValue
}) => {
  try {
    const body = {
      user_id: resumeData.user_id,
      first_name: resumeData.first_name ?? "",
      last_name: resumeData.last_name ?? "",
      experience: resumeData.experience ?? "",
      desired_salary: resumeData.desired_salary ?? "",
      phone: resumeData.phone,
      additional_info: resumeData.additional_info ?? ""
    };
    return await api.saveResume(body);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      return {
        ...state,
        ...action.payload
      };
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },
    setSelectedVacancy: (state, action) => {
      state.selectedVacancy = action.payload;
    },
    updateUserResume: (state, action) => {
      state.resume = action.payload;
    },
    updateUserBalance: (state, action) => {
      state.balance = action.payload;
    },
    toggleFavoriteVacancy: (state, action) => {
      const vacancyId = action.payload;
      if (state.favorites.includes(vacancyId)) {
        state.favorites = state.favorites.filter(id => id !== vacancyId);
      } else {
        state.favorites.push(vacancyId);
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(updateResume.pending, state => {
      state.loading = true;
      state.error = null;
    }).addCase(updateResume.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      if (action.payload) {
        state.resume = {
          first_name: action.payload.first_name ?? "",
          last_name: action.payload.last_name ?? "",
          phone: action.payload.phone ?? "",
          experience: action.payload.experience ?? "",
          desired_salary: action.payload.desired_salary ?? "",
          additional_info: action.payload.additional_info ?? ""
        };
      }
    }).addCase(updateResume.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});
export const {
  setUser,
  setFavorites,
  setSelectedVacancy,
  updateUserResume,
  updateUserBalance,
  toggleFavoriteVacancy
} = userSlice.actions;
export default userSlice.reducer;
