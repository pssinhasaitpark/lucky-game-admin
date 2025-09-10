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
  Timer,
  Zap,
  Settings,
  CheckCircle,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import {
  setWinningNumber,
  setActiveTab,
} from "../../redux/slice/dashboardSlice.js";
import { fetchApprovedUsers } from "../../redux/slice/userSlice.js";
import { fetchServerTime } from "../../redux/slice/getTimeSlice.js";
import { fetchLatestWinners } from "../../redux/slice/latestWinnerSlice.js";

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
  const { winners, loading: winnersLoading } = useSelector(
    (state) => state.latestWinners
  );
  const [round, setRound] = useState(() => {
    const savedRound = localStorage.getItem("gameRound");
    return savedRound ? parseInt(savedRound) : 1;
  });
  const [mode, setMode] = useState("auto");
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [serverTimeOffset, setServerTimeOffset] = useState(0);
  const [serverSecond, setServerSecond] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const winnersPerPage = 5;
  const intervalRef = useRef(null);

  // Save round to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("gameRound", round.toString());
  }, [round]);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchApprovedUsers());
    dispatch(fetchServerTime());
    dispatch(fetchLatestWinners());
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

  // Handler functions
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
  // const handleResetRound = () => {
  //   setRound(1);
  // };
  const getTimerColor = () => {
    if (serverSecond >= 50) return "text-red-400";
    if (serverSecond >= 30) return "text-orange-400";
    return "text-emerald-400";
  };
  const canSubmit = mode === "manual" || serverSecond >= 50;

  // Pagination logic
  const totalPages = Math.ceil(winners.length / winnersPerPage);
  const paginatedWinners = winners.slice(
    (currentPage - 1) * winnersPerPage,
    currentPage * winnersPerPage
  );

  if (!stats || !recentGames || usersLoading || timeLoading || winnersLoading)
    return <Loader />;

  return (
    <div className="p-4 pb-0 bg-gray-50 dark:bg-gray-900">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Users"
          value={approvedUsers.length.toLocaleString()}
          icon={Users}
          trend={10}
          onClick={() => dispatch(setActiveTab("users"))}
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

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Left Column: Game Control Panel (Fixed Height) */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-300 dark:border-gray-700 p-6 h-[600px]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <div className="flex items-center space-x-3 mb-3 sm:mb-0">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-3 rounded-xl shadow-md">
                <Timer className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">
                  Game Control
                </h2>
                <div className="flex items-center space-x-2 mt-0.5 text-gray-500 dark:text-gray-400 text-sm">
                  <p>
                    {/* Round #{round} •{" "} */}
                    <span className="capitalize">{mode} Mode</span>
                  </p>
                  {/* <button
                    onClick={handleResetRound}
                    className="p-1 text-gray-400 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition"
                    title="Reset Round"
                    aria-label="Reset Round"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button> */}
                </div>
              </div>
            </div>
            {latestWinningNumber && (
              <div className="text-center sm:text-right">
                <p className="text-gray-600 dark:text-gray-400 text-xs mb-1 font-semibold uppercase tracking-wide">
                  Latest Winning Number
                </p>
                <div className="inline-block bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-2 rounded-xl shadow-md">
                  <span className="text-white text-xl font-bold font-mono">
                    {latestWinningNumber}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Timer */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-28 h-28 mb-2">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="5"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#timerGradient)"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={251}
                  strokeDashoffset={251 - (251 * serverSecond) / 60}
                  className="transition-all duration-700 ease-linear"
                />
                <defs>
                  <linearGradient
                    id="timerGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={`text-3xl font-mono font-extrabold ${getTimerColor()}`}
                >
                  {serverSecond.toString().padStart(2, "0")}
                </span>
              </div>
            </div>
            <span className="inline-flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 font-medium">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              <span>Running</span>
            </span>
          </div>

          {/* Mode Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl border border-gray-300 dark:border-gray-600 flex overflow-hidden">
              <button
                onClick={handleToggleMode}
                className={`flex items-center gap-2 px-6 py-2 text-sm font-semibold transition ${
                  mode === "auto"
                    ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
                aria-pressed={mode === "auto"}
              >
                <Zap className="w-5 h-5" />
                Auto
              </button>
              <button
                onClick={handleToggleMode}
                className={`flex items-center gap-2 px-6 py-2 text-sm font-semibold transition ${
                  mode === "manual"
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
                aria-pressed={mode === "manual"}
              >
                <Settings className="w-5 h-5" />
                Manual
              </button>
            </div>
          </div>

          {/* Number Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">
              Select Winning Number
            </h3>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-w-md mx-auto">
              {[...Array(10).keys()].map((num) => {
                const isSelected = selectedNumber === num;
                const isDisabled =
                  (mode === "auto" && serverSecond < 50) ||
                  (mode === "auto" &&
                    selectedNumber !== null &&
                    selectedNumber !== num);
                return (
                  <button
                    key={num}
                    onClick={() => handleSelectNumber(num)}
                    disabled={isDisabled}
                    className={`h-12 rounded-xl text-sm font-semibold flex items-center justify-center transition ${
                      isSelected
                        ? mode === "manual"
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
                          : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-default"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    } ${
                      isDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    aria-pressed={isSelected}
                    aria-label={`Select number ${num}`}
                  >
                    {num}
                    {isSelected && mode === "manual" && (
                      <CheckCircle className="w-4 h-4 ml-1 text-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Manual Submit */}
          <div className="flex justify-center mb-5">
            <button
              onClick={handleManualSubmit}
              disabled={!canSubmit || selectedNumber === null}
              className={`px-8 py-2 rounded-xl text-sm font-semibold transition ${
                !canSubmit || selectedNumber === null
                  ? "bg-gray-300 dark:bg-gray-600 text-gray-400 dark:text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-blue-600 text-white hover:from-emerald-600 hover:to-blue-700"
              }`}
              aria-disabled={!canSubmit || selectedNumber === null}
            >
              Submit Winning Number
            </button>
          </div>

          {/* Status Messages */}
          <div className="flex justify-center mb-4 min-h-[24px]">
            {setWinningNumberStatus === "loading" && (
              <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium space-x-2">
                <div className="w-3 h-3 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </div>
            )}
            {setWinningNumberStatus === "failed" && (
              <div className="flex items-center text-red-600 dark:text-red-400 text-sm font-medium space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>
                  {setWinningNumberError || "Failed to set winning number"}
                </span>
              </div>
            )}
            {setWinningNumberStatus === "succeeded" && (
              <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm font-semibold space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Winning number set!</span>
              </div>
            )}
            {!canSubmit && mode === "manual" && serverSecond < 50 && (
              <div className="flex items-center text-yellow-600 dark:text-yellow-400 text-sm font-medium space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>
                  You can only set the winning number in the last 10 seconds
                </span>
              </div>
            )}
          </div>

          {/* Mode Info */}
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-center text-gray-600 dark:text-gray-300 text-sm font-medium select-none">
            {mode === "auto" ? (
              <p>
                🤖 <strong>Auto Mode</strong>: Number submits automatically in
                the last 10 seconds.
              </p>
            ) : (
              <p>
                🎯 <strong>Manual Mode</strong>: Click "Submit" to set the
                winning number in the last 10 seconds.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Latest Winners (Fixed Height + Scrollable + Pagination) */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-300 dark:border-gray-700 p-6 h-[600px] flex flex-col">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
            Latest Winners
          </h2>
          <div className="flex-1 overflow-y-auto space-y-5">
            {paginatedWinners.map((winner) => (
              <div
                key={winner._id}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    Game ID: {winner.gameId}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(winner.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-2 rounded-xl text-white font-bold">
                  {winner.winningNumber}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4 space-x-4">
            <button
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition disabled:opacity-50"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Recent Games */}
      <div className="bg-white/10 dark:bg-gray-800/30 rounded-2xl p-2 overflow-hidden mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-black dark:text-white">
            Recent Games
          </h3>
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
