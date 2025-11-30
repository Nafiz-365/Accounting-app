import React from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Award,
  AlertCircle,
  Printer,
} from "lucide-react";
import { useCurrency } from "../contexts/CurrencyContext";

const IncomeStatement = ({ accounts, balances, incomeStatement, t }) => {
  const { formatAmount, formatNumber } = useCurrency();
  const { revenue, expenses, netIncome } = incomeStatement;

  const revenueAccounts = accounts.filter(
    (acc) => acc.type === "revenue" && balances[acc.id] !== 0
  );
  const expenseAccounts = accounts.filter(
    (acc) => acc.type === "expense" && balances[acc.id] !== 0
  );

  const profitMargin = revenue > 0 ? (netIncome / revenue) * 100 : 0;

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

            /* Income Statement Section */
            .income-statement {
              margin-bottom: 40px;
            }

            .income-statement h2 {
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
            .print-area .text-blue-400,
            .print-area .text-red-400,
            .print-area .text-green-400,
            .print-area .text-emerald-400 {
              color: #000 !important;
            }
            .print-area button,
            .print-area .absolute,
            .print-area svg {
              display: none !important;
            }
            .print-area .border-t {
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
            .print-area .grid-cols-1.md\\:grid-cols-2 {
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
            .print-area .grid > div .flex .w-2,
            .print-area .grid > div .flex .h-2 {
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
        className={`rounded-xl ${t.cardBg} ${t.shadow} p-6 md:p-8 ${t.border} max-w-4xl mx-auto backdrop-blur-xl transition-all duration-300 hover:shadow-2xl group relative overflow-hidden print-area`}
      >
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-blue-400 animate-pulse"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute top-4 right-4 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
        <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping animation-delay-200"></div>

        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-2xl ${t.glass} group-hover:scale-110 transition-all duration-500`}
            >
              <Target
                size={24}
                className="text-blue-400 group-hover:text-purple-400 transition-colors duration-300"
              />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-wider bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                INCOME STATEMENT
              </h2>
              <p className={`text-sm ${t.text} opacity-70 mt-1`}>
                Financial performance overview
              </p>
            </div>
          </div>

          {/* Print Button */}
          <button
            onClick={() => window.print()}
            className={`p-3 rounded-xl ${t.glass} transition-all duration-500 ease-out hover:scale-110 hover:rotate-6 group`}
            title="Print Income Statement"
          >
            <Printer
              size={20}
              className={`${t.text} group-hover:scale-110 transition-all duration-500 ease-out group-hover:rotate-12`}
            />
          </button>

          {/* Performance Badge */}
          <div
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 ${
              netIncome >= 0
                ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-400/30"
                : "bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-400 border border-red-400/30"
            }`}
          >
            {netIncome >= 0 ? (
              <>
                <Award size={16} className="animate-pulse" />
                Profitable
              </>
            ) : (
              <>
                <AlertCircle size={16} className="animate-pulse" />
                Loss
              </>
            )}
          </div>
        </div>

        <div className="space-y-3 relative z-10">
          {/* Revenue Section */}
          <div
            className={`rounded-2xl ${t.glass} border border-white/10 p-3 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <TrendingUp size={18} className="text-blue-400" />
                </div>
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  REVENUE
                </span>
              </h3>
              <span className="text-xs font-mono bg-blue-500/20 text-blue-400 px-2 py-1 rounded-lg">
                {formatNumber(revenueAccounts.length)} accounts
              </span>
            </div>

            {revenueAccounts.length === 0 ? (
              <div className="text-center py-4">
                <div className="p-3 rounded-xl bg-gray-700/30 inline-block">
                  <TrendingUp size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-400 font-medium mt-2 text-sm">
                  No revenue recorded
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Start adding revenue transactions
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {revenueAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className={`font-medium ${t.text}`}>
                        {acc.name}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-blue-400">
                      {formatAmount(balances[acc.id])}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center mt-2 pt-2 border-t border-blue-400/20">
              <span className="text-lg font-bold text-blue-400 flex items-center gap-2">
                <DollarSign size={16} />
                Total Revenue
              </span>
              <span className="text-xl font-black font-mono text-blue-300 drop-shadow-lg">
                {formatAmount(revenue)}
              </span>
            </div>
          </div>

          {/* Expenses Section */}
          <div
            className={`rounded-2xl ${t.glass} border border-white/10 p-3 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <TrendingDown size={18} className="text-red-400" />
                </div>
                <span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
                  EXPENSES
                </span>
              </h3>
              <span className="text-xs font-mono bg-red-500/20 text-red-400 px-2 py-1 rounded-lg">
                {formatNumber(expenseAccounts.length)} accounts
              </span>
            </div>

            {expenseAccounts.length === 0 ? (
              <div className="text-center py-4">
                <div className="p-3 rounded-xl bg-gray-700/30 inline-block">
                  <TrendingDown size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-400 font-medium mt-2 text-sm">
                  No expenses recorded
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Start adding expense transactions
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {expenseAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                      <span className={`font-medium ${t.text}`}>
                        {acc.name}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-red-400">
                      ({formatAmount(balances[acc.id])})
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center mt-2 pt-2 border-t border-red-400/20">
              <span className="text-lg font-bold text-red-400 flex items-center gap-2">
                <DollarSign size={16} />
                Total Expenses
              </span>
              <span className="text-xl font-black font-mono text-red-300 drop-shadow-lg">
                ({formatAmount(expenses)})
              </span>
            </div>
          </div>

          {/* Net Income Section */}
          <div
            className={`rounded-2xl p-3 border-2 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
              netIncome >= 0
                ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-400/30"
                : "bg-gradient-to-r from-red-500/10 to-rose-500/10 border-red-400/30"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-black flex items-center gap-2">
                    {netIncome >= 0 ? (
                      <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        NET INCOME
                      </span>
                    ) : (
                      <span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
                        NET LOSS
                      </span>
                    )}
                  </h3>
                  {netIncome >= 0 ? (
                    <Award size={24} className="text-green-400 animate-pulse" />
                  ) : (
                    <AlertCircle
                      size={24}
                      className="text-red-400 animate-pulse"
                    />
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className={`${t.text} opacity-70`}>
                    Profit Margin:{" "}
                    <span
                      className={`font-bold ${
                        netIncome >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {formatNumber(profitMargin)}%
                    </span>
                  </span>
                  <span className={`${t.text} opacity-70`}>
                    Efficiency:{" "}
                    <span
                      className={`font-bold ${
                        netIncome >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {profitMargin > 20
                        ? "Excellent"
                        : profitMargin > 10
                        ? "Good"
                        : profitMargin > 0
                        ? "Fair"
                        : "Poor"}
                    </span>
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-3xl font-black font-mono ${
                    netIncome >= 0
                      ? "text-green-300 drop-shadow-2xl"
                      : "text-red-300 drop-shadow-2xl"
                  }`}
                >
                  {formatAmount(netIncome)}
                </span>
                <div className="text-xs font-mono mt-1 opacity-70">
                  {netIncome >= 0 ? "Profit" : "Loss"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-xs text-slate-400 font-mono opacity-70 mt-4 print-only">
          Printed on: {new Date().toLocaleDateString()}
        </div>
      </div>
    </>
  );
};

export default IncomeStatement;
