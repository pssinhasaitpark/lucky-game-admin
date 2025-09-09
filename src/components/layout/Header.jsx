// src/components/layout/Header.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Search, Bell } from "lucide-react";
import { toggleSidebar } from "../../redux/slice/dashboardSlice.js";
import { fetchUserProfile } from "../../redux/slice/profileSlice.js"; // ✅ Import thunk

const Header = ({ state, dispatch: dashboardDispatch }) => {
  const dispatch = useDispatch(); // For redux actions
  const [showProfile, setShowProfile] = useState(false); // Profile toggle
  const { userProfile, loading } = useSelector((state) => state.profile); // ✅ Get profile from redux

  const handleProfileClick = () => {
    dispatch(fetchUserProfile());
    setShowProfile((prev) => !prev); // Toggle dropdown
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b px-6 py-3 sticky top-0 z-30 shadow-sm ">
      <div className="flex items-center justify-between">
        {/* === Left Side === */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => dashboardDispatch(toggleSidebar())}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-yellow-100 transition-colors duration-200"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-black bg-clip-text capitalize">
              {state.activeTab}
            </h2>
            <p className="text-gray-600">Welcome back, Admin</p>
          </div>
        </div>

        {/* === Right Side === */}
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-red-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
            />
          </div>

          <button className="relative p-2 text-gray-600 hover:bg-yellow-100 rounded-xl transition-all duration-200">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
              {state.notifications}
            </span>
          </button>

          {/* ✅ Avatar Button */}
          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="w-10 h-10 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500  rounded-full flex items-center justify-center shadow-lg"
            >
              <span className="text-white font-bold">
                {userProfile?.name?.[0] || "A"}
              </span>
            </button>

            {/* ✅ Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-xl border border-red-200 p-4 z-50">
                {loading ? (
                  <p className="text-sm text-gray-500">Loading profile...</p>
                ) : userProfile ? (
                  <>
                    <p className="text-lg font-semibold">{userProfile.name}</p>
                    <p className="text-sm text-gray-600">{userProfile.email}</p>
                    <p className="text-sm text-gray-600">
                      Mobile: {userProfile.mobile}
                    </p>
                    <p className="text-sm text-gray-600">
                      Role: {userProfile.role}
                    </p>
                    {/* <p className="text-sm text-gray-600">
                      Wallet: ₹{userProfile.wallet}
                    </p> */}
                  </>
                ) : (
                  <p className="text-sm text-gray-500">No profile data</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
