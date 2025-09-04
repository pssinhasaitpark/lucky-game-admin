import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGameStats, clearError } from "../../redux/slice/gameSlice.js";
import Loader from "../ui/Loader.jsx";

function Games() {
  const dispatch = useDispatch();
  const { gameStats, loading, error } = useSelector((state) => state.game);

  const [page, setPage] = useState(1);
  const pageSize = 8; // Increased from 5 to 15

  // Selected game to show in modal
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    dispatch(fetchGameStats());
  }, [dispatch]);

  const games = Array.isArray(gameStats) ? gameStats : [];
  const totalPages = Math.ceil(games.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedGames = games.slice(startIndex, startIndex + pageSize);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const clearErrorHandler = () => dispatch(clearError());

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-black">Game Stats</h1>

      {loading && <Loader />}

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded shadow">
          <p className="font-semibold">Error: {error}</p>
          <button
            onClick={clearErrorHandler}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Clear Error
          </button>
        </div>
      )}

      {!loading && !error && games.length === 0 && (
        <p className="text-gray-500">No game stats available.</p>
      )}

      {!loading && !error && games.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto max-h-[700px]">
          <table className="min-w-full text-left text-sm font-medium text-gray-700">
            <thead>
              <tr className="border-b border-gray-200 bg-orange-50">
                <th className="px-6 py-3">Game ID</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Players</th>
                <th className="px-6 py-3">Admin Profit</th>
                <th className="px-6 py-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {paginatedGames.map((game) => (
                <tr
                  key={game.gameId}
                  className="border-b hover:bg-orange-50 cursor-pointer"
                >
                  <td className="px-6 py-4 font-mono">{game.gameId}</td>
                  <td className="px-6 py-4">
                    {new Date(game.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">{game.totalPlayers}</td>
                  <td
                    className={`px-6 py-4 font-semibold ${
                      game.adminProfit >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ₹{game.adminProfit}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="px-3 py-1 rounded bg-orange-500 text-white hover:bg-orange-600 transition"
                      onClick={() => setSelectedGame(game)}
                      aria-label={`View details for game ${game.gameId}`}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-center gap-5 items-center mt-6">
            <button
              disabled={page === 1}
              onClick={handlePrev}
              className={`px-4 py-2 rounded font-semibold ${
                page === 1
                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              Prev
            </button>
            <span className="font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={handleNext}
              className={`px-4 py-2 rounded font-semibold ${
                page === totalPages
                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal for user details */}
      {selectedGame && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
          tabIndex={-1}
          onClick={() => setSelectedGame(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="modal-title"
              className="text-xl font-bold mb-4 text-orange-600"
            >
              Game Details - {selectedGame.gameId}
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              Date: {new Date(selectedGame.timestamp).toLocaleString()}
            </p>
            <div className="overflow-x-auto max-h-96">
              <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-orange-100">
                  <tr>
                    <th className="px-3 py-2">User ID</th>
                    <th className="px-3 py-2">Bid Amount</th>
                    <th className="px-3 py-2">Selected Number</th>
                    <th className="px-3 py-2">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedGame.users.map((u, idx) => (
                    <tr
                      key={idx}
                      className="border-b hover:bg-orange-50 transition"
                    >
                      <td className="px-3 py-2 font-mono">{u.userId}</td>
                      <td className="px-3 py-2">₹{u.bidAmount}</td>
                      <td className="px-3 py-2">{u.selectedNumber}</td>
                      <td
                        className={`px-3 py-2 capitalize font-semibold ${
                          u.result === "win" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {u.result}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={() => setSelectedGame(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Games;
