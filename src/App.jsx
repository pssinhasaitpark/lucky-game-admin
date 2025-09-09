import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import {
  BarChart3,
  Users as UsersIcon,
  Trophy,
  DollarSign,
  Settings as SettingsIcon,
  Gamepad2,
} from "lucide-react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import Dashboard from "./components/pages/Dashboard.jsx";
import Games from "./components/pages/Games.jsx";
import Users from "./components/pages/Users.jsx";
import Winners from "./components/pages/Winners.jsx";
import Revenue from "./components/pages/Revenue.jsx";
import Settings from "./components/pages/Settings.jsx";
import UserDetail from "./components/pages/UserDetail.jsx";
import { loginAdmin, fetchApprovedUsers } from "./redux/slice/userSlice.js";
import { setActiveTab } from "./redux/slice/dashboardSlice.js";

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
  const location = useLocation();

  // Dashboard state
  const {
    activeTab,
    sidebarOpen,
    notifications,
    stats,
    recentGames,
    users,
    winners,
  } = useSelector((state) => state.dashboard);

  // User state (token, approvedUsers, loading)
  const { token, loading, approvedUsers } = useSelector((state) => state.user);

  // Auto-login & fetch approved users on mount
  useEffect(() => {
    dispatch(loginAdmin()).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(fetchApprovedUsers());
      }
    });
  }, [dispatch]);

  // Set active tab based on route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      dispatch(setActiveTab("dashboard"));
    } else if (path.startsWith("/users")) {
      dispatch(setActiveTab("users"));
    } else if (path.startsWith("/games")) {
      dispatch(setActiveTab("games"));
    } else if (path.startsWith("/winners")) {
      dispatch(setActiveTab("winners"));
    } else if (path.startsWith("/revenue")) {
      dispatch(setActiveTab("revenue"));
    } else if (path.startsWith("/settings")) {
      dispatch(setActiveTab("settings"));
    }
  }, [location.pathname, dispatch]);

  // Determine if the current route is the Dashboard
  const isDashboardRoute = location.pathname === "/";

  // Render component based on active tab
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
        noScroll={isDashboardRoute} // Pass noScroll prop conditionally
      >
        <Routes>
          <Route path="/" element={renderPageContent()} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:userId" element={<UserDetail />} />
          <Route path="/games" element={<Games />} />
          <Route path="/winners" element={<Winners />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </DashboardLayout>
      <ToastContainer />
    </div>
  );
}

export default App;
