import React from "react";
import { Receipt, BarChart3 } from "lucide-react";

/**
 * Minimal footer component with glassmorphism effects.
 * It adapts its style based on the provided theme prop.
 * @param {string} theme - 'dark' or 'light'
 */
const Footer = ({ theme }) => {
  const themeClasses = {
    dark: {
      bg: "bg-gray-900/20 backdrop-blur-lg border-t border-white/10",
      text: "text-gray-400",
      iconColor: "text-cyan-400",
    },
    light: {
      bg: "bg-white/20 backdrop-blur-lg border-t border-gray-200/60",
      text: "text-gray-900",
      iconColor: "text-blue-700",
    },
  };

  const t = themeClasses[theme] || themeClasses.dark;

  return (
    <footer
      className={`w-full py-6 text-center transition-all duration-300 ${t.bg}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center gap-3 text-sm font-medium">
          <Receipt size={16} className={`${t.iconColor}`} />
          <span className={t.text}>
            <BarChart3 size={14} className="inline mr-2" />
            FinanceFlow Pro © {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
