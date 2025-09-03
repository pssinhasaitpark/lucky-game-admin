import React from "react";
import { Menu, Search, Bell } from "lucide-react";
import { toggleSidebar } from "../../redux/slice/dashboardSlice.js"; // ✅ Import action

const Header = ({ state, dispatch }) => (
  <header className="bg-white/80 backdrop-blur-sm border-b border-yellow-200 px-6 py-3 sticky top-0 z-30 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => dispatch(toggleSidebar())} // ✅ Use action
          className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-yellow-100 transition-colors duration-200"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent capitalize">
            {state.activeTab}
          </h2>
          <p className="text-gray-600">Welcome back, Admin</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
          />
        </div>

        <button className="relative p-2 text-gray-600 hover:bg-yellow-100 rounded-xl transition-all duration-200">
          <Bell className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {state.notifications}
          </span>
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold">A</span>
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
