import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CommonTable from "../ui/CommonTable.jsx";
import UserRegistrationDialog from "../ui/dialog/UserRegistrationDialog.jsx";
import Loader from "../ui/Loader.jsx";
import {
  fetchApprovedUsers,
  fetchPendingUsers,
  approveUser,
} from "../../redux/slice/userSlice.js";
import { Plus } from "lucide-react";

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Add this line
  const [filter, setFilter] = useState("approved");
  const [approvingUserId, setApprovingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const approvedUsers = useSelector((state) => state.user.approvedUsers);
  const pendingUsers = useSelector((state) => state.user.pendingUsers || []);
  const error = useSelector((state) => state.user.error);

  useEffect(() => {
    dispatch(fetchApprovedUsers());
    dispatch(fetchPendingUsers());
  }, [dispatch]);

  const fetchFilteredUsers = async () => {
    setIsFetching(true);
    try {
      if (filter === "approved") {
        await dispatch(fetchApprovedUsers());
      } else {
        await dispatch(fetchPendingUsers());
      }
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchFilteredUsers();
  }, [filter, dispatch]);

  const handleApproveUser = async (userId) => {
    setIsApproving(true);
    setApprovingUserId(userId);
    try {
      await dispatch(approveUser(userId)).unwrap();
      await dispatch(fetchApprovedUsers());
      await dispatch(fetchPendingUsers());
      setFilter("approved");
    } catch (err) {
      console.error("Approve user failed:", err);
    } finally {
      setIsApproving(false);
      setApprovingUserId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    setDeletingUserId(userId);
    try {
      // Uncomment when deleteUser is implemented
      // await dispatch(deleteUser(userId)).unwrap();
      dispatch(fetchApprovedUsers());
      dispatch(fetchPendingUsers());
    } catch (err) {
      console.error("Delete user failed:", err);
    } finally {
      setDeletingUserId(null);
    }
  };

  // Add this function
  const handleUserClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  const sortedApprovedUsers = [...approvedUsers].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const usersToShow =
    filter === "approved" ? sortedApprovedUsers : pendingUsers;

  const columns = [
    {
      key: "userInfo",
      title: "User Info",
      width: "30%",
      render: (user) => (
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => handleUserClick(user._id)}
        >
          <img
            src={`https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-800">{user.name}</p>
            <p className="text-gray-400 text-xs">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "userId",
      title: "User ID",
      width: "15%",
      render: (user) => <span>{user.userId || "-"}</span>,
    },
    {
      key: "mobile",
      title: "Mobile",
      width: "15%",
      render: (user) => <span>{user.mobile || "-"}</span>,
    },
    {
      key: "wallet",
      title: "Wallet",
      width: "15%",
      render: (user) => <span>₹{user.wallet ?? 0}</span>,
    },
    {
      key: "role",
      title: "Role",
      width: "15%",
      render: (user) => <span>{user.role || "user"}</span>,
    },
    {
      key: "action",
      title: "Action",
      width: "20%",
      isAction: true,
      render: (user) => {
        if (filter === "pending") {
          return (
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleApproveUser(user._id);
                }}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:bg-gray-400"
                disabled={approvingUserId === user._id}
              >
                {approvingUserId === user._id ? "Approving..." : "Approve"}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // onClick={() => handleDeleteUser(user._id)}
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:bg-gray-400"
                disabled={deletingUserId === user._id}
              >
                {deletingUserId === user._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          );
        } else {
          return (
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Add edit logic here
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // onClick={() => handleDeleteUser(user._id)}
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:bg-gray-400"
                disabled={deletingUserId === user._id}
              >
                {deletingUserId === user._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          );
        }
      },
    },
  ];
  if (isFetching || isApproving) {
    return <Loader />;
  }
  if (error) {
    return <p className="text-red-600">Error: {error}</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Users</h2>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center px-5 py-2 bg-orange-500 text-white rounded hover:bg-orange-700 disabled:opacity-50 transition"
        >
          <Plus className="w-3 h-3 mr-1" />
          Create User
        </button>
      </div>
      <div className="mb-4">
        <label htmlFor="user-filter" className="mr-2 font-semibold">
          Show:
        </label>
        <select
          id="user-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1"
        >
          <option value="approved">Approved Users</option>
          <option value="pending">Pending Users</option>
        </select>
      </div>

      <CommonTable columns={columns} data={usersToShow} rowsPerPage={10} />
      <UserRegistrationDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
};

export default Users;
