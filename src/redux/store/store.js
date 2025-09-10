// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "../slice/dashboardSlice.js"; // default import
import userReducer from "../slice/userSlice.js"; // user slice
import userDetailsReducer from "../slice/userDetailsSlice.js"; // default import
import gameReducer from "../slice/gameSlice.js"; // Import your new game slice
import profileReducer from "../slice/profileSlice.js"; // import profile slice
import serverTimeReducer from "../slice/getTimeSlice.js"; // import server time slice
import latestWinnersReducer from "../slice/latestWinnerSlice.js";
import themeReducer from "../slice/themeSlice.js"; // import theme slice
export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    user: userReducer,
    userDetails: userDetailsReducer,
    game: gameReducer, // Add the game reducer here
    profile: profileReducer, // add profile reducer
    serverTime: serverTimeReducer,
    latestWinners: latestWinnersReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});
