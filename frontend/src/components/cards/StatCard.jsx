import React, { useContext } from "react";
import { Building } from "lucide-react";
import { CurrencyContext } from "../../contexts/CurrencyContext";

// Optimized StatCard component
export const StatCard = ({
  title,
  value,
  icon = Building,
  color,
  isIncome = false,
  t,
}) => {
  const { formatAmount } = useContext(CurrencyContext);
  // Removed unused isHovered state

  return (
    <div
      className={`p-4 rounded-2xl ${t.statCard?.bg || t.glassCard} ${
        t.shadow
      } ${
        t.border
      } backdrop-blur-xl transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl group relative overflow-hidden cursor-pointer`}
      // Removed unused hover handlers
    >
      {/* Simplified content for better performance */}
      <div className="flex justify-between items-start relative z-10">
        <h3
          className={`text-sm font-black uppercase tracking-wider ${
            t.statCard?.text || "text-gray-300"
          }`}
        >
          {title}
        </h3>
        <div className={`p-2 rounded-xl ${t.glass} backdrop-blur-sm`}>
          {React.createElement(icon, {
            size: 18,
            className: `${color} transition-colors duration-300`,
          })}
        </div>
      </div>

      <div className="relative z-10 mt-2">
        <p
          className={`text-2xl font-black font-mono ${
            isIncome
              ? value >= 0
                ? "text-emerald-300 drop-shadow-2xl"
                : "text-rose-100 drop-shadow-2xl"
              : t.statCard?.value || "text-white"
          } transition-all duration-300 leading-none`}
        >
          {formatAmount(value)}
        </p>
      </div>

      {/* Simplified progress bar */}
      <div className="relative z-10 mt-3">
        <div
          className={`h-2 ${
            isIncome
              ? value >= 0
                ? "bg-emerald-400/20"
                : "bg-rose-400/20"
              : "bg-gray-400/20"
          } rounded-full overflow-hidden backdrop-blur-sm border border-white/10`}
        >
          <div
            className={`h-full ${
              isIncome
                ? value >= 0
                  ? "bg-gradient-to-r from-emerald-400 to-green-400"
                  : "bg-gradient-to-r from-rose-400 to-pink-400"
                : "bg-gradient-to-r from-cyan-400 to-blue-400"
            } rounded-full transition-all duration-1000`}
            style={{
              width: `${Math.min((Math.abs(value) / 10000) * 100, 100)}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
