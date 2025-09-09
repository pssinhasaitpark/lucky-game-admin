// import React from "react";
// import { Users, Crown } from "lucide-react";

// const GameCard = ({ game }) => (
//   <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-yellow-100 p-6 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
//     <div className="flex justify-between items-start mb-4">
//       <div>
//         <h3 className="font-bold text-gray-800 text-lg">{game.name}</h3>
//         <p className="text-gray-600 flex items-center">
//           <Users className="w-4 h-4 mr-1" />
//           {game.players} players
//         </p>
//       </div>
//       <span
//         className={`px-3 py-1 rounded-full text-xs font-semibold ${
//           game.status === "active"
//             ? "bg-green-100 text-green-800"
//             : game.status === "completed"
//             ? "bg-blue-100 text-blue-800"
//             : "bg-yellow-100 text-yellow-800"
//         }`}
//       >
//         {game.status}
//       </span>
//     </div>
//     <div className="flex justify-between items-center">
//       <span className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
//         {game.prize}
//       </span>
//       <Crown className="w-6 h-6 text-yellow-500" />
//     </div>
//   </div>
// );

// export default GameCard;
import React from "react";
import { Users, Crown, Sparkles } from "lucide-react";

const GameCard = ({ game }) => (
  <div className="group relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-2xl shadow-xl border border-slate-600 p-6 transition-all duration-300 hover:shadow-2xl hover:transform hover:scale-105 overflow-hidden">
    {/* Animated background */}
    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-white text-lg mb-1">{game.name}</h3>
          <p className="text-slate-300 flex items-center text-sm">
            <Users className="w-4 h-4 mr-1 text-orange-400" />
            {game.players} players
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            game.status === "active"
              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
              : game.status === "completed"
              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
          }`}
        >
          {game.status}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            {game.prize}
          </span>
          <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
        </div>
        <div className="flex items-center space-x-2">
          <Crown className="w-6 h-6 text-yellow-400" />
          {game.status === "active" && (
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          )}
        </div>
      </div>
    </div>

    {/* Decorative corner */}
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-bl-full"></div>
  </div>
);

export default GameCard;
