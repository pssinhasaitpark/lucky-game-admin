import React from "react";

const StatCard = ({ title, value, icon: Icon, trend, isPrimary }) => {
  return (
    <div
      className={`flex justify-between items-center p-6 rounded-xl shadow-sm transition-all duration-300 ${
        isPrimary ? "bg-[#FD7F2C] text-white" : "bg-[#2b2b2b] text-white"
      }`}
    >
      {/* Left section */}
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm opacity-80 mt-1">{title}</p>
      </div>

      {/* Right section */}
      <div className="flex flex-col items-end">
        <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center mb-2">
          <Icon
            className={`w-5 h-5 ${
              isPrimary ? "text-[#FD7F2C]" : "text-[#2b2b2b]"
            }`}
          />
        </div>
        {trend && <span className="text-sm font-semibold">+{trend}%</span>}
      </div>
    </div>
  );
};

export default StatCard;
