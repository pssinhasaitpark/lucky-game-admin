// userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios/axios.js";

// ✅ Login Thunk
export const loginAdmin = createAsyncThunk(
  "user/loginAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/user/login", {
        userId: "ADMIN_5319",
        password: "12345678",
      });
      const { token } = res.data.data;
      localStorage.setItem("token", token);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// ✅ Register User Thunk
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/user/register", userData);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// ✅ Fetch Approved Users Thunk
export const fetchApprovedUsers = createAsyncThunk(
  "user/fetchApprovedUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/admin/approved-users");
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// ✅ Fetch Pending Users Thunk
export const fetchPendingUsers = createAsyncThunk(
  "user/fetchPendingUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/admin/pending-users");
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch pending users"
      );
    }
  }
);

// ✅ Approve User Thunk
export const approveUser = createAsyncThunk(
  "user/approveUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/admin/approve-user/${userId}`, {
        isApproved: true,
      });
      return { userId, approvedUserData: res.data.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve user"
      );
    }
  }
);

export const DeleteUser = createAsyncThunk(
  "user/DeleteUser",
  async (_id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/admin/user/${_id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

// ✅ Initial State
const initialState = {
  token: localStorage.getItem("token") || null,
  userInfo: null,
  approvedUsers: [],
  pendingUsers: [],
  loading: false,
  error: null,
  registrationStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  registrationError: null,
};

// ✅ Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.userInfo = null;
      localStorage.removeItem("token");
    },
    resetRegistrationStatus(state) {
      state.registrationStatus = "idle";
      state.registrationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // loginAdmin handlers
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.userInfo = action.payload.user;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // registerUser handlers
      .addCase(registerUser.pending, (state) => {
        state.registrationStatus = "loading";
        state.registrationError = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.registrationStatus = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registrationStatus = "failed";
        state.registrationError = action.payload;
      })
      // fetchApprovedUsers handlers
      .addCase(fetchApprovedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApprovedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.approvedUsers = action.payload;
      })
      .addCase(fetchApprovedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchPendingUsers handlers
      .addCase(fetchPendingUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingUsers = action.payload;
      })
      .addCase(fetchPendingUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // approveUser handlers
      .addCase(approveUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveUser.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, approvedUserData } = action.payload;
        state.pendingUsers = state.pendingUsers.filter(
          (user) => user._id !== userId
        );
        const approvedUser = {
          _id: userId,
          userId: approvedUserData.userId,
          email: approvedUserData.email,
          wallet: approvedUserData.wallet,
          name: "",
          mobile: "-",
          role: "user",
          isApproved: true,
        };
        state.approvedUsers.push(approvedUser);
      })
      .addCase(approveUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // DeleteUser handlers
      .addCase(DeleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(DeleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const deletedUserId =
          action.payload.userId || action.payload._id || action.meta?.arg;
        // Remove the deleted user from approvedUsers and pendingUsers
        state.approvedUsers = state.approvedUsers.filter(
          (user) => user._id !== deletedUserId
        );
        state.pendingUsers = state.pendingUsers.filter(
          (user) => user._id !== deletedUserId
        );
      })
      .addCase(DeleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, resetRegistrationStatus } = userSlice.actions;
export default userSlice.reducer;
