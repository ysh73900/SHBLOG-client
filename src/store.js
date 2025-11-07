import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/authSlice";
import { setupInterceptors } from "./utils/axiosUtils";

export const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});

setupInterceptors(store);
