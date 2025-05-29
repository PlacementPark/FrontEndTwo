import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Assets/Features/User/userSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
  },
});
