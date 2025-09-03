import React from "react";
import { useSelector } from "react-redux";
import StatCard from "../ui/StatCard";
import GameCard from "../ui/GameCard";
import {
  Users,
  Gamepad2,
  DollarSign,
  Trophy,
  Plus,
  Filter,
  UserCheck,
  Activity,
  Settings,
} from "lucide-react";

const Dashboard = () => {
  const stats = useSelector((state) => state.dashboard?.stats);
  const recentGames = useSelector((state) => state.dashboard?.recentGames);

  if (!stats || !recentGames) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Users Active"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          trend={55}
          isPrimary={true}
        />
        <StatCard
          title="Click Events"
          value={stats.activeGames}
          icon={Gamepad2}
          trend={124}
        />
        <StatCard
          title="Purchases"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={15}
        />
        <StatCard
          title="Likes"
          value={stats.todayWinners}
          icon={Trophy}
          trend={90}
        />
      </div>

      {/* Recent Games Section */}
      <div className="bg-[#f6f6f6] rounded-2xl shadow-md border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Recent Games</h3>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-[#FD7F2C] text-white rounded-xl hover:bg-[#e05e1f] transition-all duration-200 shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Game
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recentGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Management */}
        {/* <div className="bg-gradient-to-r from-[#FD7F2C] to-[#f85900] p-6 rounded-2xl text-white shadow-md hover:shadow-lg transition-all duration-300">
          <div className="bg-white/10 p-4 rounded-full w-fit mb-4">
            <UserCheck className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-xl font-bold mb-2">User Management</h4>
          <p className="text-yellow-100 text-sm mb-4">
            Manage user accounts and permissions
          </p>
          <button className="bg-white text-[#FD7F2C] px-4 py-2 rounded-lg font-semibold hover:bg-yellow-50 transition-colors duration-200">
            Manage Users
          </button>
        </div> */}

        {/* Analytics */}
        {/* <div className="bg-gradient-to-r from-[#ffb347] to-[#FD7F2C] p-6 rounded-2xl text-white shadow-md hover:shadow-lg transition-all duration-300">
          <div className="bg-white/10 p-4 rounded-full w-fit mb-4">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-xl font-bold mb-2">Analytics</h4>
          <p className="text-yellow-100 text-sm mb-4">
            View detailed game analytics and reports
          </p>
          <button className="bg-white text-[#FD7F2C] px-4 py-2 rounded-lg font-semibold hover:bg-yellow-50 transition-colors duration-200">
            View Analytics
          </button>
        </div> */}

        {/* System Settings */}
        {/* <div className="bg-gradient-to-r from-[#f7b733] to-[#f85931] p-6 rounded-2xl text-white shadow-md hover:shadow-lg transition-all duration-300">
          <div className="bg-white/10 p-4 rounded-full w-fit mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-xl font-bold mb-2">System Settings</h4>
          <p className="text-yellow-100 text-sm mb-4">
            Configure system preferences
          </p>
          <button className="bg-white text-[#f85931] px-4 py-2 rounded-lg font-semibold hover:bg-yellow-50 transition-colors duration-200">
            Open Settings
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
