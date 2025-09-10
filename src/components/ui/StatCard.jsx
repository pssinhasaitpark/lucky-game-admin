import React from "react";
import { TrendingUp, Info } from "lucide-react";

const StatCard = ({
  title,
  value,
  icon: Icon = Info, // Fallback icon
  trend,
  isPrimary,
  onClick,
  subtitle,
}) => {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl focus:outline-none ${
        isPrimary
          ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white"
          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 shadow-md"
      }`}
    >
      {/* Shimmer animation */}
      {isPrimary && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      )}

      <div className="relative z-10 flex justify-between items-start">
        <div className="flex-1">
          {/* Icon and Trend */}
          <div className="flex items-center space-x-2 mb-2">
            <div
              className={`p-2 rounded-xl ${
                isPrimary
                  ? "bg-white/20"
                  : "bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-800 dark:to-blue-800"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isPrimary
                    ? "text-white"
                    : "text-indigo-500 dark:text-indigo-300"
                }`}
                aria-hidden="true"
              />
            </div>

            {trend && (
              <div className="flex items-center space-x-1">
                <TrendingUp
                  className={`w-3 h-3 ${
                    isPrimary
                      ? "text-emerald-200"
                      : "text-emerald-500 dark:text-emerald-400"
                  }`}
                  aria-hidden="true"
                />
                <span
                  className={`text-xs font-semibold ${
                    isPrimary
                      ? "text-emerald-200"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  +{trend}%
                </span>
              </div>
            )}
          </div>

          {/* Value */}
          <h3 className="text-3xl font-bold mb-1">{value}</h3>

          {/* Title */}
          <p
            className={`text-sm ${
              isPrimary ? "text-white/80" : "text-gray-600 dark:text-gray-300"
            }`}
          >
            {title}
          </p>

          {/* Subtitle */}
          {subtitle && (
            <p
              className={`text-xs mt-1 ${
                isPrimary ? "text-white/60" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
