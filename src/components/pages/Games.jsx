import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGameStats, clearError } from "../../redux/slice/gameSlice.js";
import Loader from "../ui/Loader.jsx";

function Games() {
  const dispatch = useDispatch();
  const { gameStats, loading, error } = useSelector((state) => state.game);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    dispatch(fetchGameStats());
  }, [dispatch]);

  const games = Array.isArray(gameStats) ? gameStats : [];

  // Filter and sort games
  const filteredGames = games
    .filter(
      (game) =>
        game.gameId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(game.timestamp).toLocaleDateString().includes(searchTerm)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.timestamp) - new Date(a.timestamp);
        case "profit":
          return b.adminProfit - a.adminProfit;
        case "players":
          return b.totalPlayers - a.totalPlayers;
        default:
          return 0;
      }
    });

  const totalPages = Math.ceil(filteredGames.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedGames = filteredGames.slice(startIndex, startIndex + pageSize);
  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const clearErrorHandler = () => dispatch(clearError());

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const columns = [
    {
      key: "gameId",
      title: "Game ID",
      render: (game) => (
        <div className="text-sm font-mono font-medium text-gray-900 dark:text-gray-100">
          {game.gameId}
        </div>
      ),
    },
    {
      key: "timestamp",
      title: "Date & Time",
      render: (game) => (
        <>
          <div className="text-sm text-gray-900 dark:text-gray-100">
            {new Date(game.timestamp).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(game.timestamp).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </>
      ),
    },
    {
      key: "totalPlayers",
      title: "Players",
      render: (game) => (
        <div className="flex items-center">
          <svg
            className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {game.totalPlayers}
          </span>
        </div>
      ),
    },
    {
      key: "adminProfit",
      title: "Admin Profit",
      render: (game) => (
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
            game.adminProfit >= 0
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          }`}
        >
          {formatCurrency(game.adminProfit)}
        </div>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      isAction: true,
      render: (game) => (
        <button
          onClick={() => {
            setSelectedGame(game);
            setSelectedUser(null);
          }}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-700 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          <svg
            className="w-4 h-4 mr-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          View
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      {/* Page Header */}
      <div className="mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Games Overview
        </h1>

        {/* Error Handling */}
        {error && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-4 rounded-lg shadow-md">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-red-500 dark:text-red-400 mr-3 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <h3 className="text-red-800 dark:text-red-300 font-semibold">
                  Error
                </h3>
                <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                  {error}
                </p>
              </div>
              <button
                onClick={clearErrorHandler}
                className="ml-4 px-4 py-1.5 bg-red-500 dark:bg-red-600 text-white text-sm rounded-md hover:bg-red-600 dark:hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <Loader />
          </div>
        )}

        {/* No Data State */}
        {!loading && !error && games.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <svg
              className="w-16 h-16 text-gray-300 dark:text-gray-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Games Available
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Games will appear here once they are played. Check back later or
              start a new game.
            </p>
          </div>
        )}

        {/* Games Table */}
        {!loading && !error && games.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Table Controls */}
            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by Game ID or Date..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10 pr-4 py-2.5 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    Sort by:
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm min-w-[120px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option
                      value="date"
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      Date (Newest)
                    </option>
                    <option
                      value="profit"
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      Profit
                    </option>
                    <option
                      value="players"
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      Players
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className="px-4 md:px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider"
                      >
                        {col.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedGames.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm"
                      >
                        No matching games found
                      </td>
                    </tr>
                  ) : (
                    paginatedGames.map((game) => (
                      <tr
                        key={game.gameId}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                      >
                        {columns.map((col) => (
                          <td
                            key={col.key}
                            className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
                          >
                            {col.render ? col.render(game) : game[col.key]}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 md:px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing <span className="font-medium">{startIndex + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(startIndex + pageSize, filteredGames.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredGames.length}</span>{" "}
                  games
                </div>
                <div className="flex items-center justify-center md:justify-end space-x-2">
                  <button
                    disabled={page === 1}
                    onClick={handlePrev}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Prev
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-md">
                    {page} / {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={handleNext}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    Next
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Modal */}
        {selectedGame && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setSelectedGame(null)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl my-8 overflow-hidden transform transition-all duration-300 scale-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 px-6 py-5 md:px-8 md:py-6 text-white sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">
                      Game Details
                    </h2>
                    <p className="text-orange-100 text-sm mt-1">
                      ID: {selectedGame.gameId} •{" "}
                      {new Date(selectedGame.timestamp).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="p-2 hover:bg-orange-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-600"
                    aria-label="Close modal"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <div className="text-orange-100 text-xs uppercase tracking-wide">
                      Total Players
                    </div>
                    <div className="text-lg font-semibold">
                      {selectedGame.totalPlayers}
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <div className="text-orange-100 text-xs uppercase tracking-wide">
                      Admin Profit
                    </div>
                    <div
                      className={`text-lg font-semibold ${
                        selectedGame.adminProfit >= 0
                          ? "text-green-300"
                          : "text-red-300"
                      }`}
                    >
                      {formatCurrency(selectedGame.adminProfit)}
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <div className="text-orange-100 text-xs uppercase tracking-wide">
                      Status
                    </div>
                    <div className="text-lg font-semibold">Completed</div>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 bg-gray-50 dark:bg-gray-700">
                {/* Player Performance Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-orange-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                      </svg>
                      Player Performance
                    </h3>
                  </div>
                  <div className="overflow-auto max-h-[400px]">
                    <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                        <tr>
                          <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">
                            Player
                          </th>
                          <th className="px-6 py-3 text-right font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">
                            Bid
                          </th>
                          <th className="px-6 py-3 text-right font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">
                            Payout
                          </th>
                          <th className="px-6 py-3 text-center font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">
                            Result
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedGame.users.map((user, idx) => (
                          <tr
                            key={idx}
                            className={`hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer ${
                              selectedUser?.userName === user.userName
                                ? "bg-orange-50 dark:bg-orange-900/20"
                                : ""
                            }`}
                            onClick={() => setSelectedUser(user)}
                          >
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                              {user.userName}
                            </td>
                            <td className="px-6 py-4 text-right font-medium text-gray-700 dark:text-gray-300">
                              {formatCurrency(user.totalBidAmount)}
                            </td>
                            <td className="px-6 py-4 text-right font-medium text-gray-700 dark:text-gray-300">
                              {formatCurrency(user.totalPayout)}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span
                                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                  user.result === "win"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                }`}
                              >
                                {user.result === "win" ? "Win" : "Loss"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Digit Bids Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-orange-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {selectedUser
                        ? `${selectedUser.userName}'s Bids`
                        : "Digit Betting Analysis"}
                    </h3>
                    {selectedUser && (
                      <button
                        onClick={() => setSelectedUser(null)}
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        Back
                      </button>
                    )}
                  </div>
                  <div className="overflow-auto max-h-[400px]">
                    <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                        <tr>
                          <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">
                            Digit
                          </th>
                          <th className="px-6 py-3 text-right font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-right font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">
                            Bets
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedUser ? (
                          Object.entries(selectedUser.digitBids).map(
                            ([digit, bids]) => (
                              <tr
                                key={digit}
                                className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                              >
                                <td className="px-6 py-4">
                                  <span className="inline-flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-800 rounded-full font-bold text-sm">
                                    {digit}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-gray-700 dark:text-gray-300">
                                  {formatCurrency(bids[0].amount)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <span className="inline-flex px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
                                    {bids[0].count}
                                  </span>
                                </td>
                              </tr>
                            )
                          )
                        ) : (
                          <tr>
                            <td
                              colSpan="3"
                              className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm"
                            >
                              Select a player from the left to view their
                              detailed bids
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Games;
