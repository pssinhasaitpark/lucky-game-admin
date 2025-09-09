import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import StatCard from "../ui/StatCard";
import GameCard from "../ui/GameCard";
import Loader from "../ui/Loader.jsx";
import {
  Users,
  Gamepad2,
  DollarSign,
  Trophy,
  Plus,
  Filter,
  Timer,
  Zap,
  Settings,
  CheckCircle,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { setWinningNumber } from "../../redux/slice/dashboardSlice.js";
import { fetchApprovedUsers } from "../../redux/slice/userSlice.js";
import { setActiveTab } from "../../redux/slice/dashboardSlice.js";
import { fetchServerTime } from "../../redux/slice/getTimeSlice.js";

const Dashboard = () => {
  const dispatch = useDispatch();
  const stats = useSelector((state) => state.dashboard?.stats);
  const recentGames = useSelector((state) => state.dashboard?.recentGames);
  const setWinningNumberStatus = useSelector(
    (state) => state.dashboard.setWinningNumberStatus
  );
  const setWinningNumberError = useSelector(
    (state) => state.dashboard.setWinningNumberError
  );
  const latestWinningNumber = useSelector(
    (state) => state.dashboard.latestWinningNumber
  );
  const { approvedUsers, loading: usersLoading } = useSelector(
    (state) => state.user
  );
  const { currentTime: serverTime, loading: timeLoading } = useSelector(
    (state) => state.serverTime
  );
  const [round, setRound] = useState(() => {
    const savedRound = localStorage.getItem("gameRound");
    return savedRound ? parseInt(savedRound) : 1;
  });
  const [mode, setMode] = useState("auto");
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [serverTimeOffset, setServerTimeOffset] = useState(0);
  const [serverSecond, setServerSecond] = useState(0);
  const intervalRef = useRef(null);

  // Save round to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("gameRound", round.toString());
  }, [round]);

  // Fetch approved users and server time on component mount
  useEffect(() => {
    dispatch(fetchApprovedUsers());
    dispatch(fetchServerTime());
  }, [dispatch]);

  // Calculate server time offset
  useEffect(() => {
    if (serverTime) {
      const localTime = new Date();
      const serverDate = new Date(serverTime);
      const offset = serverDate.getTime() - localTime.getTime();
      setServerTimeOffset(offset);
    }
  }, [serverTime]);

  // Get current server second
  const getServerSecond = () => {
    const localNow = new Date();
    const serverNow = new Date(localNow.getTime() + serverTimeOffset);
    return serverNow.getSeconds();
  };

  // Timer Logic: Increment round every real minute (server time)
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const currentServerSecond = getServerSecond();
      setServerSecond(currentServerSecond);
      if (currentServerSecond === 0) {
        if (mode === "auto" && selectedNumber !== null) {
          dispatch(setWinningNumber(selectedNumber));
        }
        setRound((r) => r + 1);
      }
    }, 200);
    return () => clearInterval(intervalRef.current);
  }, [mode, selectedNumber, dispatch, serverTimeOffset]);

  if (!stats || !recentGames || usersLoading || timeLoading) return <Loader />;

  const handleToggleMode = () => {
    setMode((prev) => (prev === "auto" ? "manual" : "auto"));
    setSelectedNumber(null);
  };

  const handleSelectNumber = (num) => {
    if (serverSecond >= 50 || mode === "manual") {
      setSelectedNumber(num);
    }
  };

  const handleManualSubmit = () => {
    if (mode === "manual" && selectedNumber !== null) {
      dispatch(setWinningNumber(selectedNumber));
      setRound((r) => r + 1);
    }
  };

  const handleResetRound = () => {
    setRound(1);
  };

  const getTimerColor = () => {
    if (serverSecond >= 50) return "text-red-400";
    if (serverSecond >= 30) return "text-orange-400";
    return "text-emerald-400";
  };

  const handleActiveUsersClick = () => {
    dispatch(setActiveTab("users"));
  };

  const canSubmit = mode === "manual" || serverSecond >= 50;

  return (
    <div className="p-4 pb-0 bg-gray-50 ">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Users"
          value={approvedUsers.length.toLocaleString()}
          icon={Users}
          trend={10}
          // isPrimary={true}
          onClick={handleActiveUsersClick}
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

      {/* Game Control Panel */}
      <div className="pt-2">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-lg border border-slate-700 p-4 ">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-2">
            <div className="flex items-center space-x-2 mb-1 sm:mb-0">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                <Timer className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Game Control</h2>
                <div className="flex items-center space-x-1">
                  <p className="text-slate-300 text-xs">
                    Round #{round} •{" "}
                    {mode === "auto" ? "Auto Mode" : "Manual Mode"}
                  </p>
                  <button
                    onClick={handleResetRound}
                    className="p-0.5 text-slate-400 hover:text-white transition"
                    title="Reset Round"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
            {latestWinningNumber && (
              <div className="text-center sm:text-right">
                <p className="text-slate-400 text-xs mb-0.5">
                  Latest Winning Number
                </p>
                <div className="bg-gradient-to-r from-emerald-500 to-blue-500 px-3 py-1.5 rounded-lg inline-block">
                  <span className="text-lg font-bold text-white">
                    {latestWinningNumber}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Timer */}
          <div className="flex flex-col items-center mb-3">
            <div className="relative w-24 h-24 mb-1.5">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-gray-700"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={251}
                  strokeDashoffset={251 - (251 * serverSecond) / 60}
                  className="transition-all duration-1000 ease-linear"
                />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div
                  className={`text-xl font-mono font-bold ${getTimerColor()}`}
                >
                  {serverSecond.toString().padStart(2, "0")}
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-400">
              <span className="flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse mr-1"></div>
                Running
              </span>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex justify-center mb-4">
            <div className="bg-slate-800 p-0.5 rounded-lg border border-slate-600 flex">
              <button
                onClick={handleToggleMode}
                className={`flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  mode === "auto"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Zap className="w-3.5 h-3.5 mr-1" />
                Auto
              </button>
              <button
                onClick={handleToggleMode}
                className={`flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  mode === "manual"
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Settings className="w-3.5 h-3.5 mr-1" />
                Manual
              </button>
            </div>
          </div>

          {/* Number Selection */}
          <div className="mb-4">
            <h3 className="text-base font-semibold text-white mb-2 text-center">
              Select Winning Number
            </h3>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 max-w-md mx-auto">
              {[...Array(10).keys()].map((num) => (
                <button
                  key={num}
                  onClick={() => handleSelectNumber(num)}
                  disabled={
                    (mode === "auto" && serverSecond < 50) ||
                    (mode === "auto" &&
                      selectedNumber !== null &&
                      selectedNumber !== num)
                  }
                  className={`h-10 rounded-lg text-sm font-medium flex items-center justify-center transition-all ${
                    selectedNumber === num
                      ? mode === "manual"
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md"
                        : "bg-slate-700 text-slate-300"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  } ${
                    (mode === "auto" && serverSecond < 50) ||
                    (mode === "auto" &&
                      selectedNumber !== null &&
                      selectedNumber !== num)
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-slate-600 cursor-pointer"
                  }`}
                >
                  {num}
                  {selectedNumber === num && mode === "manual" && (
                    <CheckCircle className="w-3.5 h-3.5 ml-0.5 text-emerald-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Manual Submit */}
          <div className="flex justify-center mb-3">
            <button
              onClick={handleManualSubmit}
              disabled={!canSubmit || selectedNumber === null}
              className={`px-5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                !canSubmit || selectedNumber === null
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 to-blue-600 text-white hover:from-emerald-700 hover:to-blue-700"
              }`}
            >
              Submit Winning Number
            </button>
          </div>

          {/* Status Messages */}
          <div className="flex justify-center mb-2">
            {setWinningNumberStatus === "loading" && (
              <div className="flex items-center text-blue-400 text-xs">
                <div className="w-2.5 h-2.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-1.5"></div>
                Submitting...
              </div>
            )}
            {setWinningNumberStatus === "failed" && (
              <div className="flex items-center text-red-400 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                {setWinningNumberError || "Failed to set winning number"}
              </div>
            )}
            {setWinningNumberStatus === "succeeded" && (
              <div className="flex items-center text-emerald-400 text-xs">
                <CheckCircle className="w-3.5 h-3.5 mr-1" />✅ Winning number
                set!
              </div>
            )}
            {!canSubmit && mode === "manual" && serverSecond < 50 && (
              <div className="flex items-center text-yellow-400 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                You can only set the winning number in the last 10 seconds
              </div>
            )}
          </div>

          {/* Mode Info */}
          <div className="p-2 bg-slate-800 rounded-lg text-center text-slate-300 text-xs">
            {mode === "auto" ? (
              <p>
                🤖 Auto Mode: Number submits automatically in the last 10
                seconds.
              </p>
            ) : (
              <p>
                🎯 Manual Mode: Click "Submit" to set the winning number in the
                last 10 seconds.
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Recent Games */}
      <div className="bg-white/10 rounded-2xl p-2 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-black">Recent Games</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-hidden">
          {recentGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
