// getTimeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios/axios.js";

// ✅ Thunk to fetch server time
export const fetchServerTime = createAsyncThunk(
  "serverTime/fetchServerTime",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/time");
      return response.data.currentTime; // ISO timestamp string
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch server time"
      );
    }
  }
);

// ✅ Initial State
const initialState = {
  currentTime: null, // ISO timestamp string
  loading: false,
  error: null,
};

// ✅ Slice
const getTimeSlice = createSlice({
  name: "serverTime",
  initialState,
  reducers: {
    resetServerTime(state) {
      state.currentTime = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServerTime.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServerTime.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTime = action.payload;
      })
      .addCase(fetchServerTime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ✅ Export actions and reducer
export const { resetServerTime } = getTimeSlice.actions;
export default getTimeSlice.reducer;
