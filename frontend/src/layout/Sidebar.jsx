import React from "react";
import {
  PieChart,
  Building2,
  FileText,
  BookOpen,
  Scale,
  Edit3,
  Receipt,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab, theme, onLogout, toggleTheme }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const navItems = [
    { id: "dashboard", label: "OVERVIEW", icon: PieChart },
    { id: "accounting", label: "CHART OF ACCOUNTS", icon: Building2 },
    { id: "journal", label: "JOURNAL ENTRIES", icon: FileText },
    { id: "ledger", label: "GENERAL LEDGER", icon: BookOpen },
    { id: "trial", label: "TRIAL BALANCE", icon: Scale },
    { id: "income", label: "INCOME STATEMENT", icon: Receipt },
    { id: "balance", label: "BALANCE SHEET", icon: Scale },
    { id: "adjusting", label: "ADJUSTMENTS", icon: Edit3 },
  ];

  const themeClasses = {
    dark: {
      bg: "bg-gray-900/60 backdrop-blur-2xl border-r border-white/10",
      text: "text-gray-300",
      title:
        "bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent",
      active:
        "bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-white font-semibold shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-500/50 backdrop-blur-md border border-white/20",
      hover:
        "hover:bg-gray-800/40 hover:border-white/20 hover:shadow-lg hover:shadow-cyan-500/10",
      icon: "text-cyan-400",
      glass: "bg-gray-800/40 backdrop-blur-lg border border-white/10",
    },
    light: {
      bg: "bg-white/60 backdrop-blur-2xl border-r border-gray-200/60",
      text: "text-gray-900",
      title:
        "bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent",
      active:
        "bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-gray-900 font-semibold shadow-lg shadow-blue-500/25 ring-1 ring-blue-500/50 backdrop-blur-md border border-gray-300/60",
      hover:
        "hover:bg-white/70 hover:border-gray-300/60 hover:shadow-lg hover:shadow-blue-500/10",
      icon: "text-blue-700",
      glass: "bg-gray-100/40 backdrop-blur-lg border border-gray-300/60",
    },
  };

  const t = themeClasses[theme];

  const baseClasses =
    "flex items-center p-3 rounded-xl w-full text-left transition-all duration-300 tracking-wide border backdrop-blur-sm";

  return (
    <nav
      className={`${isCollapsed ? "w-16" : "w-64"} ${
        isCollapsed ? "p-3" : "p-4"
      } space-y-4 flex-shrink-0 ${t.bg} ${
        t.text
      } transition-all duration-700 ease-out md:sticky md:top-0 md:h-screen md:overflow-y-auto md:overflow-x-hidden flex flex-col`}
      style={{
        backgroundImage:
          theme === "dark"
            ? "linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, transparent 100%)"
            : "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%)",
      }}
    >
      {/* Collapse/Expand Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`w-full p-3 rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out backdrop-blur-lg transform hover:scale-105 hover:shadow-xl hover:rotate-12 ${
          theme === "dark"
            ? "bg-gray-800/50 hover:bg-gray-700/60 text-cyan-400 border-cyan-500/30 shadow-cyan-500/20"
            : "bg-gray-200/50 hover:bg-gray-300/60 text-blue-500 border-blue-500/30 shadow-blue-500/20"
        } border`}
      >
        <span
          className={`transition-all duration-500 ease-in-out transform ${
            isCollapsed ? "rotate-0 scale-100" : "rotate-180 scale-110"
          }`}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </span>
      </button>

      <div className="flex-1 space-y-3 overflow-hidden">
        {/* Navigation Items */}
        <div
          className={`space-y-3 transition-all duration-700 ease-out ${
            isCollapsed
              ? "opacity-0 transform -translate-x-4 scale-95"
              : "opacity-100 transform translate-x-0 scale-100"
          }`}
          style={{
            display: isCollapsed ? "none" : "block",
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`${baseClasses} ${
                activeTab === item.id ? t.active : `${t.hover}`
              } transform hover:scale-105 hover:translate-x-1 transition-all duration-300 ease-out`}
            >
              <span
                className={`mr-3 transition-all duration-300 ease-out transform ${
                  activeTab === item.id
                    ? "scale-110 rotate-12"
                    : "hover:scale-110 hover:rotate-6"
                }`}
              >
                <item.icon
                  size={18}
                  className={`transition-all duration-300 ease-out ${
                    activeTab === item.id ? "text-white" : t.icon
                  }`}
                />
              </span>
              <span className="text-sm tracking-wide transition-all duration-300 ease-out font-medium">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        <div
          className={`space-y-3 transition-all duration-700 ease-out ${
            isCollapsed
              ? "opacity-100 transform translate-x-0 scale-100"
              : "opacity-0 transform translate-x-4 scale-95"
          }`}
          style={{
            display: !isCollapsed ? "none" : "block",
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full p-3 rounded-lg flex items-center justify-center transition-all duration-300 ease-out backdrop-blur-sm transform hover:scale-110 hover:rotate-6 ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-cyan-500/40 to-blue-500/40 text-white shadow-lg shadow-cyan-500/30 ring-1 ring-cyan-500/60 border border-white/30"
                  : theme === "dark"
                  ? "hover:bg-gray-800/50 text-cyan-400 border border-transparent hover:border-cyan-500/30"
                  : "hover:bg-white/80 text-blue-500 border border-transparent hover:border-blue-500/30"
              }`}
              title={item.label}
            >
              <span
                className={`transition-all duration-300 ease-out transform ${
                  activeTab === item.id
                    ? "scale-110 rotate-12"
                    : "hover:scale-110 hover:rotate-6"
                }`}
              >
                <item.icon
                  size={16}
                  className={`transition-all duration-300 ease-out`}
                />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Combined Theme Toggle and Logout Button - At Bottom */}
      <div
        className={`${
          isCollapsed ? "pt-4 space-y-4" : "pt-6 space-y-4"
        } border-t border-current/20 transition-all duration-700 ease-out`}
      >
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`w-full p-3 rounded-lg flex items-center justify-center transition-all duration-300 ease-out backdrop-blur-sm transform hover:scale-110 hover:shadow-xl hover:rotate-3 border ${
            theme === "dark"
              ? "bg-gray-800/50 hover:bg-gray-700/60 text-cyan-400 border-cyan-500/30 shadow-cyan-500/20"
              : "bg-gray-200/50 hover:bg-gray-300/60 text-blue-500 border-blue-500/30 shadow-blue-500/20"
          }`}
          title={theme === "dark" ? "Light Mode" : "Dark Mode"}
        >
          <span className="transition-all duration-300 ease-out transform hover:rotate-180">
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </span>
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className={`w-full p-3 rounded-lg flex items-center justify-center transition-all duration-300 ease-out backdrop-blur-sm transform hover:scale-110 hover:shadow-xl hover:rotate-3 border ${
            theme === "dark"
              ? "bg-red-900/20 hover:bg-red-900/30 text-red-400 border-red-500/30 hover:border-red-500/50"
              : "bg-red-100/20 hover:bg-red-200/30 text-red-600 border-red-300/50 hover:border-red-300/70"
          }`}
          title="Logout"
        >
          <span className="transition-all duration-300 ease-out transform hover:rotate-12">
            <LogOut size={14} />
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
