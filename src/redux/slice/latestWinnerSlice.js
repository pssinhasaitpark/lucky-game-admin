import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios/axios.js";

// Async thunk to fetch latest winners
export const fetchLatestWinners = createAsyncThunk(
  "latestWinners/fetchLatestWinners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/game/latest-winners");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  winners: [],
  loading: false,
  error: null,
};

const latestWinnersSlice = createSlice({
  name: "latestWinners",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearWinners(state) {
      state.winners = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatestWinners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestWinners.fulfilled, (state, action) => {
        state.loading = false;
        state.winners = action.payload;
      })
      .addCase(fetchLatestWinners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch latest winners";
      });
  },
});

export const { clearError, clearWinners } = latestWinnersSlice.actions;
export default latestWinnersSlice.reducer;
