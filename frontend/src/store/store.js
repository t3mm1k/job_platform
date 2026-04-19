import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import vacanciesReducer from './slices/vacanciesSlice';
import uiReducer from './slices/uiSlice';
import searchReducer from './slices/searchSlice';
import companyReducer from './slices/companySlice';
const store = configureStore({
  reducer: {
    user: userReducer,
    vacancies: vacanciesReducer,
    ui: uiReducer,
    search: searchReducer,
    company: companyReducer
  }
});
export default store;
