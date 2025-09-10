// src/redux/slice/walletRequestSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios/axios.js";

// Async thunks
export const fetchWalletRequests = createAsyncThunk(
  "walletRequest/fetch",
  async (
    { status = "pending", search = "", page = 1, limit = 10 },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/admin/wallet-requests/pending?page=${page}&limit=${limit}&status=${status}&search=${search}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const respondToWalletRequest = createAsyncThunk(
  "walletRequest/respond",
  async ({ requestId, action }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/admin/wallet-requests/${requestId}/respond`,
        { action }
      );
      return { requestId, action, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice
const walletRequestSlice = createSlice({
  name: "walletRequest",
  initialState: {
    requests: [],
    total: 0,
    page: 1,
    limit: 10,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch requests
      .addCase(fetchWalletRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWalletRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload.requests;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchWalletRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Respond to request
      .addCase(respondToWalletRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(respondToWalletRequest.fulfilled, (state, action) => {
        state.loading = false;
        const { requestId, action: responseAction } = action.payload;
        const index = state.requests.findIndex((r) => r._id === requestId);
        if (index !== -1) {
          state.requests[index].status = responseAction;
          state.requests[index].respondedAt = new Date().toISOString();
        }
      })
      .addCase(respondToWalletRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default walletRequestSlice.reducer;
