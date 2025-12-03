import React, { useState, useContext } from "react";
import {
  BookOpen,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  EyeOff,
  Search,
  Filter,
  Calculator,
  FileText,
  BarChart3,
  Target,
  Printer,
} from "lucide-react";
import { CurrencyContext } from "../contexts/CurrencyContext";

const GeneralLedger = ({
  accounts,
  journalEntries,
  adjustingEntries,
  balances,
  t,
}) => {
  const { formatAmount, formatNumber } = useContext(CurrencyContext);
  const [showDetails, setShowDetails] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [expandedAccounts, setExpandedAccounts] = useState(new Set());

  const allEntries = [...journalEntries, ...adjustingEntries];

  // Calculate summary statistics
  const totalAccounts = accounts.length;
  const activeAccounts = accounts.filter(
    (acc) => balances[acc.id] && balances[acc.id] !== 0
  ).length;
  const totalDebits = allEntries.reduce(
    (sum, entry) =>
      sum +
      entry.lines.reduce(
        (entrySum, line) => entrySum + (parseFloat(line.debit) || 0),
        0
      ),
    0
  );
  const totalCredits = allEntries.reduce(
    (sum, entry) =>
      sum +
      entry.lines.reduce(
        (entrySum, line) => entrySum + (parseFloat(line.credit) || 0),
        0
      ),
    0
  );

  // Filter accounts based on search and type
  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || account.type === filterType;
    const hasActivity = balances[account.id] && balances[account.id] !== 0;
    return matchesSearch && matchesType && hasActivity;
  });

  const toggleAccountExpansion = (accountId) => {
    const newExpanded = new Set(expandedAccounts);
    if (newExpanded.has(accountId)) {
      newExpanded.delete(accountId);
    } else {
      newExpanded.add(accountId);
    }
    setExpandedAccounts(newExpanded);
  };

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

            /* General Ledger Section */
            .general-ledger {
              margin-bottom: 40px;
            }

            .general-ledger h2 {
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
            .print-area .text-purple-400,
            .print-area .text-green-400,
            .print-area .text-red-400,
            .print-area .text-lime-400 {
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
            .print-area .flex.items-center.justify-between {
              justify-content: center !important;
              text-align: center !important;
            }
            .print-area .flex.items-center.gap-2 {
              display: flex !important;
              justify-content: space-between !important;
              align-items: center !important;
            }
            .print-area .flex.items-center.gap-2 > div:first-child {
              text-align: left !important;
              flex: 1 !important;
            }
            .print-area .flex.items-center.gap-2 > div:last-child {
              text-align: right !important;
              flex: 1 !important;
            }
            .print-area input[type="text"] {
              display: none !important;
            }
            .print-area .relative input {
              display: none !important;
            }
            .print-area .flex.flex-col.md\\:flex-row {
              display: none !important;
            }
          }
        `}
      </style>

      <div
        className={`rounded-2xl ${t.cardBg} ${t.shadow} p-6 md:p-8 ${t.border} backdrop-blur-xl transition-all duration-500 hover:shadow-2xl group relative overflow-hidden print-area`}
      >
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-400 animate-pulse"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute top-4 right-4 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
        <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping animation-delay-200"></div>

        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-2xl ${t.glass} group-hover:scale-110 transition-all duration-500`}
            >
              <BookOpen
                size={24}
                className="text-blue-400 group-hover:text-purple-400 transition-colors duration-300"
              />
            </div>
            <div>
              <h2
                className={`text-3xl font-black tracking-wider bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent`}
              >
                GENERAL LEDGER
              </h2>
              <p className={`text-sm ${t.text} opacity-70 mt-1`}>
                Complete account transaction history and balances
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className={`p-3 rounded-xl ${t.glass} transition-all duration-300 hover:scale-105 group`}
              title="Print General Ledger"
            >
              <Printer
                size={20}
                className={`${t.text} group-hover:scale-110 transition-transform`}
              />
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`p-3 rounded-xl ${t.glass} transition-all duration-300 hover:scale-105 group`}
            >
              {showDetails ? (
                <EyeOff
                  size={20}
                  className={`${t.text} group-hover:scale-110 transition-transform`}
                />
              ) : (
                <Eye
                  size={20}
                  className={`${t.text} group-hover:scale-110 transition-transform`}
                />
              )}
            </button>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 relative z-10">
          <div
            className={`p-4 rounded-xl ${t.glass} backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl group`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20 group-hover:scale-110 transition-transform">
                <Calculator size={20} className="text-blue-400" />
              </div>
              <div>
                <p className={`text-xs ${t.text} opacity-70 font-mono`}>
                  TOTAL ACCOUNTS
                </p>
                <p className={`text-xl font-bold ${t.accent} font-mono`}>
                  {formatNumber(totalAccounts)}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl ${t.glass} backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl group`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20 group-hover:scale-110 transition-transform">
                <Activity size={20} className="text-green-400" />
              </div>
              <div>
                <p className={`text-xs ${t.text} opacity-70 font-mono`}>
                  ACTIVE ACCOUNTS
                </p>
                <p className={`text-xl font-bold text-green-400 font-mono`}>
                  {formatNumber(activeAccounts)}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl ${t.glass} backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl group`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/20 group-hover:scale-110 transition-transform">
                <TrendingUp size={20} className="text-cyan-400" />
              </div>
              <div>
                <p className={`text-xs ${t.text} opacity-70 font-mono`}>
                  TOTAL DEBITS
                </p>
                <p className={`text-xl font-bold text-cyan-400 font-mono`}>
                  {formatAmount(totalDebits)}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl ${t.glass} backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl group`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20 group-hover:scale-110 transition-transform">
                <TrendingDown size={20} className="text-purple-400" />
              </div>
              <div>
                <p className={`text-xs ${t.text} opacity-70 font-mono`}>
                  TOTAL CREDITS
                </p>
                <p className={`text-xl font-bold text-purple-400 font-mono`}>
                  {formatAmount(totalCredits)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        {showDetails && (
          <div className="flex flex-col md:flex-row gap-4 mb-6 relative z-10">
            <div className="flex-1 relative">
              <Search
                size={18}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${t.text} opacity-50`}
              />
              <input
                type="text"
                placeholder="Search accounts by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl ${t.input} transition-all duration-300 focus:scale-[1.02] focus:shadow-xl placeholder:text-gray-500`}
              />
            </div>
            <div className="relative">
              <Filter
                size={18}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${t.text} opacity-50`}
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`pl-10 pr-8 py-3 rounded-xl ${t.input} transition-all duration-300 focus:scale-[1.02] focus:shadow-xl appearance-none cursor-pointer`}
              >
                <option value="all">All Accounts</option>
                <option value="asset">Assets</option>
                <option value="liability">Liabilities</option>
                <option value="equity">Equity</option>
                <option value="revenue">Revenue</option>
                <option value="expense">Expenses</option>
              </select>
            </div>
          </div>
        )}

        {/* Accounts List */}
        {showDetails ? (
          <div className="space-y-4 relative z-10">
            {filteredAccounts.length === 0 ? (
              <div className={`text-center py-12 ${t.text} opacity-70`}>
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No accounts found</p>
                <p className="text-sm mt-2">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              filteredAccounts.map((account) => {
                const relevantEntries = allEntries.flatMap((entry) =>
                  entry.lines
                    .filter((line) => parseInt(line.accountId) === account.id)
                    .map((line) => ({
                      ...line,
                      date: entry.date,
                      description: entry.description,
                    }))
                );

                const isExpanded = expandedAccounts.has(account.id);
                const balance = balances[account.id] || 0;

                return (
                  <div
                    key={account.id}
                    className={`border ${t.border} rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group`}
                  >
                    {/* Account Header */}
                    <div
                      className={`flex items-center justify-between p-4 ${t.tableHeader} cursor-pointer transition-all duration-300 hover:bg-white/5`}
                      onClick={() => toggleAccountExpansion(account.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            account.type === "asset"
                              ? "bg-blue-500/20 text-blue-400"
                              : account.type === "liability"
                              ? "bg-orange-500/20 text-orange-400"
                              : account.type === "equity"
                              ? "bg-purple-500/20 text-purple-400"
                              : account.type === "revenue"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          <Target size={16} />
                        </div>
                        <div>
                          <h3 className={`text-lg font-bold ${t.text}`}>
                            {account.name}
                          </h3>
                          <p
                            className={`text-xs ${t.text} opacity-70 font-mono`}
                          >
                            {account.code} • {account.type.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p
                            className={`text-xs ${t.text} opacity-70 font-mono`}
                          >
                            BALANCE
                          </p>
                          <p
                            className={`text-lg font-bold font-mono ${
                              balance >= 0 ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {formatAmount(Math.abs(balance))}
                          </p>
                        </div>
                        <BarChart3
                          size={20}
                          className={`${
                            t.text
                          } transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {/* Transaction Details */}
                    {isExpanded && (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-neutral-700/50">
                          <thead className={`${t.tableHeader}`}>
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-mono uppercase">
                                Date
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-mono uppercase">
                                Description
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-mono uppercase">
                                Debit
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-mono uppercase">
                                Credit
                              </th>
                            </tr>
                          </thead>
                          <tbody
                            className={`${t.cardBg} divide-y divide-neutral-700/30`}
                          >
                            {relevantEntries.map((line, index) => (
                              <tr
                                key={index}
                                className={`${t.tableRow} hover:bg-white/5 transition-colors duration-200`}
                              >
                                <td
                                  className={`px-4 py-3 whitespace-nowrap text-sm ${t.text} font-mono`}
                                >
                                  {line.date}
                                </td>
                                <td className={`px-4 py-3 text-sm ${t.text}`}>
                                  {line.description}
                                </td>
                                <td
                                  className={`px-4 py-3 whitespace-nowrap text-sm text-cyan-400 text-right font-mono font-bold`}
                                >
                                  {formatAmount(parseFloat(line.debit || 0))}
                                </td>
                                <td
                                  className={`px-4 py-3 whitespace-nowrap text-sm text-purple-400 text-right font-mono font-bold`}
                                >
                                  {formatAmount(parseFloat(line.credit || 0))}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className={`font-bold ${t.tableHeader}`}>
                            <tr>
                              <td
                                colSpan="2"
                                className={`px-4 py-3 text-right text-sm ${t.text} font-mono`}
                              >
                                Total Balance:
                              </td>
                              <td
                                colSpan="2"
                                className={`px-4 py-3 text-right text-sm font-mono ${
                                  balance >= 0
                                    ? "text-green-400"
                                    : "text-red-400"
                                }`}
                              >
                                {formatAmount(Math.abs(balance))}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div
            className={`text-center py-12 ${t.text} opacity-70 relative z-10`}
          >
            <EyeOff size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Ledger details are hidden</p>
            <p className="text-sm mt-2">
              Click the eye icon to show account transactions
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

export default GeneralLedger;
