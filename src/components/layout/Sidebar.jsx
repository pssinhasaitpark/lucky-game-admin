import React from "react";
import { Crown, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  setActiveTab,
  closeSidebar,
} from "../../redux/slice/dashboardSlice.js";

const tabToRoute = {
  dashboard: "/",
  users: "/users",
  games: "/games",
  winners: "/winners",
  revenue: "/revenue",
  settings: "/settings",
};

const Sidebar = ({ state, dispatch, menuItems }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-50 dark:bg-gray-800 transform flex flex-col ${
        state.sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen border-r border-gray-200 dark:border-gray-700 shadow-md`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-2 rounded-xl shadow-md">
            <Crown className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Lucky Game
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-4 space-y-2 overflow-y-auto flex-1">
        {menuItems.map((item) => {
          const isActive = state.activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                dispatch(setActiveTab(item.id));
                dispatch(closeSidebar());
                navigate(tabToRoute[item.id] || "/");
              }}
              className={`flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm"
                }
              `}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-lg mr-3
                  ${
                    isActive
                      ? "bg-white bg-opacity-20"
                      : "bg-gray-100 dark:bg-gray-600"
                  }
                `}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    isActive ? "text-white" : "text-gray-700 dark:text-gray-300"
                  }`}
                />
              </div>
              {item.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
