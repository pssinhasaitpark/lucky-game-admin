import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios/axios.js";

// Fetch all game stats
export const fetchGameStats = createAsyncThunk(
  "game/fetchGameStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/game/admin/game-stats");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch a specific game by ID
export const fetchGameById = createAsyncThunk(
  "game/fetchGameById",
  async (gameId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/game/admin/${gameId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  gameStats: [],
  currentGame: null,
  loading: false,
  error: null,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearCurrentGame(state) {
      state.currentGame = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchGameStats
      .addCase(fetchGameStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGameStats.fulfilled, (state, action) => {
        state.loading = false;
        state.gameStats = action.payload;
      })
      .addCase(fetchGameStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch game stats";
      })
      // fetchGameById
      .addCase(fetchGameById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGameById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGame = action.payload;
      })
      .addCase(fetchGameById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch game details";
      });
  },
});

export const { clearError, clearCurrentGame } = gameSlice.actions;
export default gameSlice.reducer;
