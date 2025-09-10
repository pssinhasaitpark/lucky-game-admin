// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "../slice/dashboardSlice.js";
import userReducer from "../slice/userSlice.js";
import userDetailsReducer from "../slice/userDetailsSlice.js";
import gameReducer from "../slice/gameSlice.js";
import profileReducer from "../slice/profileSlice.js";
import serverTimeReducer from "../slice/getTimeSlice.js";
import latestWinnersReducer from "../slice/latestWinnerSlice.js";
import themeReducer from "../slice/themeSlice.js";
import walletRequestReducer from "../slice/walletRequestSlice.js"; // Add this line

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    user: userReducer,
    userDetails: userDetailsReducer,
    game: gameReducer,
    profile: profileReducer,
    serverTime: serverTimeReducer,
    latestWinners: latestWinnersReducer,
    theme: themeReducer,
    walletRequest: walletRequestReducer, // Add this line
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});
