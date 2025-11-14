import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/authSlice";
import postSlice from "./features/postSlice";
import { setupInterceptors } from "./utils/axiosUtils";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    posts: postSlice,
  },
});

setupInterceptors(store);
