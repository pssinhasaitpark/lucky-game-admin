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
      <div className="text-center text-red-600 mt-10 p-4 bg-red-50 dark:bg-red-900 dark:text-red-200 rounded-lg">
        Error: {error}
      </div>
    );

  if (!user)
    return (
      <div className="text-center mt-10 p-4 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-200 rounded-lg">
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
    <div
      className="mx-auto text-gray-800 dark:text-gray-200"
      style={{ minHeight: "calc(100vh - 48px)" }}
    >
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        User Details
      </h1>

      {/* User Info Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* User Basic Info */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white flex items-center justify-center text-3xl font-semibold flex-shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                {user.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ID: {user.userId || "-"}
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 lg:ml-8">
            <InfoCard label="Mobile" value={user.mobile || "-"} />
            <InfoCard label="Role" value={user.role || "User"} />
            <InfoCard
              label="Wallet Balance"
              value={`₹${user.wallet ?? 0}`}
              highlight="text-green-600 dark:text-green-400 font-semibold"
            />
            <InfoCard
              label="Status"
              value={user.isApproved ? "Approved" : "Pending"}
              highlight={
                user.isApproved
                  ? "text-green-600 dark:text-green-400 font-semibold"
                  : "text-yellow-600 dark:text-yellow-400 font-semibold"
              }
            />
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Tabs Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex space-x-1 p-1">
            {["stats", "history", "transactions"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  activeTab === tab
                    ? "bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white shadow-md transform scale-105"
                    : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white hover:shadow-sm"
                }`}
                aria-selected={activeTab === tab}
                role="tab"
              >
                {tab === "stats" && "Statistics"}
                {tab === "history" &&
                  `Game History (${gameHistory?.length || 0})`}
                {tab === "transactions" &&
                  `Transactions (${transactions?.length || 0})`}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs Content */}
        <div className="p-6">
          {activeTab === "stats" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatBox
                label="Total Games"
                value={stats?.totalGames ?? 0}
                icon="🎮"
              />
              <StatBox
                label="Total Won"
                value={`₹${stats?.totalWon ?? 0}`}
                icon="💰"
                valueColor="text-green-600 dark:text-green-400"
              />
              <StatBox
                label="Total Lost"
                value={`₹${stats?.totalLost ?? 0}`}
                icon="💸"
                valueColor="text-red-600 dark:text-red-400"
              />
              <StatBox
                label="Net Balance"
                value={`₹${stats?.net ?? 0}`}
                icon="📊"
                valueColor={
                  stats?.net >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }
              />
            </div>
          )}

          {(activeTab === "history" || activeTab === "transactions") && (
            <div className="space-y-4">
              {/* Table */}
              <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                  <div className="max-h-[600px] overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-xs sticky top-0 z-10">
                        <tr>
                          {activeTab === "history" && (
                            <>
                              <th className="px-6 py-4 text-left border-b border-gray-200 dark:border-gray-600 font-semibold">
                                Game ID
                              </th>
                              <th className="px-6 py-4 text-center border-b border-gray-200 dark:border-gray-600 font-semibold">
                                Selected
                              </th>
                              <th className="px-6 py-4 text-center border-b border-gray-200 dark:border-gray-600 font-semibold">
                                Bid Amount
                              </th>
                              <th className="px-6 py-4 text-center border-b border-gray-200 dark:border-gray-600 font-semibold">
                                Winning #
                              </th>
                              <th className="px-6 py-4 text-center border-b border-gray-200 dark:border-gray-600 font-semibold">
                                Result
                              </th>
                              <th className="px-6 py-4 text-center border-b border-gray-200 dark:border-gray-600 font-semibold">
                                Win Amount
                              </th>
                              <th className="px-6 py-4 text-center border-b border-gray-200 dark:border-gray-600 font-semibold">
                                Date
                              </th>
                            </>
                          )}
                          {activeTab === "transactions" && (
                            <>
                              <th className="px-6 py-4 text-left border-b border-gray-200 dark:border-gray-600 font-semibold">
                                Transaction ID
                              </th>
                              <th className="px-6 py-4 text-center border-b border-gray-200 dark:border-gray-600 font-semibold">
                                Type
                              </th>
                              <th className="px-6 py-4 text-center border-b border-gray-200 dark:border-gray-600 font-semibold">
                                Amount
                              </th>
                              <th className="px-6 py-4 text-center border-b border-gray-200 dark:border-gray-600 font-semibold">
                                New Balance
                              </th>
                              <th className="px-6 py-4 text-center border-b border-gray-200 dark:border-gray-600 font-semibold">
                                Date
                              </th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900">
                        {activeTab === "history" &&
                          paginate(gameHistory, historyPage).map(
                            (game, index) => (
                              <tr
                                key={game.gameId}
                                className={`border-b border-gray-100 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors ${
                                  index % 2 === 0
                                    ? "bg-gray-50 dark:bg-gray-800"
                                    : "bg-white dark:bg-gray-900"
                                }`}
                              >
                                <td className="px-6 py-4">
                                  <Tooltip content={game.gameId}>
                                    <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                      {game.gameId?.slice(0, 8)}...
                                    </code>
                                  </Tooltip>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full font-semibold text-sm">
                                    {game.selectedNumber}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-center font-medium">
                                  ₹{game.bidAmount}
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full font-semibold text-sm">
                                    {game.winningNumber}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium uppercase ${
                                      game.result === "win"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                    }`}
                                  >
                                    {game.result}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-center font-semibold text-green-600 dark:text-green-400">
                                  ₹{game.winAmount}
                                </td>
                                <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">
                                  <Tooltip
                                    content={new Date(
                                      game.timestamp
                                    ).toLocaleString()}
                                  >
                                    {new Date(
                                      game.timestamp
                                    ).toLocaleDateString()}
                                  </Tooltip>
                                </td>
                              </tr>
                            )
                          )}
                        {activeTab === "transactions" &&
                          paginate(transactions, transactionsPage).map(
                            (txn, index) => (
                              <tr
                                key={txn._id}
                                className={`border-b border-gray-100 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors ${
                                  index % 2 === 0
                                    ? "bg-gray-50 dark:bg-gray-800"
                                    : "bg-white dark:bg-gray-900"
                                }`}
                              >
                                <td className="px-6 py-4">
                                  <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                    {txn._id}
                                  </code>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium uppercase ${
                                      txn.transactionType === "deposit"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                    }`}
                                  >
                                    {txn.transactionType}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-center font-medium">
                                  ₹{txn.amount}
                                </td>
                                <td className="px-6 py-4 text-center font-semibold text-blue-600 dark:text-blue-400">
                                  ₹{txn.newBalance}
                                </td>
                                <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">
                                  <Tooltip
                                    content={new Date(
                                      txn.timestamp
                                    ).toLocaleString()}
                                  >
                                    {new Date(
                                      txn.timestamp
                                    ).toLocaleDateString()}
                                  </Tooltip>
                                </td>
                              </tr>
                            )
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
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
                  activeTab === "history" ? setHistoryPage : setTransactionsPage
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// InfoCard component
const InfoCard = ({ label, value, highlight }) => (
  <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border dark:border-gray-700">
    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
      {label}
    </p>
    <p
      className={`text-lg font-semibold ${
        highlight || "text-gray-800 dark:text-gray-200"
      }`}
    >
      {value}
    </p>
  </div>
);

// StatBox component
const StatBox = ({
  label,
  value,
  icon,
  valueColor = "text-gray-800 dark:text-gray-200",
}) => (
  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-md border dark:border-gray-700 hover:shadow-lg transition-all duration-200 hover:scale-105">
    <div className="flex items-center justify-between mb-3">
      <span className="text-2xl">{icon}</span>
      <div className="text-right">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {label}
        </p>
        <p className={`text-2xl font-bold mt-1 ${valueColor}`}>{value}</p>
      </div>
    </div>
  </div>
);

// Pagination component
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
    <div className="flex justify-center items-center space-x-2 py-4">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        ← Prev
      </button>
      {getPageRange.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            page === currentPage
              ? "bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white shadow-md"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        Next →
      </button>
    </div>
  );
};

// Tooltip component
const Tooltip = ({ content, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {showTooltip && (
        <div className="absolute z-10 bg-black text-white text-xs rounded py-1 px-2 -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
          {content}
        </div>
      )}
    </div>
  );
};

export default UserDetail;
