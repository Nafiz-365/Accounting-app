import React, { useState } from "react";
import {
  PieChart,
  Building2,
  FileText,
  BookOpen,
  DollarSign,
  Calculator,
  TrendingUp,
  BarChart3,
  Activity,
  Eye,
  EyeOff,
} from "lucide-react";
import { StatCard, NetIncomeTrendChart } from "../utils/Utils";
import { useCurrency } from "../contexts/CurrencyContext";

const Dashboard = ({
  getTotalAssets,
  getTotalLiabilities,
  getTotalEquity,
  incomeStatement,
  journalEntries,
  accounts,
  t,
}) => {
  const { formatAmount, formatNumber } = useCurrency();
  const [showDetailedChart, setShowDetailedChart] = useState(true);
  const [highlightProfitability, setHighlightProfitability] = useState(true);
  const totalAssets = getTotalAssets();
  const totalLiabilities = getTotalLiabilities();
  const totalEquity = getTotalEquity();
  const netIncome = incomeStatement.netIncome;

  // Enhanced theme for light mode
  const enhancedTheme = {
    ...t,
    light: {
      bg: "bg-gradient-to-br from-blue-50/50 via-white/30 to-cyan-50/50",
      text: "text-gray-900",
      cardBg: "bg-white/70 backdrop-blur-xl border border-gray-200/60",
      border: "border-gray-200/60",
      icon: "text-blue-700",
      statCard: {
        bg: "bg-white/80 backdrop-blur-lg border-gray-200/60",
        text: "text-gray-900",
        value: "text-black",
        icon: "text-blue-700",
      },
    },
  };

  return (
    <div className="space-y-3 animate-slide-in">
      <div
        className={`p-4 rounded-3xl ${t.glassPanel} ${t.shadow} ${t.border} flex justify-center items-center backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group relative overflow-hidden`}
      >
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-400 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"></div>
        </div>

        {/* Icon */}
        <div
          className={`absolute left-8 p-3 rounded-2xl ${t.glass} group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}
        >
          <BarChart3
            size={24}
            className="text-cyan-400 group-hover:text-blue-400 transition-colors duration-300"
          />
        </div>

        {/* Main Title */}
        <div className="relative z-10 text-center">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
            <h2
              className={`text-3xl font-black tracking-widest bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:via-purple-400 group-hover:to-pink-400 transition-all duration-500`}
            >
              OVERVIEW
            </h2>
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse"></div>
          </div>
          <p
            className={`text-sm ${t.text} opacity-70 group-hover:opacity-100 transition-opacity duration-300`}
          >
            Real-time financial performance dashboard
          </p>
        </div>

        {/* Right Icon */}
        <div
          className={`absolute right-8 p-3 rounded-2xl ${t.glass} group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500`}
        >
          <TrendingUp
            size={24}
            className="text-purple-400 group-hover:text-pink-400 transition-colors duration-300"
          />
        </div>

        {/* Floating Particles */}
        <div className="absolute top-4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
        <div className="absolute top-8 right-1/4 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping animation-delay-200"></div>
        <div className="absolute bottom-4 left-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping animation-delay-400"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <StatCard
          title="Total Assets"
          value={totalAssets}
          icon={Building2}
          color="text-cyan-400"
          t={enhancedTheme}
        />
        <StatCard
          title="Total Liabilities"
          value={totalLiabilities}
          icon={Calculator}
          color="text-yellow-400"
          t={enhancedTheme}
        />
        <StatCard
          title="Total Equity"
          value={totalEquity}
          icon={PieChart}
          color="text-pink-400"
          t={enhancedTheme}
        />
        <StatCard
          title="Net Income"
          value={netIncome}
          icon={DollarSign}
          color="text-lime-400"
          isIncome={true}
          t={enhancedTheme}
        />
      </div>
      {/* Enhanced Net Income Trend Section */}
      <div
        className={`p-3 rounded-2xl ${t.cardBg} ${t.shadow} ${t.border} backdrop-blur-xl transition-all duration-300 hover:shadow-2xl group`}
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${t.glass} group-hover:scale-110 transition-transform duration-300`}
            >
              <TrendingUp size={20} className={t.secondaryAccent} />
            </div>
            <div>
              <h3
                className={`text-xl font-bold ${t.secondaryAccent} bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent`}
              >
                FINANCIAL PERFORMANCE ANALYTICS
              </h3>
              <p className={`text-sm ${t.text} opacity-70 mt-1`}>
                Advanced profitability tracking and trend analysis across all
                transactions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center text-sm font-medium text-gray-400 glass-card-dark px-3 py-1 rounded-lg">
              <Calculator
                size={14}
                className="text-cyan-400 mr-1.5 animate-pulse"
              />
              Last updated: {new Date().toLocaleTimeString()}
            </div>
            <button
              onClick={() => setHighlightProfitability(!highlightProfitability)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                highlightProfitability
                  ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30"
                  : "bg-gray-800/50 text-gray-400 border border-gray-700/50"
              } backdrop-blur-sm hover:scale-105`}
            >
              <Activity size={12} className="inline mr-1" />
              {highlightProfitability ? "Highlight" : "Normal"}
            </button>
            <button
              onClick={() => setShowDetailedChart(!showDetailedChart)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                showDetailedChart
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "bg-gray-800/50 text-gray-400 border border-gray-700/50"
              } backdrop-blur-sm hover:scale-105`}
            >
              {showDetailedChart ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
          <div
            className={`p-3 rounded-lg ${t.glass} backdrop-blur-sm border border-white/10`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${t.text} opacity-70`}>
                Total Entries
              </span>
              <FileText size={14} className={t.accent} />
            </div>
            <p className={`text-lg font-bold mt-1 ${t.text}`}>
              {formatNumber(journalEntries.length)}
            </p>
          </div>
          <div
            className={`p-3 rounded-lg ${t.glass} backdrop-blur-sm border border-white/10`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${t.text} opacity-70`}>
                Current Net Income
              </span>
              <DollarSign
                size={14}
                className={netIncome >= 0 ? "text-green-400" : "text-red-400"}
              />
            </div>
            <p
              className={`text-lg font-bold mt-1 ${
                netIncome >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {formatAmount(netIncome)}
            </p>
          </div>
          <div
            className={`p-3 rounded-lg ${t.glass} backdrop-blur-sm border border-white/10`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${t.text} opacity-70`}>
                Trend Status
              </span>
              <BarChart3
                size={14}
                className={
                  journalEntries.length > 1 ? "text-cyan-400" : "text-gray-400"
                }
              />
            </div>
            <p
              className={`text-lg font-bold mt-1 ${
                journalEntries.length > 1 ? "text-cyan-400" : "text-gray-400"
              }`}
            >
              {journalEntries.length > 1 ? "Active" : "No Data"}
            </p>
          </div>
        </div>

        {showDetailedChart && (
          <div className="relative">
            <NetIncomeTrendChart
              entries={journalEntries}
              accounts={accounts}
              highlightProfitability={highlightProfitability}
              t={t}
            />
          </div>
        )}

        {!showDetailedChart && (
          <div className={`text-center py-4 ${t.text} opacity-70`}>
            <EyeOff size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              Chart is hidden. Click the eye icon to show the trend analysis.
            </p>
          </div>
        )}
      </div>
      <div
        className={`p-3 rounded-xl ${t.cardBg} ${t.shadow} ${t.border} backdrop-blur-xl transition-all duration-300 hover:shadow-2xl group`}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${t.glass} group-hover:scale-110 transition-transform duration-300`}
            >
              <Calculator size={20} className={t.secondaryAccent} />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${t.secondaryAccent}`}>
                ACCOUNTING EQUATION BALANCE
              </h3>
              <p className={`text-xs ${t.text} opacity-70 mt-1`}>
                Fundamental accounting equation verification
              </p>
            </div>
          </div>
          <div
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
              Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01
                ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30"
                : "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30"
            } backdrop-blur-sm`}
          >
            {Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01
              ? "✓ Balanced"
              : "⚠ Imbalance"}
          </div>
        </div>

        <div
          className={`p-2 rounded-lg ${t.glass} backdrop-blur-sm border border-white/10`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="text-center">
              <div className={`text-sm font-medium ${t.text} opacity-70 mb-1`}>
                Assets
              </div>
              <div className={`text-2xl font-bold ${t.accent} font-mono`}>
                {formatAmount(totalAssets)}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div
                className={`text-3xl font-bold ${
                  Math.abs(totalAssets - (totalLiabilities + totalEquity)) <
                  0.01
                    ? "text-green-400"
                    : "text-red-500"
                }`}
              >
                =
              </div>
            </div>
            <div className="text-center">
              <div className={`text-sm font-medium ${t.text} opacity-70 mb-1`}>
                Liabilities + Equity
              </div>
              <div className={`text-2xl font-bold ${t.accent} font-mono`}>
                {formatAmount(totalLiabilities + totalEquity)}
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className={`text-xs ${t.text} opacity-70`}>Variance</span>
              <span
                className={`text-sm font-bold ${
                  Math.abs(totalAssets - (totalLiabilities + totalEquity)) <
                  0.01
                    ? "text-green-400"
                    : "text-red-500"
                } font-mono`}
              >
                {formatAmount(
                  Math.abs(totalAssets - (totalLiabilities + totalEquity))
                )}
              </span>
            </div>
            <div className="mt-2">
              <div
                className={`h-2 rounded-full overflow-hidden ${
                  Math.abs(totalAssets - (totalLiabilities + totalEquity)) <
                  0.01
                    ? "bg-green-500/20"
                    : "bg-red-500/20"
                }`}
              >
                <div
                  className={`h-full transition-all duration-500 ${
                    Math.abs(totalAssets - (totalLiabilities + totalEquity)) <
                    0.01
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      (Math.abs(
                        totalAssets - (totalLiabilities + totalEquity)
                      ) /
                        Math.max(totalAssets, 1)) *
                        100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
