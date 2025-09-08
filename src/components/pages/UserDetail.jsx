import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserDetails } from "../../redux/slice/userDetailsSlice";
import Loader from "../ui/Loader";

const UserDetail = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("stats");
  const [historyPage, setHistoryPage] = useState(1);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const rowsPerPage = 10;

  const {
    user,
    stats,
    gameHistory = [],
    transactions = [],
    loading,
    error,
  } = useSelector((state) => state.userDetails);

  useEffect(() => {
    if (userId) dispatch(fetchUserDetails(userId));
  }, [userId, dispatch]);

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="text-center text-red-600 mt-10 p-4 bg-red-50 rounded-lg">
        Error: {error}
      </div>
    );
  if (!user)
    return (
      <div className="text-center mt-10 p-4 bg-gray-50 rounded-lg">
        No user found
      </div>
    );

  const paginate = (data, page) => {
    if (!Array.isArray(data) || data.length === 0) return [];
    const start = (page - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  };

  const totalHistoryPages = Math.ceil((gameHistory?.length || 0) / rowsPerPage);
  const totalTransactionPages = Math.ceil(
    (transactions?.length || 0) / rowsPerPage
  );

  return (
    <div className="mx-auto " style={{ minHeight: "calc(100vh - 48px)" }}>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">User Details</h1>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center text-3xl font-semibold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {user.name}
              </h2>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <strong>Mobile:</strong> {user.mobile || "-"}
            </p>
            <p>
              <strong>User ID:</strong> {user.userId || "-"}
            </p>
            <p>
              <strong>Role:</strong> {user.role || "User"}
            </p>
            <p>
              <strong>Wallet:</strong> ₹{user.wallet ?? 0}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  user.isApproved
                    ? "text-green-600 font-semibold"
                    : "text-yellow-600 font-semibold"
                }
              >
                {user.isApproved ? "Approved" : "Pending"}
              </span>
            </p>
          </div>
        </div>

        {/* Tabs & Content */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          {/* Tabs */}
          <div className="flex space-x-3 border-b border-gray-200">
            {["stats", "history", "transactions"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  activeTab === tab
                    ? "bg-orange-500 text-white border-b-2 border-orange-500"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                aria-selected={activeTab === tab}
                role="tab"
              >
                {tab === "stats" && "Stats"}
                {tab === "history" && "Game History"}
                {tab === "transactions" && "Transactions"}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex-grow flex flex-col overflow-hidden">
            {activeTab === "stats" && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatBox label="Total Games" value={stats?.totalGames ?? 0} />
                <StatBox label="Total Won" value={`₹${stats?.totalWon ?? 0}`} />
                <StatBox
                  label="Total Lost"
                  value={`₹${stats?.totalLost ?? 0}`}
                />
                <StatBox label="Net" value={`₹${stats?.net ?? 0}`} />
              </div>
            )}

            {(activeTab === "history" || activeTab === "transactions") && (
              <div className="flex flex-col flex-grow overflow-hidden">
                <div className="overflow-x-auto flex-grow overflow-y-auto max-h-[500px] border border-gray-200 rounded">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs sticky top-0 z-10">
                      <tr>
                        {activeTab === "history" && (
                          <>
                            <th className="px-4 py-3 text-center border-b">
                              Game ID
                            </th>
                            <th className="px-4 py-3 text-center border-b">
                              Selected
                            </th>
                            <th className="px-4 py-3 text-center border-b">
                              Bid
                            </th>
                            <th className="px-4 py-3 text-center border-b">
                              Winning
                            </th>
                            <th className="px-4 py-3 text-center border-b">
                              Result
                            </th>
                            <th className="px-4 py-3 text-center border-b">
                              Win
                            </th>
                            <th className="px-4 py-3 text-center border-b">
                              Date
                            </th>
                          </>
                        )}
                        {activeTab === "transactions" && (
                          <>
                            <th className="px-4 py-3 text-center border-b">
                              Txn ID
                            </th>
                            <th className="px-4 py-3 text-center border-b">
                              Type
                            </th>
                            <th className="px-4 py-3 text-center border-b">
                              Amount
                            </th>
                            <th className="px-4 py-3 text-center border-b">
                              New Balance
                            </th>
                            <th className="px-4 py-3 text-center border-b">
                              Date
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {activeTab === "history" &&
                        paginate(gameHistory, historyPage).map((game) => (
                          <tr
                            key={game.gameId}
                            className="border-b hover:bg-orange-50 transition"
                          >
                            <td className="px-4 py-3 text-center">
                              <Tooltip content={game.gameId}>
                                <span className="truncate max-w-[100px] inline-block">
                                  {game.gameId?.slice(0, 8)}...
                                </span>
                              </Tooltip>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Tooltip
                                content={game.selectedNumber?.toString()}
                              >
                                <span className="truncate max-w-[60px] inline-block">
                                  {game.selectedNumber}
                                </span>
                              </Tooltip>
                            </td>
                            <td className="px-4 py-3 text-center">
                              ₹{game.bidAmount}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Tooltip content={game.winningNumber?.toString()}>
                                <span className="truncate max-w-[60px] inline-block">
                                  {game.winningNumber}
                                </span>
                              </Tooltip>
                            </td>
                            <td
                              className={`px-4 py-3 text-center capitalize font-semibold ${
                                game.result === "win"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {game.result}
                            </td>
                            <td className="px-4 py-3 text-center">
                              ₹{game.winAmount}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Tooltip
                                content={new Date(
                                  game.timestamp
                                ).toLocaleString()}
                              >
                                <span className="truncate max-w-[120px] inline-block">
                                  {new Date(game.timestamp).toLocaleString()}
                                </span>
                              </Tooltip>
                            </td>
                          </tr>
                        ))}

                      {activeTab === "transactions" &&
                        paginate(transactions, transactionsPage).map((txn) => (
                          <tr
                            key={txn._id}
                            className="border-b hover:bg-orange-50 transition"
                          >
                            <td className="px-4 py-3 text-center">
                              <Tooltip content={txn._id}>
                                <span className="truncate max-w-[100px] inline-block">
                                  {txn._id?.slice(0, 8)}...
                                </span>
                              </Tooltip>
                            </td>
                            <td
                              className={`px-4 py-3 text-center capitalize font-semibold ${
                                txn.transactionType === "deposit"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {txn.transactionType}
                            </td>
                            <td className="px-4 py-3 text-center">
                              ₹{txn.amount}
                            </td>
                            <td className="px-4 py-3 text-center">
                              ₹{txn.newBalance}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Tooltip
                                content={new Date(
                                  txn.timestamp
                                ).toLocaleString()}
                              >
                                <span className="truncate max-w-[120px] inline-block">
                                  {new Date(txn.timestamp).toLocaleString()}
                                </span>
                              </Tooltip>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  currentPage={
                    activeTab === "history" ? historyPage : transactionsPage
                  }
                  totalPages={
                    activeTab === "history"
                      ? totalHistoryPages
                      : totalTransactionPages
                  }
                  onPageChange={
                    activeTab === "history"
                      ? setHistoryPage
                      : setTransactionsPage
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value }) => (
  <div className="text-center bg-gradient-to-br from-white to-gray-50 rounded-lg p-6 shadow-md flex flex-col justify-center transition-transform hover:scale-105">
    <p className="text-gray-500 text-sm font-medium">{label}</p>
    <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxPagesToShow = 5;

  const getPageRange = useMemo(() => {
    if (totalPages <= 1) return [];

    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    const adjustedStartPage = Math.max(1, endPage - maxPagesToShow + 1);

    return Array.from(
      { length: endPage - adjustedStartPage + 1 },
      (_, i) => adjustedStartPage + i
    );
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-orange-500"
        aria-label="Previous page"
      >
        Prev
      </button>
      {getPageRange.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            page === currentPage
              ? "bg-orange-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-orange-500"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
};

const Tooltip = ({ content, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
      >
        {children}
      </div>
      {showTooltip && (
        <div className="absolute z-20 top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 text-xs text-white bg-gray-800 rounded shadow-lg whitespace-nowrap transition-opacity duration-200">
          {content}
        </div>
      )}
    </div>
  );
};

export default UserDetail;
