import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios/axios.js"; // Make sure this path is correct

// Thunk to call set-winning-number API
export const setWinningNumber = createAsyncThunk(
  "dashboard/setWinningNumber",
  async (winningNumber, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/game/admin/set-winning-number",
        {
          winningNumber,
        }
      );
      return response.data; // Assuming response contains { winningNumber: number }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to set winning number"
      );
    }
  }
);

const initialState = {
  sidebarOpen: false,
  activeTab: "dashboard",
  notifications: 5,
  stats: {
    totalUsers: 12450,
    activeGames: 8,
    totalRevenue: 89750,
    todayWinners: 156,
  },
  recentGames: [
    {
      id: 1,
      name: "Golden Wheel",
      players: 234,
      status: "active",
      prize: "$5,000",
    },
    {
      id: 2,
      name: "Lucky Cards",
      players: 189,
      status: "active",
      prize: "$3,200",
    },
    {
      id: 3,
      name: "Diamond Rush",
      players: 456,
      status: "completed",
      prize: "$8,500",
    },
    {
      id: 4,
      name: "Fortune Spin",
      players: 123,
      status: "pending",
      prize: "$2,100",
    },
  ],
  users: [
    { id: 1, name: "John Doe", email: "john@example.com", status: "active" },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      status: "inactive",
    },
  ],
  winners: [
    { id: 1, name: "Alice", game: "Golden Wheel", prize: "$5,000" },
    { id: 2, name: "Bob", game: "Lucky Cards", prize: "$3,200" },
  ],

  // NEW state for setWinningNumber
  setWinningNumberStatus: "idle", // idle | loading | succeeded | failed
  setWinningNumberError: null,
  latestWinningNumber: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    addRecentGame: (state, action) => {
      state.recentGames.push(action.payload);
    },
    updateRecentGame: (state, action) => {
      const index = state.recentGames.findIndex(
        (game) => game.id === action.payload.id
      );
      if (index !== -1) {
        state.recentGames[index] = {
          ...state.recentGames[index],
          ...action.payload,
        };
      }
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    updateUserStatus: (state, action) => {
      const user = state.users.find((u) => u.id === action.payload.id);
      if (user) {
        user.status = action.payload.status;
      }
    },
    addWinner: (state, action) => {
      state.winners.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setWinningNumber.pending, (state) => {
        state.setWinningNumberStatus = "loading";
        state.setWinningNumberError = null;
      })
      .addCase(setWinningNumber.fulfilled, (state, action) => {
        state.setWinningNumberStatus = "succeeded";
        state.latestWinningNumber = action.payload?.winningNumber || null;
      })
      .addCase(setWinningNumber.rejected, (state, action) => {
        state.setWinningNumberStatus = "failed";
        state.setWinningNumberError = action.payload;
      });
  },
});

export const {
  toggleSidebar,
  setActiveTab,
  closeSidebar,
  updateStats,
  setNotifications,
  addRecentGame,
  updateRecentGame,
  addUser,
  updateUserStatus,
  addWinner,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
