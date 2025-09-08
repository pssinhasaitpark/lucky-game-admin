import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios/axios.js"; // Adjust path if needed

// ✅ Async Thunk: Fetch User Profile
export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/user/profile");
      return res.data.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

// ✅ Initial State
const initialState = {
  userProfile: null,
  loading: false,
  error: null,
};

// ✅ Slice Definition
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // Clear profile manually
    clearUserProfile(state) {
      state.userProfile = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ✅ Exports
export const { clearUserProfile } = profileSlice.actions;
export default profileSlice.reducer;
