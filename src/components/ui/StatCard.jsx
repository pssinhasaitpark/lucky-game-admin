// // components/ui/StatCard.jsx
// import React from "react";

// const StatCard = ({ title, value, icon: Icon, trend, isPrimary, onClick }) => {
//   return (
//     <div
//       onClick={onClick}
//       className={`flex justify-between items-center p-6 rounded-xl shadow-sm transition-all duration-300 cursor-pointer ${
//         isPrimary ? "bg-[#FD7F2C] text-white" : "bg-[#2b2b2b] text-white"
//       }`}
//     >
//       {/* Left section */}
//       <div>
//         <p className="text-2xl font-bold">{value}</p>
//         <p className="text-sm opacity-80 mt-1">{title}</p>
//       </div>
//       {/* Right section */}
//       <div className="flex flex-col items-end">
//         <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center mb-2">
//           <Icon
//             className={`w-5 h-5 ${
//               isPrimary ? "text-[#FD7F2C]" : "text-[#2b2b2b]"
//             }`}
//           />
//         </div>
//         {trend && <span className="text-sm font-semibold">+{trend}%</span>}
//       </div>
//     </div>
//   );
// };

// export default StatCard;
import React from "react";
import { TrendingUp } from "lucide-react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  isPrimary,
  onClick,
  subtitle,
}) => {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl ${
        isPrimary
          ? "bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white"
          : "bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white border border-slate-600"
      }`}
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

      <div className="relative z-10 flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div
              className={`p-2 rounded-xl ${
                isPrimary
                  ? "bg-white/20"
                  : "bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 /20"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isPrimary ? "text-white" : "text-orange-400"
                }`}
              />
            </div>
            {trend && (
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-400">
                  +{trend}%
                </span>
              </div>
            )}
          </div>
          <h3 className="text-3xl font-bold mb-1">{value}</h3>
          <p className="text-sm opacity-80">{title}</p>
          {subtitle && <p className="text-xs opacity-60 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
