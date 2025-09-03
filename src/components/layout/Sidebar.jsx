import React from "react";
import { Crown, LogOut } from "lucide-react";
import {
  setActiveTab,
  closeSidebar,
} from "../../redux/slice/dashboardSlice.js";

const Sidebar = ({ state, dispatch, menuItems }) => (
  <div
    className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#f8f9fa] transform ${
      state.sidebarOpen ? "translate-x-0" : "-translate-x-full"
    } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200 shadow-md`}
  >
    {/* Logo Section */}
    <div className="flex items-center justify-center h-20 border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="bg-[#FD7F2C] p-2 rounded-xl shadow-md">
          <Crown className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Lucky Game</h1>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>
      </div>
    </div>

    {/* Navigation */}
    <nav className="mt-6 px-4 space-y-2">
      {menuItems.map((item) => {
        const isActive = state.activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              dispatch(setActiveTab(item.id));
              dispatch(closeSidebar());
            }}
            className={`flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-[#FD7F2C] text-white shadow-md"
                  : "text-gray-700 bg-white hover:bg-gray-100 shadow-sm"
              }
            `}
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-lg mr-3 
                ${isActive ? "bg-white bg-opacity-20" : "bg-gray-100"}
              `}
            >
              <item.icon
                className={`w-5 h-5 ${
                  isActive ? "text-white" : "text-gray-700"
                }`}
              />
            </div>
            {item.name}
          </button>
        );
      })}
    </nav>

    {/* Bottom Section */}
    <div className="absolute bottom-4 left-4 right-4">
      <button className="flex items-center w-full px-4 py-3 rounded-xl text-gray-600 bg-white hover:bg-gray-100 shadow-sm transition-all duration-200">
        <LogOut className="w-5 h-5 mr-3" />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  </div>
);

export default Sidebar;
