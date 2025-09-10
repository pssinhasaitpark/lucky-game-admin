import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CommonTable from "../ui/CommonTable.jsx";
import Loader from "../ui/Loader.jsx";
import {
  fetchWalletRequests,
  respondToWalletRequest,
} from "../../redux/slice/walletRequestSlice.js";

const WalletRequests = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("approved");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [respondingId, setRespondingId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState("");
  const { requests, total, loading, error } = useSelector(
    (state) => state.walletRequest
  );

  useEffect(() => {
    dispatch(fetchWalletRequests({ status: filter, search, page, limit }));
  }, [dispatch, filter, search, page, limit]);

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setActionType("approve");
    setIsConfirmOpen(true);
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setActionType("reject");
    setIsConfirmOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedRequest) return;
    setRespondingId(selectedRequest._id);
    try {
      await dispatch(
        respondToWalletRequest({
          requestId: selectedRequest._id,
          action: actionType,
        })
      ).unwrap();
      dispatch(fetchWalletRequests({ status: filter, search, page, limit }));
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setRespondingId(null);
      setIsConfirmOpen(false);
    }
  };

  const columns = [
    {
      key: "userInfo",
      title: "User Info",
      width: "30%",
      render: (request) => (
        <div className="flex items-center space-x-3">
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              {request.userId.name}
            </p>
            <p className="text-gray-400 dark:text-gray-400 text-xs">
              {request.userId.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "userId",
      title: "User ID",
      width: "15%",
      render: (request) => (
        <span className="text-gray-700 dark:text-gray-300">
          {request.userId.userId || "-"}
        </span>
      ),
    },
    {
      key: "amount",
      title: "Amount",
      width: "15%",
      render: (request) => (
        <span className="text-gray-700 dark:text-gray-300">
          ₹{request.amount ?? 0}
        </span>
      ),
    },
    {
      key: "status",
      title: "Status",
      width: "15%",
      render: (request) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            request.status === "approved"
              ? "bg-green-100 text-green-800"
              : request.status === "rejected"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {request.status}
        </span>
      ),
    },
    {
      key: "requestedAt",
      title: "Requested At",
      width: "15%",
      render: (request) => (
        <span className="text-gray-700 dark:text-gray-300">
          {new Date(request.requestedAt).toLocaleString()}
        </span>
      ),
    },
    {
      key: "action",
      title: "Action",
      width: "20%",
      isAction: true,
      render: (request) => {
        if (request.status !== "pending") return <span>-</span>;
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleApprove(request)}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:opacity-70"
              disabled={respondingId === request._id}
            >
              {respondingId === request._id ? "Processing..." : "Approve"}
            </button>
            <button
              onClick={() => handleReject(request)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:bg-gray-400 disabled:opacity-70"
              disabled={respondingId === request._id}
            >
              {respondingId === request._id ? "Processing..." : "Reject"}
            </button>
          </div>
        );
      },
    },
  ];

  const tableData = error
    ? [
        {
          _id: "error",
          userId: { name: "Error", email: error, userId: "-" },
          amount: "-",
          status: "-",
          requestedAt: "-",
        },
      ]
    : requests.length > 0
    ? requests
    : [
        {
          _id: "empty",
          userId: { name: "No Data", email: "No requests found", userId: "-" },
          amount: "-",
          status: "-",
          requestedAt: "-",
        },
      ];

  return (
    <div className="p-4 pb-8 bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <div>
            <label
              htmlFor="status-filter"
              className="mr-2 font-semibold text-gray-700 dark:text-gray-300"
            >
              Status:
            </label>
            <select
              id="status-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            />
          </div>
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <CommonTable columns={columns} data={tableData} />
          <div className="flex justify-center gap-5 items-center mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 dark:text-black"
            >
              Previous
            </button>
            <span>
              Page {page} of {Math.ceil(total / limit)}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page * limit >= total}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 dark:text-black"
            >
              Next
            </button>
          </div>
        </>
      )}
      {/* Confirmation Dialog */}
      {isConfirmOpen && selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Confirm {actionType === "approve" ? "Approve" : "Reject"}
            </h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Are you sure you want to {actionType} the request from{" "}
              <strong>{selectedRequest.userId.name}</strong> for{" "}
              <strong>₹{selectedRequest.amount}</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 text-white rounded hover:opacity-90 ${
                  actionType === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {actionType === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletRequests;
