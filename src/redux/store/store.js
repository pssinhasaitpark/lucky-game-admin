// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "../slice/dashboardSlice.js"; // default import
import userReducer from "../slice/userSlice.js"; // user slice
import userDetailsReducer from "../slice/userDetailsSlice.js"; // default import
import gameReducer from "../slice/gameSlice.js"; // Import your new game slice

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    user: userReducer,
    userDetails: userDetailsReducer,
    game: gameReducer, // Add the game reducer here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});
