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
  DeleteUser, // ✅ Import DeleteUser thunk
} from "../../redux/slice/userSlice.js";
import { Plus } from "lucide-react";

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filter, setFilter] = useState("approved");
  const [approvingUserId, setApprovingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // New states for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUserToDelete, setSelectedUserToDelete] = useState(null);

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
      await dispatch(DeleteUser(userId)).unwrap();
      await dispatch(fetchApprovedUsers());
      await dispatch(fetchPendingUsers());
    } catch (err) {
      console.error("Delete user failed:", err);
    } finally {
      setDeletingUserId(null);
    }
  };

  // Open delete confirmation dialog
  const confirmDeleteUser = (user) => {
    setSelectedUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleUserClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  const sortedApprovedUsers = [...approvedUsers].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const usersToShow =
    filter === "approved" ? sortedApprovedUsers : pendingUsers;

  const tableData = error
    ? [
        {
          _id: "error",
          name: "Error",
          email: error,
          userId: "-",
          mobile: "-",
          wallet: "-",
          role: "-",
        },
      ]
    : usersToShow.length > 0
    ? usersToShow
    : [
        {
          _id: "empty",
          name: "No Data",
          email: "No users found",
          userId: "-",
          mobile: "-",
          wallet: "-",
          role: "-",
        },
      ];

  const columns = [
    {
      key: "userInfo",
      title: "User Info",
      width: "30%",
      render: (user) => {
        if (user._id === "error" || user._id === "empty") {
          return (
            <div className="flex items-center space-x-3">
              <div>
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-gray-400 text-xs">{user.email}</p>
              </div>
            </div>
          );
        }
        return (
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
        );
      },
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
        if (user._id === "error" || user._id === "empty") {
          return <span>-</span>;
        }

        return (
          <div className="flex space-x-2">
            {filter === "pending" && (
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
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                confirmDeleteUser(user); // Open confirmation dialog instead of deleting directly
              }}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:bg-gray-400"
              disabled={deletingUserId === user._id}
            >
              {deletingUserId === user._id ? "Deleting..." : "Delete"}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4 ">
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
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center px-5 py-2 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500  text-white rounded hover:bg-orange-700 disabled:opacity-50 transition"
        >
          <Plus className="w-3 h-3 mr-1" />
          Create User
        </button>
      </div>

      {isFetching || isApproving ? (
        <Loader />
      ) : (
        <CommonTable columns={columns} data={tableData} rowsPerPage={10} />
      )}

      <UserRegistrationDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && selectedUserToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete{" "}
              <strong>{selectedUserToDelete.name}</strong>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setSelectedUserToDelete(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setIsDeleteDialogOpen(false);
                  await handleDeleteUser(selectedUserToDelete._id);
                  setSelectedUserToDelete(null);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
