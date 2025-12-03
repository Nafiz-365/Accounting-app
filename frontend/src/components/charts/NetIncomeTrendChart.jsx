import React, { useMemo, useState, useRef, useEffect, useContext } from "react";
import {
  DollarSign,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUp,
  ArrowDown,
  Calendar,
} from "lucide-react";
import { CurrencyContext } from "../../contexts/CurrencyContext";

// Extracted NetIncomeTrendChart component for better performance
export const NetIncomeTrendChart = ({
  entries,
  accounts,
  highlightProfitability = false,
  t,
}) => {
  const { formatAmount, formatNumber } = useContext(CurrencyContext);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("netIncome");
  const [animationProgress, setAnimationProgress] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [showValues, setShowValues] = useState(true);
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

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(1);
    }, 100);
    return () => clearTimeout(timer);
  }, [historicalData]);

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

  // Calculate chart dimensions and scales
  const chartWidth = 700;
  const chartHeight = 320;
  const padding = { top: 20, right: 40, bottom: 60, left: 60 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  // Find min and max values for scaling
  const allValues = historicalData.flatMap((d) => [
    d.netIncome,
    highlightProfitability ? 0 : d.revenue, // Hide revenue in profit focus mode
    highlightProfitability ? 0 : d.expenses, // Hide expenses in profit focus mode
  ]);
  const maxValue = Math.max(...allValues, 1000);
  const minValue = Math.min(...allValues, -1000);

  // Generate bars and positions
  const barWidth = Math.max(
    2,
    Math.min(40, plotWidth / historicalData.length - 2)
  );
  const barSpacing = plotWidth / historicalData.length;

  return (
    <div className="overflow-x-auto">
      {/* Chart Controls */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex gap-2">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              showGrid
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "bg-gray-800/50 text-gray-400 border border-gray-700/50"
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setShowValues(!showValues)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              showValues
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "bg-gray-800/50 text-gray-400 border border-gray-700/50"
            }`}
          >
            Values
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Calendar size={14} />
          <span>{historicalData.length - 1} entries</span>
        </div>
      </div>

      <div
        ref={chartRef}
        className="relative w-full min-w-[700px] h-80 bg-gradient-to-br from-slate-900/40 via-gray-900/20 to-slate-800/30 rounded-xl border border-white/10 backdrop-blur-xl shadow-2xl"
        onMouseLeave={handleMouseLeave}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full"
        >
          {/* Background gradient */}
          <defs>
            <linearGradient
              id="netIncomeGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(34, 197, 94, 0.8)" />
              <stop offset="100%" stopColor="rgba(34, 197, 94, 0.3)" />
            </linearGradient>
            <linearGradient id="lossGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(239, 68, 68, 0.8)" />
              <stop offset="100%" stopColor="rgba(239, 68, 68, 0.3)" />
            </linearGradient>
            <linearGradient
              id="revenueGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(34, 197, 94, 0.4)" />
              <stop offset="100%" stopColor="rgba(34, 197, 94, 0.1)" />
            </linearGradient>
            <linearGradient
              id="expensesGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(239, 68, 68, 0.4)" />
              <stop offset="100%" stopColor="rgba(239, 68, 68, 0.1)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {showGrid &&
            [0, 1, 2, 3, 4, 5].map((i) => {
              const y = padding.top + (plotHeight / 5) * i;
              const value = maxValue - ((maxValue - minValue) / 5) * i;
              return (
                <g key={i}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeDasharray="4,4"
                    className="transition-all duration-300"
                  />
                  <text
                    x={padding.left - 10}
                    y={y + 4}
                    fill="rgba(255, 255, 255, 0.6)"
                    fontSize="11"
                    fontWeight="500"
                    textAnchor="end"
                    className="transition-all duration-300"
                  >
                    {formatAmount(value)}
                  </text>
                </g>
              );
            })}

          {/* Zero line */}
          <line
            x1={padding.left}
            y1={padding.top + plotHeight * (maxValue / (maxValue - minValue))}
            x2={chartWidth - padding.right}
            y2={padding.top + plotHeight * (maxValue / (maxValue - minValue))}
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="2"
            className="transition-all duration-300"
          />

          {/* Trend line */}
          {historicalData.length > 2 && (
            <polyline
              points={historicalData
                .map((data, index) => {
                  const x = padding.left + index * barSpacing + barSpacing / 2;
                  const y =
                    padding.top +
                    plotHeight * (maxValue / (maxValue - minValue)) -
                    (data.netIncome / (maxValue - minValue)) * plotHeight;
                  return `${x},${y}`;
                })
                .join(" ")}
              fill="none"
              stroke="rgba(59, 130, 246, 0.6)"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="transition-all duration-500"
              style={{
                strokeDashoffset: `${(1 - animationProgress) * 100}%`,
              }}
            />
          )}

          {/* Bars */}
          {historicalData.map((data, index) => {
            const x =
              padding.left + index * barSpacing + (barSpacing - barWidth) / 2;

            // Net Income bar
            const netIncomeHeight =
              (Math.abs(data.netIncome) / (maxValue - minValue)) * plotHeight;
            const netIncomeY =
              data.netIncome >= 0
                ? padding.top +
                  plotHeight * (maxValue / (maxValue - minValue)) -
                  netIncomeHeight
                : padding.top + plotHeight * (maxValue / (maxValue - minValue));

            // Revenue bar (smaller, behind)
            const revenueHeight =
              (Math.abs(data.revenue) / (maxValue - minValue)) * plotHeight;
            const revenueY =
              data.revenue >= 0
                ? padding.top +
                  plotHeight * (maxValue / (maxValue - minValue)) -
                  revenueHeight
                : padding.top + plotHeight * (maxValue / (maxValue - minValue));

            // Expenses bar (smaller, behind)
            const expensesHeight =
              (Math.abs(data.expenses) / (maxValue - minValue)) * plotHeight;
            const expensesY =
              data.expenses >= 0
                ? padding.top +
                  plotHeight * (maxValue / (maxValue - minValue)) -
                  expensesHeight
                : padding.top + plotHeight * (maxValue / (maxValue - minValue));

            const isHovered = hoveredBar === index;
            const animatedHeight = netIncomeHeight * animationProgress;

            return (
              <g key={index}>
                {/* Revenue bar (background) - hide in profit focus mode */}
                {!highlightProfitability && (
                  <rect
                    x={x + barWidth * 0.1}
                    y={revenueY}
                    width={barWidth * 0.8}
                    height={revenueHeight}
                    fill="url(#revenueGradient)"
                    className="transition-all duration-300"
                    opacity={isHovered ? 0.8 : 0.6}
                    onMouseMove={(e) => handleMouseMove(e, data, index)}
                    onMouseEnter={() => setHoveredBar(index)}
                  />
                )}

                {/* Expenses bar (background) - hide in profit focus mode */}
                {!highlightProfitability && (
                  <rect
                    x={x + barWidth * 0.1}
                    y={expensesY}
                    width={barWidth * 0.8}
                    height={expensesHeight}
                    fill="url(#expensesGradient)"
                    className="transition-all duration-300"
                    opacity={isHovered ? 0.8 : 0.6}
                    onMouseMove={(e) => handleMouseMove(e, data, index)}
                    onMouseEnter={() => setHoveredBar(index)}
                  />
                )}

                {/* Net Income bar (foreground) */}
                <rect
                  x={highlightProfitability ? x + barWidth * 0.1 : x}
                  y={
                    data.netIncome >= 0
                      ? padding.top +
                        plotHeight * (maxValue / (maxValue - minValue)) -
                        animatedHeight
                      : padding.top +
                        plotHeight * (maxValue / (maxValue - minValue))
                  }
                  width={highlightProfitability ? barWidth * 0.8 : barWidth}
                  height={animatedHeight}
                  fill={
                    data.netIncome >= 0
                      ? "url(#netIncomeGradient)"
                      : "url(#lossGradient)"
                  }
                  stroke={
                    isHovered || highlightProfitability
                      ? "rgba(255, 255, 255, 0.8)"
                      : "transparent"
                  }
                  strokeWidth={isHovered || highlightProfitability ? 2 : 0}
                  filter={
                    isHovered || highlightProfitability ? "url(#glow)" : ""
                  }
                  className="transition-all duration-300 cursor-pointer"
                  onMouseMove={(e) => handleMouseMove(e, data, index)}
                  onMouseEnter={() => setHoveredBar(index)}
                />

                {/* Value labels on top of bars - show when Values is ON or when hovering */}
                {(showValues || isHovered) && data.netIncome !== 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={
                      data.netIncome >= 0
                        ? netIncomeY - 5
                        : netIncomeY + netIncomeHeight + 15
                    }
                    fill={
                      data.netIncome >= 0
                        ? "rgba(34, 197, 94, 0.9)"
                        : "rgba(239, 68, 68, 0.9)"
                    }
                    fontSize={showValues ? "9" : "10"}
                    fontWeight={showValues ? "500" : "600"}
                    textAnchor="middle"
                    className="transition-all duration-300"
                    opacity={showValues ? 0.8 : 1}
                  >
                    {formatAmount(data.netIncome)}
                  </text>
                )}

                {/* Entry labels below bars */}
                {showValues && (
                  <text
                    x={x + barWidth / 2}
                    y={chartHeight - padding.bottom + 35}
                    fill="rgba(255, 255, 255, 0.7)"
                    fontSize="10"
                    fontWeight="500"
                    textAnchor="middle"
                    className="transition-all duration-300"
                  >
                    {data.period.split(" ")[0]}
                  </text>
                )}

                {/* Trend indicator */}
                {index > 0 &&
                  data.netIncome !== historicalData[index - 1].netIncome && (
                    <g
                      transform={`translate(${x + barWidth / 2}, ${
                        padding.top - 10
                      })`}
                    >
                      {data.netIncome > historicalData[index - 1].netIncome ? (
                        <ArrowUp
                          size={12}
                          fill="rgba(34, 197, 94, 0.8)"
                          className="animate-pulse"
                        />
                      ) : (
                        <ArrowDown
                          size={12}
                          fill="rgba(239, 68, 68, 0.8)"
                          className="animate-pulse"
                        />
                      )}
                    </g>
                  )}
              </g>
            );
          })}

          {/* X-axis labels - removed to avoid duplication with entry labels */}
        </svg>

        {/* Enhanced Tooltip */}
        {tooltipPosition.visible && tooltipPosition.data && (
          <div
            className="absolute bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl p-4 text-xs text-white pointer-events-none z-50 shadow-2xl min-w-[200px]"
            style={{
              left: `${Math.min(tooltipPosition.x, chartWidth - 220)}px`,
              top: `${tooltipPosition.y - 100}px`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-cyan-400">
                {tooltipPosition.data.period}
              </span>
              <div className="flex items-center gap-1">
                {tooltipPosition.data.netIncome > 0 ? (
                  <TrendingUp size={12} className="text-green-400" />
                ) : (
                  <TrendingDown size={12} className="text-red-400" />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center gap-4">
                <span className="text-gray-400">Net Income:</span>
                <span
                  className={`font-semibold ${
                    tooltipPosition.data.netIncome >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {formatAmount(tooltipPosition.data.netIncome)}
                </span>
              </div>
              {!highlightProfitability && (
                <>
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-gray-400">Revenue:</span>
                    <span className="text-green-400 font-medium">
                      {formatAmount(tooltipPosition.data.revenue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-gray-400">Expenses:</span>
                    <span className="text-red-400 font-medium">
                      {formatAmount(tooltipPosition.data.expenses)}
                    </span>
                  </div>
                </>
              )}
              {tooltipPosition.data.profitMargin !== undefined && (
                <div className="pt-2 border-t border-white/10">
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-gray-400">Margin:</span>
                    <span
                      className={`font-semibold ${
                        tooltipPosition.data.profitMargin >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {tooltipPosition.data.profitMargin.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Enhanced Legend */}
        <div className="absolute top-3 right-3 bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-lg p-3 shadow-xl">
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-b from-green-500/80 to-green-500/30 rounded"></div>
              <span className="text-white/80 font-medium">Net Income</span>
            </div>
            {!highlightProfitability && (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-b from-green-500/40 to-green-500/10 rounded"></div>
                  <span className="text-white/60">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-b from-red-500/40 to-red-500/10 rounded"></div>
                  <span className="text-white/60">Expenses</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="absolute bottom-3 left-3 bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-lg p-3 shadow-xl">
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <DollarSign size={12} className="text-cyan-400" />
              <span className="text-white/80 font-medium">
                {formatAmount(
                  historicalData[historicalData.length - 1]?.netIncome || 0
                )}
              </span>
            </div>
            {historicalData.length > 1 && (
              <div className="flex items-center gap-1">
                {historicalData[historicalData.length - 1]?.netIncome >
                historicalData[historicalData.length - 2]?.netIncome ? (
                  <ArrowUp size={10} className="text-green-400" />
                ) : (
                  <ArrowDown size={10} className="text-red-400" />
                )}
                <span className="text-gray-400">
                  {formatAmount(
                    Math.abs(
                      (historicalData[historicalData.length - 1]?.netIncome ||
                        0) -
                        (historicalData[historicalData.length - 2]?.netIncome ||
                          0)
                    )
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
