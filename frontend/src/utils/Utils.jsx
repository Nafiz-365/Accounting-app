import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Building,
  FileText,
  BookOpen,
  DollarSign,
  Zap,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Info,
} from "lucide-react";
import { useCurrency } from "../contexts/CurrencyContext";

// --- Enhanced Stat Card for Dashboard ---
export const StatCard = ({
  title,
  value,
  icon = Building,
  color,
  isIncome = false,
  t,
}) => {
  const { formatAmount } = useCurrency();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`p-4 rounded-2xl ${t.statCard?.bg || t.glassCard} ${
        t.shadow
      } ${
        t.border
      } backdrop-blur-xl transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl group relative overflow-hidden cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Animation */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${
            isIncome
              ? value >= 0
                ? "from-green-500/5 via-emerald-500/5 to-transparent"
                : "from-red-500/5 via-pink-500/5 to-transparent"
              : color === "text-cyan-400"
              ? "from-cyan-500/5 via-blue-500/5 to-transparent"
              : color === "text-yellow-400"
              ? "from-yellow-500/5 via-orange-500/5 to-transparent"
              : color === "text-pink-400"
              ? "from-pink-500/5 via-purple-500/5 to-transparent"
              : "from-lime-500/5 via-green-500/5 to-transparent"
          }`}
        ></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute top-2 right-2 w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping animation-delay-200"></div>

      {/* Header */}
      <div className="flex justify-between items-start relative z-10">
        <h3
          className={`text-sm font-black uppercase tracking-wider ${
            t.statCard?.text || "text-gray-300"
          } group-hover:${
            isIncome
              ? value >= 0
                ? "text-emerald-300 drop-shadow-lg"
                : "text-rose-300 drop-shadow-lg"
              : color === "text-cyan-400"
              ? "text-cyan-200 drop-shadow-lg"
              : color === "text-yellow-400"
              ? "text-amber-200 drop-shadow-lg"
              : color === "text-pink-400"
              ? "text-fuchsia-200 drop-shadow-lg"
              : "text-lime-200 drop-shadow-lg"
          } transition-all duration-300`}
        >
          {title}
        </h3>
        <div
          className={`p-2 rounded-xl ${
            t.glass
          } backdrop-blur-sm group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 ${
            isIncome
              ? value >= 0
                ? "ring-2 ring-emerald-400/30 group-hover:ring-emerald-400/50"
                : "ring-2 ring-rose-400/30 group-hover:ring-rose-400/50"
              : color === "text-cyan-400"
              ? "ring-2 ring-cyan-400/30 group-hover:ring-cyan-400/50"
              : color === "text-yellow-400"
              ? "ring-2 ring-amber-400/30 group-hover:ring-amber-400/50"
              : color === "text-pink-400"
              ? "ring-2 ring-fuchsia-400/30 group-hover:ring-fuchsia-400/50"
              : "ring-2 ring-lime-400/30 group-hover:ring-lime-400/50"
          }`}
        >
          {React.createElement(icon, {
            size: 18,
            className: `${color} group-hover:animate-pulse transition-colors duration-300`,
          })}
        </div>
      </div>

      {/* Value */}
      <div className="relative z-10">
        <p
          className={`text-2xl font-black font-mono ${
            isIncome
              ? value >= 0
                ? "text-emerald-300 drop-shadow-2xl"
                : "text-rose-100 drop-shadow-2xl"
              : t.statCard?.value || "text-white"
          } group-hover:scale-105 transition-all duration-300 leading-none`}
        >
          {formatAmount(value)}
        </p>

        {/* Value Status */}
        <div
          className={`mt-3 text-sm font-bold ${
            isIncome
              ? value >= 0
                ? "text-emerald-400 drop-shadow-lg"
                : "text-rose-400 drop-shadow-lg"
              : color.replace("text-", "text-") + " drop-shadow-lg"
          }`}
        >
          {isIncome
            ? value >= 0
              ? "↑ POSITIVE CASH FLOW"
              : "↓ NEGATIVE CASH FLOW"
            : "ACCOUNT BALANCE"}
        </div>

        {/* Additional Info */}
        <div
          className={`mt-1 text-xs font-mono ${
            isIncome
              ? value >= 0
                ? "text-emerald-300/90 font-bold"
                : "text-rose-300/90 font-bold"
              : color === "text-cyan-400"
              ? "text-cyan-300/90 font-bold"
              : color === "text-yellow-400"
              ? "text-amber-300/90 font-bold"
              : color === "text-pink-400"
              ? "text-fuchsia-300/90 font-bold"
              : "text-lime-300/90 font-bold"
          } drop-shadow`}
        >
          {Math.abs(value) >= 1000000
            ? `${(Math.abs(value) / 1000000).toFixed(1)}M`
            : Math.abs(value) >= 1000
            ? `${(Math.abs(value) / 1000).toFixed(1)}K`
            : Math.abs(value) === 0
            ? "0"
            : `${Math.abs(value).toFixed(0)}`}{" "}
          {isIncome ? (value >= 0 ? "Profit" : "Loss") : "Balance"}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative z-10 mt-4">
        <div
          className={`h-2 ${
            isIncome
              ? value >= 0
                ? "bg-emerald-400/20"
                : "bg-rose-400/20"
              : t.statCard?.text
              ? `${t.statCard.text
                  .replace("text-", "bg-")
                  .replace("900", "400")
                  .replace("800", "400")}/20`
              : "bg-gray-400/20"
          } rounded-full overflow-hidden backdrop-blur-sm border border-white/10`}
        >
          <div
            className={`h-full ${
              isIncome
                ? value >= 0
                  ? "bg-gradient-to-r from-emerald-400 to-green-400"
                  : "bg-gradient-to-r from-rose-400 to-pink-400"
                : color === "text-cyan-400"
                ? "bg-gradient-to-r from-cyan-400 to-blue-400"
                : color === "text-yellow-400"
                ? "bg-gradient-to-r from-amber-400 to-yellow-400"
                : color === "text-pink-400"
                ? "bg-gradient-to-r from-fuchsia-400 to-pink-400"
                : "bg-gradient-to-r from-lime-400 to-green-400"
            } rounded-full transition-all duration-1000 ${
              isHovered ? "animate-pulse" : ""
            }`}
            style={{
              width: `${Math.min((Math.abs(value) / 10000) * 100, 100)}%`,
              boxShadow: isHovered ? "0 0 15px currentColor" : "none",
            }}
          ></div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-between mt-2">
          <div className="flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${
                isIncome
                  ? value >= 0
                    ? "bg-emerald-400"
                    : "bg-rose-400"
                  : color === "text-cyan-400"
                  ? "bg-cyan-400"
                  : color === "text-yellow-400"
                  ? "bg-amber-400"
                  : color === "text-pink-400"
                  ? "bg-fuchsia-400"
                  : "bg-lime-400"
              } animate-pulse`}
            ></div>
            <span
              className={`text-xs font-bold ${
                isIncome
                  ? value >= 0
                    ? "text-emerald-200 drop-shadow"
                    : "text-rose-200 drop-shadow"
                  : color === "text-cyan-400"
                  ? "text-cyan-200 drop-shadow"
                  : color === "text-yellow-400"
                  ? "text-amber-200 drop-shadow"
                  : color === "text-pink-400"
                  ? "text-fuchsia-200 drop-shadow"
                  : "text-lime-200 drop-shadow"
              }`}
            >
              {formatAmount(0)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className={`text-xs font-bold ${
                isIncome
                  ? value >= 0
                    ? "text-emerald-200 drop-shadow"
                    : "text-rose-200 drop-shadow"
                  : color === "text-cyan-400"
                  ? "text-cyan-200 drop-shadow"
                  : color === "text-yellow-400"
                  ? "text-amber-200 drop-shadow"
                  : color === "text-pink-400"
                  ? "text-fuchsia-200 drop-shadow"
                  : "text-lime-200 drop-shadow"
              }`}
            >
              {formatAmount(10000)}
            </span>
            <div
              className={`w-2 h-2 rounded-full ${
                isIncome
                  ? value >= 0
                    ? "bg-emerald-400"
                    : "bg-rose-400"
                  : color === "text-cyan-400"
                  ? "bg-cyan-400"
                  : color === "text-yellow-400"
                  ? "bg-amber-400"
                  : color === "text-pink-400"
                  ? "bg-fuchsia-400"
                  : "bg-lime-400"
              } animate-pulse`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Advanced Chart Component ---
export const NetIncomeTrendChart = ({
  entries,
  accounts,
  highlightProfitability = false,
  t,
}) => {
  const { formatAmount, formatNumber } = useCurrency();
  const [hoveredBar, setHoveredBar] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("netIncome");
  const [animationProgress, setAnimationProgress] = useState(0);
  const chartRef = useRef(null);
  const [tooltipPosition, setTooltipPosition] = useState({
    x: 0,
    y: 0,
    visible: false,
    data: null,
  });
  const historicalData = useMemo(() => {
    let runningNetIncome = 0;
    let totalRevenue = 0;
    let totalExpenses = 0;
    const dataPoints = [
      {
        period: "Initial",
        netIncome: 0,
        revenue: 0,
        expenses: 0,
        profitMargin: 0,
      },
    ];
    const balancesAtPoint = {};

    accounts.forEach((acc) => (balancesAtPoint[acc.id] = 0));

    entries.forEach((entry, index) => {
      entry.lines.forEach((line) => {
        const account = accounts.find((a) => a.id === parseInt(line.accountId));
        if (!account) return;

        const debit = parseFloat(line.debit) || 0;
        const credit = parseFloat(line.credit) || 0;

        let change = 0;
        if (account.type === "asset" || account.type === "expense") {
          change = debit - credit;
        } else {
          change = credit - debit;
        }
        balancesAtPoint[account.id] += change;
      });

      totalRevenue = 0;
      totalExpenses = 0;
      accounts.forEach((account) => {
        if (account.type === "revenue") {
          totalRevenue += balancesAtPoint[account.id] || 0;
        } else if (account.type === "expense") {
          totalExpenses += balancesAtPoint[account.id] || 0;
        }
      });
      runningNetIncome = totalRevenue - totalExpenses;

      dataPoints.push({
        period: `E${formatNumber(index + 1)} (${entry.date})`,
        netIncome: runningNetIncome,
        revenue: totalRevenue,
        expenses: totalExpenses,
        profitMargin:
          totalRevenue > 0 ? (runningNetIncome / totalRevenue) * 100 : 0,
        entryDescription:
          entry.description || `Entry ${formatNumber(index + 1)}`,
        entryId: entry.id,
      });
    });

    return dataPoints;
  }, [entries, accounts, formatNumber]);

  // Advanced analytics
  const analytics = useMemo(() => {
    if (historicalData.length <= 1) return null;

    const netIncomeValues = historicalData.map((d) => d.netIncome);
    const revenueValues = historicalData.map((d) => d.revenue);
    const expenseValues = historicalData.map((d) => d.expenses);

    const avgNetIncome =
      netIncomeValues.reduce((a, b) => a + b, 0) / netIncomeValues.length;
    const maxNetIncome = Math.max(...netIncomeValues);
    const minNetIncome = Math.min(...netIncomeValues);

    // Calculate trend
    const firstHalf = netIncomeValues.slice(
      0,
      Math.floor(netIncomeValues.length / 2)
    );
    const secondHalf = netIncomeValues.slice(
      Math.floor(netIncomeValues.length / 2)
    );
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    const trend =
      secondAvg > firstAvg
        ? "upward"
        : secondAvg < firstAvg
        ? "downward"
        : "stable";

    // Volatility (standard deviation)
    const variance =
      netIncomeValues.reduce(
        (sum, val) => sum + Math.pow(val - avgNetIncome, 2),
        0
      ) / netIncomeValues.length;
    const volatility = Math.sqrt(variance);

    return {
      avgNetIncome,
      maxNetIncome,
      minNetIncome,
      trend,
      volatility,
      totalRevenue: revenueValues[revenueValues.length - 1],
      totalExpenses: expenseValues[expenseValues.length - 1],
      profitMargin:
        historicalData[historicalData.length - 1]?.profitMargin || 0,
    };
  }, [historicalData]);

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(1);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e, data, index) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    setTooltipPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      visible: true,
      data: { ...data, index },
    });
  };

  const handleMouseLeave = () => {
    setTooltipPosition((prev) => ({ ...prev, visible: false }));
    setHoveredBar(null);
  };

  if (historicalData.length <= 1) {
    return (
      <div className={`text-center py-10 ${t?.text || "text-slate-400"}`}>
        <BarChart3 size={32} className="mx-auto mb-2" />
        <p>No entries yet. Start posting to see the Net Income trend.</p>
      </div>
    );
  }

  const metricButtons = [
    { key: "netIncome", label: "Net Income", icon: DollarSign },
    { key: "revenue", label: "Revenue", icon: TrendingUp },
    { key: "expenses", label: "Expenses", icon: TrendingDown },
    { key: "profitMargin", label: "Margin %", icon: Activity },
  ];

  const getMetricValue = (data, metric) => {
    switch (metric) {
      case "revenue":
        return data.revenue;
      case "expenses":
        return data.expenses;
      case "profitMargin":
        return data.profitMargin;
      default:
        return data.netIncome;
    }
  };

  const getMetricColor = (value, metric) => {
    if (metric === "expenses")
      return highlightProfitability ? "#EF4444" : "#FB923C";
    if (metric === "profitMargin") return value >= 0 ? "#10B981" : "#EF4444";
    return value >= 0
      ? highlightProfitability
        ? "#10B981"
        : "#4FC3F7"
      : "#EF4444";
  };

  // Dynamic scaling based on selected metric
  const getMetricValues = (metric) => {
    return historicalData.map((d) => getMetricValue(d, metric));
  };

  const values = getMetricValues(selectedMetric);
  const maxVal = Math.max(...values, 0) * 1.1;
  const minVal = Math.min(...values, 0) * 1.1;
  let range = maxVal - minVal;
  if (Math.abs(range) < 1e-9) range = 1;

  const height = 200;
  const width = 600;
  const padding = 30;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  const getX = (index) =>
    padding + (index / (historicalData.length - 1)) * chartWidth;
  const getY = (value) =>
    padding + chartHeight - ((value - minVal) / range) * chartHeight;

  const zeroLineY = getY(0);

  return (
    <div className="overflow-x-auto">
      {/* Advanced Analytics Header */}
      {analytics && (
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 mb-6`}>
          <div
            className={`p-3 rounded-lg ${
              t?.glass || "bg-gray-800/50"
            } backdrop-blur-sm border border-white/10`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-medium ${
                  t?.text || "text-gray-400"
                } opacity-70`}
              >
                Avg Net Income
              </span>
              <DollarSign size={12} className="text-cyan-400" />
            </div>
            <p
              className={`text-lg font-bold mt-1 ${
                analytics.avgNetIncome >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {formatAmount(
                analytics.avgNetIncome === 0 ? 0 : analytics.avgNetIncome
              )}
            </p>
          </div>
          <div
            className={`p-3 rounded-lg ${
              t?.glass || "bg-gray-800/50"
            } backdrop-blur-sm border border-white/10`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-medium ${
                  t?.text || "text-gray-400"
                } opacity-70`}
              >
                Trend
              </span>
              {analytics.trend === "upward" ? (
                <TrendingUp size={12} className="text-green-400" />
              ) : analytics.trend === "downward" ? (
                <TrendingDown size={12} className="text-red-400" />
              ) : (
                <Activity size={12} className="text-yellow-400" />
              )}
            </div>
            <p
              className={`text-lg font-bold mt-1 capitalize ${
                analytics.trend === "upward"
                  ? "text-green-400"
                  : analytics.trend === "downward"
                  ? "text-red-400"
                  : "text-yellow-400"
              }`}
            >
              {analytics.trend}
            </p>
          </div>
          <div
            className={`p-3 rounded-lg ${
              t?.glass || "bg-gray-800/50"
            } backdrop-blur-sm border border-white/10`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-medium ${
                  t?.text || "text-gray-400"
                } opacity-70`}
              >
                Volatility
              </span>
              <Activity size={12} className="text-purple-400" />
            </div>
            <p className={`text-lg font-bold mt-1 text-purple-400`}>
              {formatAmount(
                analytics.volatility === 0 ? 0 : analytics.volatility
              )}
            </p>
          </div>
          <div
            className={`p-3 rounded-lg ${
              t?.glass || "bg-gray-800/50"
            } backdrop-blur-sm border border-white/10`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-medium ${
                  t?.text || "text-gray-400"
                } opacity-70`}
              >
                Profit Margin
              </span>
              <Activity
                size={12}
                className={
                  analytics.profitMargin >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }
              />
            </div>
            <p
              className={`text-lg font-bold mt-1 ${
                analytics.profitMargin >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {formatNumber(
                analytics.profitMargin === 0 ? 0 : analytics.profitMargin
              )}
              %
            </p>
          </div>
        </div>
      )}

      {/* Metric Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {metricButtons.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setSelectedMetric(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-1 ${
              selectedMetric === key
                ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30"
                : "bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-700/50"
            } backdrop-blur-sm`}
          >
            {Icon && <Icon size={14} />}
            {label}
          </button>
        ))}
      </div>

      {/* Advanced Chart Container */}
      <div
        ref={chartRef}
        className="relative w-full min-w-[700px] h-80 bg-gradient-to-br from-gray-900/20 to-gray-800/10 rounded-xl border border-white/5 backdrop-blur-sm"
        onMouseLeave={handleMouseLeave}
      >
        {/* Background Grid */}
        <svg
          viewBox={`0 0 ${width} ${height + 50}`}
          className="absolute inset-0 w-full h-full"
        >
          {/* Grid Pattern */}
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#2D3748"
                strokeWidth="0.5"
                opacity="0.2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Enhanced Axes */}
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="#4A5568"
            strokeWidth="2"
          />
          <line
            x1={padding}
            y1={zeroLineY}
            x2={width - padding}
            y2={zeroLineY}
            stroke="#718096"
            strokeWidth="2"
          />

          {/* Y-axis Labels */}
          {Array.from({ length: 5 }, (_, i) => {
            const value = minVal + (range * (4 - i)) / 4;
            const y = padding + (i * chartHeight) / 4;
            return (
              <g key={`label-${i}`}>
                <line
                  x1={padding - 5}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#2D3748"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
                <text
                  x={padding - 10}
                  y={y + 3}
                  fontSize="10"
                  fill="#A0AEC0"
                  textAnchor="end"
                >
                  {selectedMetric === "profitMargin"
                    ? `${value === 0 ? "0" : formatNumber(value)}%`
                    : formatAmount(value)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Advanced Bar Chart */}
        <svg
          viewBox={`0 0 ${width} ${height + 50}`}
          className="absolute inset-0 w-full h-full"
        >
          {historicalData.slice(1).map((d, i) => {
            const x = getX(i + 1);
            const value = getMetricValue(d, selectedMetric);
            const barWidth = (chartWidth / (historicalData.length - 1)) * 0.7;
            const barHeight =
              Math.abs(getY(value) - zeroLineY) * animationProgress;
            const barY = value >= 0 ? getY(value) : zeroLineY;
            const color = getMetricColor(value, selectedMetric);
            const isHovered = hoveredBar === i;

            return (
              <g key={`bar-${i}`}>
                {/* Shadow */}
                <rect
                  x={x - barWidth / 2 + 2}
                  y={barY + 2}
                  width={barWidth}
                  height={barHeight}
                  fill="#000"
                  opacity="0.2"
                  rx="4"
                />
                {/* Main Bar */}
                <rect
                  x={x - barWidth / 2}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  opacity={isHovered ? 1 : 0.8}
                  rx="4"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={(e) => {
                    setHoveredBar(i);
                    handleMouseMove(e, d, i);
                  }}
                  onMouseMove={(e) => handleMouseMove(e, d, i)}
                  style={{
                    filter: isHovered
                      ? `drop-shadow(0 0 12px ${color})`
                      : "none",
                    transform: isHovered ? "scaleY(1.05)" : "scaleY(1)",
                    transformOrigin: value >= 0 ? "top" : "bottom",
                  }}
                />
                {/* Value Label */}
                {value !== 0 &&
                  (isHovered || i === historicalData.length - 2) && (
                    <text
                      x={x}
                      y={value >= 0 ? getY(value) - 8 : getY(value) + 20}
                      fontSize="10"
                      fill={color}
                      textAnchor="middle"
                      fontWeight="bold"
                      className="transition-opacity duration-300"
                    >
                      {selectedMetric === "profitMargin"
                        ? `${value === 0 ? "0" : formatNumber(value)}%`
                        : formatAmount(value)}
                    </text>
                  )}
              </g>
            );
          })}

          {/* Gradient Definitions */}
          <defs>
            <linearGradient
              id="advancedGreenGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient
              id="advancedRedGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#DC2626" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient
              id="advancedBlueGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient
              id="advancedOrangeGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#EA580C" stopOpacity="0.7" />
            </linearGradient>
          </defs>
        </svg>

        {/* Advanced Trend Line */}
        <svg
          viewBox={`0 0 ${width} ${height + 50}`}
          className="absolute inset-0 w-full h-full"
        >
          <polyline
            fill="none"
            stroke={highlightProfitability ? "#FCD34D" : "#8B5CF6"}
            strokeWidth="3"
            strokeDasharray="8,4"
            points={historicalData
              .map(
                (d, i) =>
                  `${getX(i)},${getY(getMetricValue(d, selectedMetric))}`
              )
              .join(" ")}
            className="transition-all duration-1000"
            style={{
              strokeDashoffset: animationProgress === 1 ? 0 : 1000,
              opacity: animationProgress,
            }}
          />

          {/* Data Points */}
          {historicalData.map((d, i) => {
            const x = getX(i);
            const value = getMetricValue(d, selectedMetric);
            const isLast = i === historicalData.length - 1;
            const isFirst = i === 0;

            return (
              <g key={`point-${i}`}>
                <circle
                  cx={x}
                  cy={getY(value)}
                  r={hoveredBar === i - 1 ? 7 : 5}
                  fill={highlightProfitability ? "#FCD34D" : "#8B5CF6"}
                  stroke="#fff"
                  strokeWidth="2"
                  className="transition-all duration-300"
                  style={{
                    filter:
                      hoveredBar === i - 1
                        ? "drop-shadow(0 0 8px rgba(252, 211, 77, 0.6))"
                        : "none",
                  }}
                />
                {(isFirst ||
                  isLast ||
                  i % Math.ceil(historicalData.length / 5) === 0) && (
                  <text
                    x={x}
                    y={height - padding + 20}
                    fontSize="9"
                    fill="#A0AEC0"
                    textAnchor="middle"
                    transform={`rotate(15 ${x},${height - padding + 20})`}
                  >
                    {d.period.split(" ")[0]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Advanced Tooltip */}
        {tooltipPosition.visible && tooltipPosition.data && (
          <div
            className={`absolute z-50 p-3 rounded-lg ${
              t?.glass || "bg-gray-800/90"
            } backdrop-blur-xl border border-white/20 shadow-2xl pointer-events-none transition-all duration-200`}
            style={{
              left: `${Math.min(
                Math.max(tooltipPosition.x, 150),
                width - 150
              )}px`,
              top: `${Math.max(tooltipPosition.y - 80, 10)}px`,
              transform: "translateX(-50%)",
            }}
          >
            <div
              className={`text-xs font-semibold ${
                t?.text || "text-gray-100"
              } mb-1`}
            >
              {tooltipPosition.data.entryDescription}
            </div>
            <div className="space-y-1">
              <div className="flex justify-between gap-4">
                <span
                  className={`text-xs ${t?.text || "text-gray-400"} opacity-70`}
                >
                  Net Income:
                </span>
                <span
                  className={`text-xs font-bold ${
                    tooltipPosition.data.netIncome >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  ${tooltipPosition.data.netIncome.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span
                  className={`text-xs ${t?.text || "text-gray-400"} opacity-70`}
                >
                  Revenue:
                </span>
                <span className={`text-xs font-bold text-blue-400`}>
                  ${tooltipPosition.data.revenue.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span
                  className={`text-xs ${t?.text || "text-gray-400"} opacity-70`}
                >
                  Expenses:
                </span>
                <span className={`text-xs font-bold text-orange-400`}>
                  ${tooltipPosition.data.expenses.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span
                  className={`text-xs ${t?.text || "text-gray-400"} opacity-70`}
                >
                  Margin:
                </span>
                <span
                  className={`text-xs font-bold ${
                    tooltipPosition.data.profitMargin >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {formatNumber(tooltipPosition.data.profitMargin)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Legend */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span className={`text-xs ${t?.text || "text-gray-400"}`}>
              Positive
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500"></div>
            <span className={`text-xs ${t?.text || "text-gray-400"}`}>
              Negative
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-purple-500"></div>
            <span className={`text-xs ${t?.text || "text-gray-400"}`}>
              Trend
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Info size={12} className={t?.text || "text-gray-400"} />
          <span className={`text-xs ${t?.text || "text-gray-400"} opacity-70`}>
            Hover over bars for details
          </span>
        </div>
      </div>
    </div>
  );
};
