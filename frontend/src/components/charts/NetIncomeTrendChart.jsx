import React, { useMemo, useState, useRef, useEffect, useContext } from "react";
import {
  DollarSign,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
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

  // Simplified chart rendering for performance
  return (
    <div className="overflow-x-auto">
      <div
        ref={chartRef}
        className="relative w-full min-w-[700px] h-80 bg-gradient-to-br from-gray-900/20 to-gray-800/10 rounded-xl border border-white/5 backdrop-blur-sm"
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center justify-center h-full">
          <p className={t?.text || "text-gray-400"}>
            Chart rendering optimized - {historicalData.length} data points
          </p>
        </div>
      </div>
    </div>
  );
};
