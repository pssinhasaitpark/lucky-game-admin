// userDetailsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios/axios.js";

// ✅ Fetch User Details Thunk
export const fetchUserDetails = createAsyncThunk(
  "userDetails/fetchUserDetails",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/admin/user/${userId}/details`);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user details"
      );
    }
  }
);

// ✅ Initial State
const initialState = {
  user: null,
  stats: null,
  gameHistory: [],
  transactions: [],
  loading: false,
  error: null,
};

// ✅ Slice
const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    resetUserDetails(state) {
      state.user = null;
      state.stats = null;
      state.gameHistory = [];
      state.transactions = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUserDetails handlers
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.stats = action.payload.stats;
        state.gameHistory = action.payload.gameHistory;
        state.transactions = action.payload.transactions;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUserDetails } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
