import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  BarChart3,
  Users as UsersIcon,
  Trophy,
  DollarSign,
  Settings as SettingsIcon,
  Gamepad2,
} from "lucide-react";

import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import Dashboard from "./components/pages/Dashboard.jsx";
import Games from "./components/pages/Games.jsx";
import Users from "./components/pages/Users.jsx";
import Winners from "./components/pages/Winners.jsx";
import Revenue from "./components/pages/Revenue.jsx";
import Settings from "./components/pages/Settings.jsx";

import { loginAdmin, fetchApprovedUsers } from "./redux/slice/userSlice.js";

// Sidebar menu items
const menuItems = [
  { id: "dashboard", name: "Dashboard", icon: BarChart3 },
  { id: "users", name: "Users", icon: UsersIcon },
  { id: "games", name: "Games", icon: Gamepad2 },
  { id: "winners", name: "Winners", icon: Trophy },
  { id: "revenue", name: "Revenue", icon: DollarSign },
  { id: "settings", name: "Settings", icon: SettingsIcon },
];

// Tab-to-component map
const PAGE_MAP = {
  dashboard: Dashboard,
  games: Games,
  users: Users,
  winners: Winners,
  revenue: Revenue,
  settings: Settings,
};

function App() {
  const dispatch = useDispatch();

  // ⏬ Dashboard state
  const {
    activeTab,
    sidebarOpen,
    notifications,
    stats,
    recentGames,
    users,
    winners,
  } = useSelector((state) => state.dashboard);

  // ⏬ User state (token, approvedUsers, loading)
  const { token, loading, approvedUsers } = useSelector((state) => state.user);

  // 🔐 Auto-login & fetch approved users on mount
  useEffect(() => {
    dispatch(loginAdmin()).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(fetchApprovedUsers());
      }
    });
  }, [dispatch]);

  // 📄 Render component based on active tab
  const renderPageContent = () => {
    const PageComponent = PAGE_MAP[activeTab] || Dashboard;
    return <PageComponent />;
  };

  return (
    <div className="App">
      <DashboardLayout
        state={{
          activeTab,
          sidebarOpen,
          notifications,
          stats,
          recentGames,
          users,
          winners,
          approvedUsers,
        }}
        dispatch={dispatch}
        menuItems={menuItems}
      >
        {renderPageContent()}
      </DashboardLayout>
    </div>
  );
}

export default App;
