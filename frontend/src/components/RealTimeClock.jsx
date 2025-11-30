import React, { useState, useEffect } from "react";
import { Clock, Calendar, MapPin, Sparkles, Globe } from "lucide-react";
import { getCurrencyByCode } from "../utils/currencyData";

const RealTimeClock = ({ currency, theme }) => {
  const [time, setTime] = useState(new Date());
  const currencyData = getCurrencyByCode(currency);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time based on currency's timezone
  const formatTime = () => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: currencyData.timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(time);
    } catch {
      // Fallback if timezone is invalid
      return time.toLocaleTimeString("en-US", { hour12: true });
    }
  };

  // Format date based on currency's locale
  const formatDate = () => {
    try {
      return new Intl.DateTimeFormat(currencyData.locale, {
        timeZone: currencyData.timezone,
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(time);
    } catch {
      // Fallback if locale is invalid
      return time.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  const themeClasses = {
    dark: {
      bg: "bg-gradient-to-r from-gray-800/50 to-gray-700/50",
      border: "border-gray-600/50",
      text: "text-gray-100",
      subtext: "text-gray-400",
      accent: "text-cyan-400",
      glow: "shadow-cyan-500/20",
    },
    light: {
      bg: "bg-gradient-to-r from-gray-200/50 to-gray-100/50",
      border: "border-gray-300/50",
      text: "text-gray-900",
      subtext: "text-gray-600",
      accent: "text-blue-600",
      glow: "shadow-blue-500/20",
    },
  };

  const t = themeClasses[theme] || themeClasses.dark;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${t.bg} ${t.border} backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg ${t.glow} relative overflow-hidden group`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

      {/* Time Section */}
      <div className="flex items-center gap-2 relative z-10">
        <div
          className={`p-1.5 rounded-lg ${
            theme === "dark" ? "bg-cyan-500/20" : "bg-cyan-500/10"
          } group-hover:scale-110 transition-transform duration-300`}
        >
          <Clock size={14} className={t.accent} />
        </div>
        <div className="flex flex-col">
          <span
            className={`font-mono text-sm font-bold ${t.text} leading-tight`}
          >
            {formatTime()}
          </span>
          <span className={`text-xs ${t.subtext} flex items-center gap-1`}>
            <Sparkles size={8} className="animate-pulse" />
            Local Time
          </span>
        </div>
      </div>

      {/* Separator */}
      <div className={`w-px h-6 ${t.border} relative z-10`}></div>

      {/* Date Section */}
      <div className="flex items-center gap-2 relative z-10">
        <div
          className={`p-1.5 rounded-lg ${
            theme === "dark" ? "bg-blue-500/20" : "bg-blue-500/10"
          } group-hover:scale-110 transition-transform duration-300`}
        >
          <Calendar
            size={14}
            className={theme === "dark" ? "text-blue-400" : "text-blue-600"}
          />
        </div>
        <div className="flex flex-col">
          <span className={`text-sm font-medium ${t.text} leading-tight`}>
            {formatDate()}
          </span>
          <span className={`text-xs ${t.subtext} flex items-center gap-1`}>
            <Globe size={8} />
            {currencyData.locale.split("-")[0] || "Local"}
          </span>
        </div>
      </div>

      {/* Separator */}
      <div className={`w-px h-6 ${t.border} relative z-10`}></div>

      {/* Location Section */}
      <div className="flex items-center gap-2 relative z-10">
        <div
          className={`p-1.5 rounded-lg ${
            theme === "dark" ? "bg-purple-500/20" : "bg-purple-500/10"
          } group-hover:scale-110 transition-transform duration-300`}
        >
          <MapPin
            size={14}
            className={theme === "dark" ? "text-purple-400" : "text-purple-600"}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-lg">{currencyData.flag}</span>
            <span className={`text-sm font-bold ${t.accent}`}>
              {currencyData.timezone.split("/")[1]?.replace(/_/g, " ") ||
                currencyData.country}
            </span>
          </div>
          <span className={`text-xs ${t.subtext} flex items-center gap-1`}>
            <MapPin size={8} />
            {currencyData.timezone.split("/")[0] || "UTC"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RealTimeClock;
