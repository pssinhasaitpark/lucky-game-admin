// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "../slice/dashboardSlice.js"; // default import
import userReducer from "../slice/userSlice.js"; // ✅ Import user slice

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    user: userReducer, // ✅ Add user reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"], // optional, safe to remove if not using redux-persist
      },
    }),
});
