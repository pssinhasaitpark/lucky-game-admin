import React from "react";
import { Users, Crown, Sparkles } from "lucide-react";

const GameCard = ({ game, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] overflow-hidden cursor-pointer"
    >
      {/* Animated shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

      {/* Card Content */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          {/* Game Info */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
              {game.name}
            </h3>
            <p className="text-gray-500 dark:text-gray-300 flex items-center text-sm">
              <Users
                className="w-4 h-4 mr-1 text-indigo-500"
                aria-label="Players"
              />
              {game.players} players
            </p>
          </div>

          {/* Game Status Badge */}
          <span
            title={`Game is ${game.status}`}
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              game.status === "active"
                ? "bg-emerald-100 text-emerald-600 border-emerald-200"
                : game.status === "completed"
                ? "bg-blue-100 text-blue-600 border-blue-200"
                : "bg-yellow-100 text-yellow-600 border-yellow-200"
            }`}
          >
            {game.status}
          </span>
        </div>

        {/* Prize and Status Icons */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              {game.prize}
            </span>
            <Sparkles
              className="w-5 h-5 text-yellow-500 animate-pulse"
              aria-label="Prize sparkle"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Crown
              className="w-6 h-6 text-yellow-500"
              aria-label="Winner crown"
            />
            {game.status === "active" && (
              <div
                className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"
                aria-label="Live"
              ></div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative corner glow */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-yellow-200/30 to-transparent rounded-bl-full pointer-events-none" />
    </div>
  );
};

export default GameCard;
