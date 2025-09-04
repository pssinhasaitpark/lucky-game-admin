// src/redux/slice/dashboardSlice.js
import { createSlice } from "@reduxjs/toolkit";

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
