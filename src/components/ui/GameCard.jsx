import React from "react";
import { Users, Crown } from "lucide-react";

const GameCard = ({ game }) => (
  <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-yellow-100 p-6 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-bold text-gray-800 text-lg">{game.name}</h3>
        <p className="text-gray-600 flex items-center">
          <Users className="w-4 h-4 mr-1" />
          {game.players} players
        </p>
      </div>
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          game.status === "active"
            ? "bg-green-100 text-green-800"
            : game.status === "completed"
            ? "bg-blue-100 text-blue-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {game.status}
      </span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
        {game.prize}
      </span>
      <Crown className="w-6 h-6 text-yellow-500" />
    </div>
  </div>
);

export default GameCard;
