import React, { useState, useEffect } from "react";
import {
  Building2,
  Calculator,
  TrendingUp,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import UserProfile from "../components/UserProfile";
import UserSettings from "../components/UserSettings";
import CurrencySelector from "../components/CurrencySelector";
import RealTimeClock from "../components/RealTimeClock";
import { useCurrency } from "../contexts/CurrencyContext";

const CompanyHeader = ({ theme, user }) => {
  const { currency, setCurrency } = useCurrency();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        console.log("Loaded saved settings:", settings);

        // Apply saved notification preference
        if (settings.notifications && "Notification" in window) {
          // Check if we already have permission
          if (Notification.permission === "default") {
            Notification.requestPermission();
          }
        }

        // Apply saved auto-save preference
        if (settings.autoSave !== undefined) {
          localStorage.setItem("autoSave", settings.autoSave.toString());
        }
      } catch (error) {
        console.error("Error loading saved settings:", error);
      }
    }
  }, []);
  const themeClasses = {
    dark: {
      bg: "bg-gray-900/30 backdrop-blur-xl border-b border-white/10",
      text: "text-gray-300",
      logo: "text-cyan-400",
      accent: "text-blue-400",
      glass: "bg-gray-800/50",
    },
    light: {
      bg: "bg-white/60 backdrop-blur-xl border-b border-gray-200/60",
      text: "text-gray-900",
      logo: "text-blue-700",
      accent: "text-cyan-700",
      glass: "bg-gray-100/50",
    },
  };

  const t = themeClasses[theme] || themeClasses.dark;

  const handleViewProfile = () => {
    setShowProfileModal(true);
    setIsProfileOpen(false);
  };

  const handleSettings = () => {
    setShowSettingsModal(true);
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    // Close dropdown first
    setIsProfileOpen(false);

    // Show confirmation dialog
    if (confirm("Are you sure you want to logout?")) {
      console.log("Logging out...");

      // Show logout message
      const logoutMessage = document.createElement("div");
      logoutMessage.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
        theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
      }`;
      logoutMessage.textContent = "Logging out...";
      document.body.appendChild(logoutMessage);

      // Simulate logout process
      setTimeout(() => {
        // Remove logout message
        if (document.body.contains(logoutMessage)) {
          document.body.removeChild(logoutMessage);
        }

        // Show success message
        const successMessage = document.createElement("div");
        successMessage.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
          theme === "dark"
            ? "bg-green-600 text-white"
            : "bg-green-500 text-white"
        }`;
        successMessage.textContent = "Logged out successfully!";
        document.body.appendChild(successMessage);

        // Remove success message after delay
        setTimeout(() => {
          if (document.body.contains(successMessage)) {
            document.body.removeChild(successMessage);
          }
        }, 3000);

        console.log("Logged out successfully!");

        // In a real app, redirect to login page or clear auth tokens
        // window.location.href = '/login';
        // localStorage.removeItem('authToken');
        // sessionStorage.clear();
      }, 2000);
    }
  };

  const handleProfileUpdate = (updatedUser) => {
    // Update the current user state
    setCurrentUser(updatedUser);
    console.log("Profile updated:", updatedUser);
    // In a real app, send to backend
  };

  const handleSettingsUpdate = (updatedSettings) => {
    // Apply settings changes
    console.log("Settings updated:", updatedSettings);

    // Store settings in localStorage for persistence
    localStorage.setItem("userSettings", JSON.stringify(updatedSettings));

    // Apply dark mode change if different from current theme
    if (
      updatedSettings.darkMode !== undefined &&
      updatedSettings.darkMode !== (theme === "dark")
    ) {
      // This would need to be passed from parent or handled via global state
      console.log(
        "Theme change requested:",
        updatedSettings.darkMode ? "dark" : "light"
      );
      // For now, we'll store the preference and it can be applied on next load
    }

    // Apply notification settings
    if (updatedSettings.notifications !== undefined) {
      if (updatedSettings.notifications) {
        console.log("Notifications enabled");
        // Request browser notification permission if needed
        if ("Notification" in window && Notification.permission === "default") {
          Notification.requestPermission().then((permission) => {
            console.log("Notification permission:", permission);
          });
        }
      } else {
        console.log("Notifications disabled");
      }
    }

    // Apply auto-save setting
    if (updatedSettings.autoSave !== undefined) {
      console.log(
        "Auto-save",
        updatedSettings.autoSave ? "enabled" : "disabled"
      );
      // Store auto-save preference for other components to use
      localStorage.setItem("autoSave", updatedSettings.autoSave.toString());
    }
  };

  return (
    <div
      className={`w-full p-4 ${t.bg} transition-all duration-300 relative z-50`}
    >
      <div className="flex items-center justify-between max-w-full">
        {/* Left Side - Branding */}
        <div className="flex items-center justify-center flex-1">
          <div className="flex flex-col items-center">
            <h1
              className={`text-3xl font-bold bg-gradient-to-r ${
                theme === "dark"
                  ? "from-cyan-400 via-blue-400 to-purple-400"
                  : "from-blue-500 via-cyan-500 to-teal-500"
              } bg-clip-text text-transparent animate-pulse`}
            >
              FinanceFlow Pro
            </h1>
            <p
              className={`text-base font-semibold ${
                theme === "dark" ? "text-slate-300" : "text-gray-700"
              } flex items-center gap-2`}
            >
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${
                  theme === "dark"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "bg-cyan-100 text-cyan-700 border border-cyan-300"
                }`}
              >
                <Sparkles size={12} />
                Intelligent Financial Management
                <Sparkles size={12} />
              </span>
            </p>
          </div>
        </div>

        {/* Center - Real Time Clock */}
        <div className="flex items-center justify-center">
          <RealTimeClock currency={currency || "USD"} theme={theme} />
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          {/* Currency Selector */}
          <CurrencySelector
            selectedCurrency={currency}
            onCurrencyChange={setCurrency}
            theme={theme}
          />

          {/* Enhanced User Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center gap-3 p-2 rounded-xl ${
                theme === "dark"
                  ? "bg-gray-800/50 hover:bg-gray-700/50"
                  : "bg-gray-200/50 hover:bg-gray-300/50"
              } backdrop-blur-sm border border-current/20 transition-all duration-300 hover:scale-105 group`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                    : "bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/25"
                } border-2 border-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-110`}
              >
                {currentUser?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span
                  className={`font-semibold text-sm ${
                    theme === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  {currentUser?.name || "Guest User"}
                </span>
                <span
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {currentUser?.role || "Administrator"}
                </span>
              </div>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  isProfileOpen ? "rotate-180" : ""
                } ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
              />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div
                className={`absolute right-0 top-full mt-2 w-80 rounded-xl ${
                  theme === "dark"
                    ? "bg-gray-800/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50"
                    : "bg-white/90 backdrop-blur-xl border border-gray-200/60 shadow-2xl shadow-gray-500/20"
                } z-50 overflow-hidden`}
              >
                <div
                  className={`p-6 border-b ${
                    theme === "dark" ? "border-white/10" : "border-gray-200/60"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl ${
                          theme === "dark"
                            ? "bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 text-white shadow-xl shadow-cyan-500/30"
                            : "bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-600 text-white shadow-xl shadow-blue-500/30"
                        } border-3 border-white/20 backdrop-blur-sm`}
                      >
                        {currentUser?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${
                          theme === "dark" ? "bg-green-400" : "bg-green-500"
                        } border-2 border-white shadow-sm`}
                      ></div>
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-bold text-lg ${
                          theme === "dark" ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {currentUser?.name || "Guest User"}
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          theme === "dark" ? "text-cyan-400" : "text-blue-600"
                        }`}
                      >
                        {currentUser?.role || "Administrator"}
                      </p>
                      <p
                        className={`text-xs ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {currentUser?.email ||
                          currentUser?.name
                            ?.toLowerCase()
                            .replace(/\s+/g, ".") + "@company.com"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={handleViewProfile}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      theme === "dark"
                        ? "hover:bg-gray-700/50 text-gray-300"
                        : "hover:bg-gray-100/60 text-gray-700"
                    }`}
                  >
                    <User size={16} />
                    <span className="text-sm font-medium">View Profile</span>
                  </button>
                  <button
                    onClick={handleSettings}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      theme === "dark"
                        ? "hover:bg-gray-700/50 text-gray-300"
                        : "hover:bg-gray-100/60 text-gray-700"
                    }`}
                  >
                    <Settings size={16} />
                    <span className="text-sm font-medium">Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      theme === "dark"
                        ? "hover:bg-red-500/20 text-red-400"
                        : "hover:bg-red-50 text-red-600"
                    }`}
                  >
                    <LogOut size={16} />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showProfileModal && (
        <UserProfile
          user={currentUser}
          theme={theme}
          onClose={() => setShowProfileModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}

      {showSettingsModal && (
        <UserSettings
          user={currentUser}
          theme={theme}
          onClose={() => setShowSettingsModal(false)}
          onUpdate={handleSettingsUpdate}
        />
      )}
    </div>
  );
};

export default CompanyHeader;
