import React, { useState, useMemo } from "react";
import {
  Scale,
  TrendingUp,
  TrendingDown,
  Target,
  Eye,
  EyeOff,
  Calculator,
  FileText,
  BarChart3,
  CheckCircle,
  AlertCircle,
  DollarSign,
  PieChart,
  Shield,
  Printer,
} from "lucide-react";
import { useCurrency } from "../contexts/CurrencyContext";

const BalanceSheet = ({
  accounts,
  balances,
  getTotalAssets,
  getTotalLiabilities,
  getTotalEquity,
  incomeStatement,
  t,
}) => {
  const { formatAmount, formatNumber } = useCurrency();
  const [showDetails, setShowDetails] = useState(true);

  const totalAssets = getTotalAssets();
  const totalLiabilities = getTotalLiabilities();
  const totalEquityAndLiabilities = getTotalLiabilities() + getTotalEquity();
  const isBalanced = Math.abs(totalAssets - totalEquityAndLiabilities) < 0.01;
  const variance = Math.abs(totalAssets - totalEquityAndLiabilities);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const assetAccounts = accounts.filter(
      (a) => a.type === "asset" && balances[a.id] !== 0
    ).length;
    const liabilityAccounts = accounts.filter(
      (a) => a.type === "liability" && balances[a.id] !== 0
    ).length;
    const equityAccounts = accounts.filter(
      (a) => a.type === "equity" && balances[a.id] !== 0
    ).length;

    return {
      assetAccounts,
      liabilityAccounts,
      equityAccounts,
      totalAccounts: assetAccounts + liabilityAccounts + equityAccounts,
    };
  }, [accounts, balances]);

  return (
    <>
      {/* Print Styles */}
      <style type="text/css" media="print">
        {`
          @media print {
            /* General Body Settings for Print */
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 0;
              color: #000;
              background-color: #fff;
            }

            /* Ensure no website styles affect the print version */
            * {
              color: inherit;
              background: none;
              box-shadow: none;
              text-shadow: none;
              margin: 0;
              padding: 0;
            }

            /* Page Setup */
            .page {
              page-break-after: always;
              margin: 20mm;
            }

            /* Table Styles */
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }

            table th, table td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
              font-size: 12pt;
            }

            table th {
              background-color: #f2f2f2;
            }

            /* Balance Sheet Section */
            .balance-sheet {
              margin-bottom: 40px;
            }

            .balance-sheet h2 {
              text-align: center;
              font-size: 16pt;
              font-weight: bold;
            }

            /* Header and Footer for Print */
            @page {
              size: auto;
              margin: 20mm;
            }

            header, footer {
              display: none; /* Hide website headers and footers */
            }

            body * {
              visibility: hidden;
            }
            .print-area, .print-area * {
              visibility: visible;
            }
            .print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .print-area * {
              color: #000 !important;
              background: none !important;
              box-shadow: none !important;
              text-shadow: none !important;
              font-family: 'Arial', sans-serif !important;
            }
            .print-area h2 {
              text-align: center !important;
              font-size: 16pt !important;
              font-weight: bold !important;
              margin-bottom: 20px !important;
            }
            .print-area table {
              width: 100% !important;
              border-collapse: collapse !important;
              margin: 20px 0 !important;
            }
            .print-area table th, .print-area table td {
              border: 1px solid #000 !important;
              padding: 8px !important;
              text-align: left !important;
              font-size: 12pt !important;
            }
            .print-area table th {
              background-color: #f2f2f2 !important;
            }
            .print-area .text-cyan-400,
            .print-area .text-orange-400,
            .print-area .text-purple-400,
            .print-area .text-blue-400,
            .print-area .text-green-400,
            .print-area .text-red-400 {
              color: #000 !important;
            }
            .print-area button,
            .print-area .absolute,
            .print-area svg {
              display: none !important;
            }
            .print-area .border-t,
            .print-area .border-b {
              border-color: #000 !important;
              border-style: solid !important;
            }
            .print-area .print-only {
              display: block !important;
              font-size: 10pt !important;
              text-align: right !important;
              margin-top: 20px !important;
            }
            .print-area .flex.items-center.justify-between {
              justify-content: center !important;
              text-align: center !important;
            }
            .print-area .flex.items-center.gap-4 {
              justify-content: center !important;
              text-align: center !important;
            }
            .print-area .flex.items-center.gap-2 {
              display: none !important;
            }
            .print-area .grid-cols-1.md\\:grid-cols-4 {
              display: flex !important;
              flex-direction: row !important;
              justify-content: space-between !important;
              gap: 20px !important;
              margin-bottom: 20px !important;
            }
            .print-area .grid > div {
              flex: 1 !important;
              text-align: center !important;
              border: 1px solid #000 !important;
              padding: 10px !important;
              border-radius: 0 !important;
            }
            .print-area .grid > div .flex {
              justify-content: center !important;
              text-align: center !important;
              flex-direction: column !important;
              align-items: center !important;
            }
            .print-area .grid > div .flex .p-1\\.5,
            .print-area .grid > div .flex .p-2 {
              display: none !important;
            }
            .print-area .grid > div .flex div {
              text-align: center !important;
            }
            .print-area .grid > div .flex div p:first-child {
              font-size: 10pt !important;
              margin-bottom: 5px !important;
            }
            .print-area .grid > div .flex div p:last-child {
              font-size: 12pt !important;
              font-weight: bold !important;
            }
            .print-area .space-y-2 > div {
              display: flex !important;
              justify-content: space-between !important;
              align-items: center !important;
              padding: 5px 0 !important;
            }
            .print-area .space-y-2 > div > div:first-child {
              text-align: left !important;
              flex: 1 !important;
            }
            .print-area .space-y-2 > div > div:last-child {
              text-align: right !important;
              flex: 1 !important;
            }
          }
        `}
      </style>

      <div
        className={`rounded-2xl ${t.cardBg} ${t.shadow} p-6 md:p-8 ${t.border} backdrop-blur-xl transition-all duration-700 ease-out hover:shadow-2xl hover:scale-[1.01] group relative overflow-hidden max-w-6xl mx-auto print-area`}
      >
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent transition-all duration-700 ease-out"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse transition-all duration-700"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-400 animate-pulse transition-all duration-700"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute top-4 right-4 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-all duration-700"></div>
        <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping animation-delay-200 transition-all duration-700"></div>

        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-2xl ${t.glass} group-hover:scale-110 transition-all duration-700 ease-out hover:rotate-3`}
            >
              <Scale
                size={24}
                className="text-blue-400 group-hover:text-purple-400 transition-all duration-500 ease-out group-hover:rotate-12"
              />
            </div>
            <div>
              <h2
                className={`text-3xl font-black tracking-wider bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent`}
              >
                BALANCE SHEET
              </h2>
              <p className={`text-sm ${t.text} opacity-70 mt-1`}>
                Financial position snapshot at a point in time
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className={`p-3 rounded-xl ${t.glass} transition-all duration-500 ease-out hover:scale-110 hover:rotate-6 group`}
              title="Print Balance Sheet"
            >
              <Printer
                size={20}
                className={`${t.text} group-hover:scale-110 transition-all duration-500 ease-out group-hover:rotate-12`}
              />
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`p-3 rounded-xl ${t.glass} transition-all duration-500 ease-out hover:scale-110 hover:rotate-6 group`}
            >
              {showDetails ? (
                <EyeOff
                  size={20}
                  className={`${t.text} group-hover:scale-110 transition-all duration-500 ease-out group-hover:rotate-12`}
                />
              ) : (
                <Eye
                  size={20}
                  className={`${t.text} group-hover:scale-110 transition-all duration-500 ease-out group-hover:rotate-12`}
                />
              )}
            </button>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6 relative z-10">
          <div
            className={`p-3 rounded-xl ${t.glass} backdrop-blur-sm border border-white/10 transition-all duration-500 ease-out hover:scale-105 hover:shadow-xl hover:rotate-1 group`}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/20 group-hover:scale-110 transition-all duration-500 ease-out group-hover:rotate-12">
                <Target size={16} className="text-blue-400" />
              </div>
              <div>
                <p className={`text-xs ${t.text} opacity-70 font-mono`}>
                  ASSET ACCOUNTS
                </p>
                <p className={`text-lg font-bold text-blue-400 font-mono`}>
                  {formatNumber(summaryStats.assetAccounts)}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`p-3 rounded-xl ${t.glass} backdrop-blur-sm border border-white/10 transition-all duration-500 ease-out hover:scale-105 hover:shadow-xl hover:rotate-1 group`}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-500/20 group-hover:scale-110 transition-all duration-500 ease-out group-hover:rotate-12">
                <Shield size={16} className="text-orange-400" />
              </div>
              <div>
                <p className={`text-xs ${t.text} opacity-70 font-mono`}>
                  LIABILITY ACCOUNTS
                </p>
                <p className={`text-lg font-bold text-orange-400 font-mono`}>
                  {formatNumber(summaryStats.liabilityAccounts)}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`p-3 rounded-xl ${t.glass} backdrop-blur-sm border border-white/10 transition-all duration-500 ease-out hover:scale-105 hover:shadow-xl hover:rotate-1 group`}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-500/20 group-hover:scale-110 transition-all duration-500 ease-out group-hover:rotate-12">
                <PieChart size={16} className="text-purple-400" />
              </div>
              <div>
                <p className={`text-xs ${t.text} opacity-70 font-mono`}>
                  EQUITY ACCOUNTS
                </p>
                <p className={`text-lg font-bold text-purple-400 font-mono`}>
                  {formatNumber(summaryStats.equityAccounts)}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`p-3 rounded-xl ${t.glass} backdrop-blur-sm border border-white/10 transition-all duration-500 ease-out hover:scale-105 hover:shadow-xl hover:rotate-1 group`}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-green-500/20 group-hover:scale-110 transition-all duration-500 ease-out group-hover:rotate-12">
                {isBalanced ? (
                  <CheckCircle size={16} className="text-green-400" />
                ) : (
                  <AlertCircle size={16} className="text-red-400" />
                )}
              </div>
              <div>
                <p className={`text-xs ${t.text} opacity-70 font-mono`}>
                  BALANCE STATUS
                </p>
                <p
                  className={`text-lg font-bold font-mono ${
                    isBalanced ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {isBalanced ? "BALANCED" : "UNBALANCED"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Balance Status Alert */}
        <div
          className={`mb-4 p-3 rounded-xl backdrop-blur-sm border transition-all duration-500 ease-out relative z-10 hover:scale-[1.01] hover:shadow-lg ${
            isBalanced
              ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30"
              : "bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isBalanced ? (
                <CheckCircle
                  className="text-green-400 animate-pulse"
                  size={20}
                />
              ) : (
                <AlertCircle className="text-red-400 animate-pulse" size={20} />
              )}
              <div>
                <p
                  className={`font-bold text-sm ${
                    isBalanced ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {isBalanced
                    ? "✨ Accounting Equation Balanced"
                    : "⚠️ Balance Alert"}
                </p>
                <p className={`text-xs ${t.text} opacity-80`}>
                  {isBalanced
                    ? "Assets = Liabilities + Equity (Perfectly Balanced)"
                    : `Variance: ${formatAmount(variance)}`}
                </p>
              </div>
            </div>
            {!isBalanced && (
              <div className={`text-right ${t.text} opacity-70`}>
                <p className="text-xs font-mono">DIFFERENCE</p>
                <p className="text-sm font-bold font-mono text-red-400">
                  {formatAmount(variance)}
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Balance Sheet Content */}
        {showDetails ? (
          <div className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className={`p-4 rounded-xl ${t.glass} backdrop-blur-sm border border-white/10 transition-all duration-500 ease-out hover:shadow-lg hover:scale-[1.01]`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-blue-500/20">
                    <DollarSign size={16} className="text-blue-400" />
                  </div>
                  <h3
                    className={`text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent border-b border-blue-500/30 pb-1`}
                  >
                    ASSETS
                  </h3>
                </div>
                <div className="space-y-2">
                  {accounts
                    .filter((a) => a.type === "asset" && balances[a.id] !== 0)
                    .map((acc) => (
                      <div
                        key={acc.id}
                        className="flex justify-between items-center text-sm p-1.5 rounded-lg hover:bg-white/5 transition-all duration-300 ease-out"
                      >
                        <span className="text-slate-400 font-medium">
                          {acc.name}
                        </span>
                        <span
                          className={`font-mono font-bold ${t.text} text-cyan-400`}
                        >
                          {formatAmount(balances[acc.id])}
                        </span>
                      </div>
                    ))}
                </div>
                <div className="mt-3 pt-3 border-t-2 border-blue-500/30">
                  <div className="flex justify-between items-center font-bold">
                    <span className={`${t.text} text-base`}>Total Assets</span>
                    <span className={`font-mono text-lg text-cyan-400`}>
                      {formatAmount(totalAssets)}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl ${t.glass} backdrop-blur-sm border border-white/10 transition-all duration-500 ease-out hover:shadow-lg hover:scale-[1.01]`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-purple-500/20">
                    <Shield size={16} className="text-purple-400" />
                  </div>
                  <h3
                    className={`text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent border-b border-purple-500/30 pb-1`}
                  >
                    LIABILITIES & EQUITY
                  </h3>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                    <h4
                      className={`text-base font-semibold ${t.secondaryAccent}`}
                    >
                      Liabilities
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {accounts
                      .filter(
                        (a) => a.type === "liability" && balances[a.id] !== 0
                      )
                      .map((acc) => (
                        <div
                          key={acc.id}
                          className="flex justify-between items-center text-sm p-1.5 rounded-lg hover:bg-white/5 transition-all duration-300 ease-out"
                        >
                          <span className="text-slate-400 font-medium">
                            {acc.name}
                          </span>
                          <span
                            className={`font-mono font-bold ${t.text} text-orange-400`}
                          >
                            {formatAmount(balances[acc.id])}
                          </span>
                        </div>
                      ))}
                  </div>
                  <div className="flex justify-between items-center font-medium pt-2 border-t border-dashed border-neutral-700">
                    <span className={`${t.text}`}>Total Liabilities</span>
                    <span className={`font-mono text-orange-400`}>
                      {formatAmount(totalLiabilities)}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    <h4
                      className={`text-base font-semibold ${t.secondaryAccent}`}
                    >
                      Equity
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {accounts
                      .filter(
                        (a) => a.type === "equity" && balances[a.id] !== 0
                      )
                      .map((acc) => (
                        <div
                          key={acc.id}
                          className="flex justify-between items-center text-sm p-1.5 rounded-lg hover:bg-white/5 transition-all duration-300 ease-out"
                        >
                          <span className="text-slate-400 font-medium">
                            {acc.name}
                          </span>
                          <span
                            className={`font-mono font-bold ${t.text} text-purple-400`}
                          >
                            {formatAmount(balances[acc.id])}
                          </span>
                        </div>
                      ))}
                    <div className="flex justify-between items-center text-sm p-1.5 rounded-lg hover:bg-white/5 transition-all duration-300 ease-out">
                      <span className="text-slate-400 font-medium">
                        Net Income
                      </span>
                      <span
                        className={`font-mono font-bold ${t.text} text-purple-400`}
                      >
                        {formatAmount(incomeStatement.netIncome)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t-2 border-purple-500/30">
                  <div className="flex justify-between items-center font-bold">
                    <span className={`${t.text} text-base`}>
                      Total Liabilities & Equity
                    </span>
                    <span className={`font-mono text-lg text-purple-400`}>
                      {formatAmount(totalEquityAndLiabilities)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Combined Totals Row */}
            <div
              className={`mt-6 p-4 rounded-xl ${t.glass} backdrop-blur-sm border border-white/10 transition-all duration-500 ease-out hover:shadow-lg hover:scale-[1.01]`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-500/20">
                      <DollarSign size={20} className="text-blue-400" />
                    </div>
                    <div>
                      <p className={`text-xs ${t.text} opacity-70 font-mono`}>
                        TOTAL ASSETS
                      </p>
                      <p
                        className={`text-xl font-black font-mono text-cyan-400`}
                      >
                        {formatAmount(totalAssets)}
                      </p>
                    </div>
                  </div>

                  <div className="text-2xl font-bold text-gray-500">=</div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-purple-500/20">
                      <Shield size={20} className="text-purple-400" />
                    </div>
                    <div>
                      <p className={`text-xs ${t.text} opacity-70 font-mono`}>
                        TOTAL LIABILITIES & EQUITY
                      </p>
                      <p
                        className={`text-xl font-black font-mono text-purple-400`}
                      >
                        {formatAmount(totalEquityAndLiabilities)}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`text-center ${
                    isBalanced ? "text-green-400" : "text-red-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isBalanced ? (
                      <CheckCircle size={20} className="animate-pulse" />
                    ) : (
                      <AlertCircle size={20} className="animate-pulse" />
                    )}
                    <span className="text-base font-bold">
                      {isBalanced ? "BALANCED" : "UNBALANCED"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`text-center py-12 ${t.text} opacity-70 relative z-10`}
          >
            <EyeOff size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">
              Balance sheet details are hidden
            </p>
            <p className="text-sm mt-2">
              Click the eye icon to show account details
            </p>
          </div>
        )}
        <div className="text-xs text-slate-400 font-mono opacity-70 mt-4 print-only">
          Printed on: {new Date().toLocaleDateString()}
        </div>
      </div>
    </>
  );
};

export default BalanceSheet;
