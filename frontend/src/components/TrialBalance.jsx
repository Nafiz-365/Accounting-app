import React, { useState, useMemo } from "react";
import {
  Scale,
  Search,
  Filter,
  Printer,
  TrendingUp,
  TrendingDown,
  Target,
  Eye,
  EyeOff,
  ArrowUpDown,
  CheckCircle,
  AlertCircle,
  Calculator,
  FileText,
  BarChart3,
} from "lucide-react";
import { useCurrency } from "../contexts/CurrencyContext";

const TrialBalance = ({ trialBalanceData, t }) => {
  const { formatAmount, formatNumber } = useCurrency();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showDetails, setShowDetails] = useState(true);

  const {
    data = [],
    totalDebits = 0,
    totalCredits = 0,
  } = trialBalanceData || {};

  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;
  const variance = Math.abs(totalDebits - totalCredits);

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = data.filter((item) => {
      const matchesSearch =
        item.account?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.account?.code?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        filterType === "all" || item.account?.type === filterType;
      return matchesSearch && matchesType;
    });

    // Sort data
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.account?.name || "";
          bValue = b.account?.name || "";
          break;
        case "code":
          aValue = a.account?.code || "";
          bValue = b.account?.code || "";
          break;
        case "debit":
          aValue = a.debit || 0;
          bValue = b.debit || 0;
          break;
        case "credit":
          aValue = a.credit || 0;
          bValue = b.credit || 0;
          break;
        case "balance":
          aValue = (a.debit || 0) - (a.credit || 0);
          bValue = (b.debit || 0) - (b.credit || 0);
          break;
        default:
          aValue = a.account?.name || "";
          bValue = b.account?.name || "";
      }

      if (typeof aValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
    });

    return filtered;
  }, [data, searchTerm, filterType, sortBy, sortOrder]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const activeAccounts = data.filter(
      (item) => (item.debit || 0) > 0 || (item.credit || 0) > 0
    ).length;

    const zeroBalanceAccounts = data.filter(
      (item) => (item.debit || 0) === 0 && (item.credit || 0) === 0
    ).length;

    const totalBalance = totalDebits + totalCredits;

    return {
      activeAccounts,
      zeroBalanceAccounts,
      totalBalance,
      variance,
      variancePercentage:
        totalBalance > 0 ? (variance / totalBalance) * 100 : 0,
    };
  }, [data, totalDebits, totalCredits, variance]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getAccountTypeColor = (type) => {
    switch (type) {
      case "asset":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "liability":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "equity":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "revenue":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "expense":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className={`rounded-2xl ${t.cardBg} ${t.shadow} p-6 md:p-8 ${t.border} backdrop-blur-xl transition-all duration-700 ease-out hover:shadow-2xl hover:scale-[1.01] group relative overflow-hidden max-w-6xl mx-auto print-area`}
    >
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

            /* Trial Balance Section */
            .trial-balance {
              margin-bottom: 40px;
            }

            .trial-balance h2 {
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
            .print-area .text-orange-400,
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
            .print-area input[type="text"],
            .print-area .relative input,
            .print-area .flex.flex-col.md\\:flex-row {
              display: none !important;
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
            .print-area table {
              width: 100% !important;
              border-collapse: collapse !important;
              margin: 20px 0 !important;
              display: table !important;
            }
            .print-area table thead,
            .print-area table tbody {
              display: table-row-group !important;
            }
            .print-area table tr {
              display: table-row !important;
              page-break-inside: avoid !important;
            }
            .print-area table th,
            .print-area table td {
              border: 1px solid #000 !important;
              padding: 15px 10px !important;
              text-align: left !important;
              font-size: 11pt !important;
              vertical-align: top !important;
              white-space: normal !important;
              word-wrap: break-word !important;
              height: auto !important;
              min-height: 30px !important;
              display: table-cell !important;
            }
            .print-area table th {
              background-color: #f2f2f2 !important;
              font-weight: bold !important;
              font-size: 12pt !important;
            }
            .print-area table td:nth-child(1) {
              width: 40% !important;
              max-width: 40% !important;
            }
            .print-area table td:nth-child(2),
            .print-area table td:nth-child(3),
            .print-area table td:nth-child(4) {
              text-align: right !important;
              width: 20% !important;
              max-width: 20% !important;
            }
            .print-area table th:nth-child(1) {
              width: 40% !important;
              max-width: 40% !important;
            }
            .print-area table th:nth-child(2),
            .print-area table th:nth-child(3),
            .print-area table th:nth-child(4) {
              text-align: right !important;
              width: 20% !important;
              max-width: 20% !important;
            }
            .print-area .space-y-2 {
              display: none !important;
            }
          }
        `}
      </style>
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/10 to-transparent transition-all duration-700 ease-out"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-400 animate-pulse transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-green-400 animate-pulse transition-all duration-700"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute top-4 right-4 w-1 h-1 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-all duration-700"></div>
      <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping animation-delay-200 transition-all duration-700"></div>

      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-2xl ${t.glass} group-hover:scale-110 transition-all duration-700 ease-out hover:rotate-3`}
          >
            <Scale
              size={24}
              className="text-green-400 group-hover:text-blue-400 transition-all duration-500 ease-out group-hover:rotate-12"
            />
          </div>
          <div>
            <h2
              className={`text-3xl font-black tracking-wider bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent`}
            >
              TRIAL BALANCE
            </h2>
            <p className={`text-sm ${t.text} opacity-70 mt-1`}>
              Verify debits equal credits for balanced accounts
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className={`p-3 rounded-xl ${t.glass} transition-all duration-500 ease-out hover:scale-110 hover:rotate-6 group`}
            title="Print"
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 relative z-10">
        <div
          className={`p-4 rounded-xl ${t.glass} backdrop-blur-sm border border-white/10 transition-all duration-500 ease-out hover:scale-105 hover:shadow-xl hover:rotate-1 group`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20 group-hover:scale-110 transition-all duration-500 ease-out group-hover:rotate-12">
              <Target size={20} className="text-green-400" />
            </div>
            <div>
              <p className={`text-xs ${t.text} opacity-70 font-mono`}>
                ACTIVE ACCOUNTS
              </p>
              <p className={`text-xl font-bold text-green-400 font-mono`}>
                {formatNumber(summaryStats.activeAccounts)}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`p-4 rounded-xl ${t.glass} backdrop-blur-sm border border-white/10 transition-all duration-500 ease-out hover:scale-105 hover:shadow-xl hover:rotate-1 group`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20 group-hover:scale-110 transition-all duration-500 ease-out group-hover:rotate-12">
              <Calculator size={20} className="text-cyan-400" />
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
          className={`p-4 rounded-xl ${t.glass} backdrop-blur-sm border border-white/10 transition-all duration-500 ease-out hover:scale-105 hover:shadow-xl hover:rotate-1 group`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20 group-hover:scale-110 transition-all duration-500 ease-out group-hover:rotate-12">
              <BarChart3 size={20} className="text-purple-400" />
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

        <div
          className={`p-4 rounded-xl ${t.glass} backdrop-blur-sm border border-white/10 transition-all duration-500 ease-out hover:scale-105 hover:shadow-xl hover:rotate-1 group`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/20 group-hover:scale-110 transition-all duration-500 ease-out group-hover:rotate-12">
              {isBalanced ? (
                <CheckCircle size={20} className="text-green-400" />
              ) : (
                <AlertCircle size={20} className="text-red-400" />
              )}
            </div>
            <div>
              <p className={`text-xs ${t.text} opacity-70 font-mono`}>
                VARIANCE
              </p>
              <p
                className={`text-xl font-bold font-mono ${
                  isBalanced ? "text-green-400" : "text-red-400"
                }`}
              >
                {formatAmount(variance)}
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
              className={`w-full pl-10 pr-4 py-3 rounded-xl ${t.input} transition-all duration-500 ease-out focus:scale-[1.02] focus:shadow-xl hover:shadow-lg placeholder:text-gray-500`}
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
              className={`pl-10 pr-8 py-3 rounded-xl ${t.input} transition-all duration-500 ease-out focus:scale-[1.02] focus:shadow-xl hover:shadow-lg appearance-none cursor-pointer`}
            >
              <option value="all">All Accounts</option>
              <option value="asset">Assets</option>
              <option value="liability">Liabilities</option>
              <option value="equity">Equity</option>
              <option value="revenue">Revenue</option>
              <option value="expense">Expenses</option>
            </select>
          </div>
          <div className="relative">
            <ArrowUpDown
              size={18}
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${t.text} opacity-50`}
            />
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortBy(field);
                setSortOrder(order);
              }}
              className={`pl-10 pr-8 py-3 rounded-xl ${t.input} transition-all duration-500 ease-out focus:scale-[1.02] focus:shadow-xl hover:shadow-lg appearance-none cursor-pointer`}
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="code-asc">Code (A-Z)</option>
              <option value="code-desc">Code (Z-A)</option>
              <option value="debit-desc">Debit (High-Low)</option>
              <option value="debit-asc">Debit (Low-High)</option>
              <option value="credit-desc">Credit (High-Low)</option>
              <option value="credit-asc">Credit (Low-High)</option>
              <option value="balance-desc">Balance (High-Low)</option>
              <option value="balance-asc">Balance (Low-High)</option>
            </select>
          </div>
        </div>
      )}

      {/* Balance Status Alert */}
      <div
        className={`mb-6 p-4 rounded-xl backdrop-blur-sm border transition-all duration-500 ease-out relative z-10 hover:scale-[1.01] hover:shadow-lg ${
          isBalanced
            ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30"
            : "bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/30"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isBalanced ? (
              <CheckCircle className="text-green-400 animate-pulse" size={24} />
            ) : (
              <AlertCircle className="text-red-400 animate-pulse" size={24} />
            )}
            <div>
              <p
                className={`font-bold text-lg ${
                  isBalanced ? "text-green-400" : "text-red-400"
                }`}
              >
                {isBalanced ? "✨ Perfectly Balanced" : "⚠️ Balance Alert"}
              </p>
              <p className={`text-sm ${t.text} opacity-80`}>
                {isBalanced
                  ? "Debits equal credits - Your trial balance is correct!"
                  : `Variance: ${formatAmount(variance)} (${
                      summaryStats.variancePercentage === 0
                        ? "0"
                        : summaryStats.variancePercentage.toFixed(4)
                    }%)`}
              </p>
            </div>
          </div>
          {!isBalanced && (
            <div className={`text-right ${t.text} opacity-70`}>
              <p className="text-xs font-mono">DIFFERENCE</p>
              <p className="text-lg font-bold font-mono text-red-400">
                {formatAmount(variance)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Trial Balance Table */}
      {showDetails ? (
        <div className="relative z-10">
          <div
            className={`overflow-x-auto border ${t.border} rounded-xl backdrop-blur-sm transition-all duration-500 ease-out hover:shadow-lg`}
          >
            <table className="min-w-full divide-y divide-neutral-700/50">
              <thead className={t.tableHeader}>
                <tr>
                  <th
                    className="px-4 py-3 text-left text-xs font-mono uppercase cursor-pointer hover:bg-white/10 transition-all duration-300 ease-out hover:scale-105"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Account Name
                      <ArrowUpDown size={14} className="opacity-50" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-mono uppercase">
                    Type
                  </th>
                  <th
                    className="px-4 py-3 text-center text-xs font-mono uppercase cursor-pointer hover:bg-white/10 transition-all duration-300 ease-out hover:scale-105"
                    onClick={() => handleSort("debit")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Debit
                      <ArrowUpDown size={14} className="opacity-50" />
                    </div>
                  </th>
                  <th
                    className="px-4 pr-4 py-3 text-right text-xs font-mono uppercase cursor-pointer hover:bg-white/10 transition-all duration-300 ease-out hover:scale-105"
                    onClick={() => handleSort("credit")}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Credit
                      <ArrowUpDown size={14} className="opacity-50" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className={`${t.cardBg} divide-y divide-neutral-700/30`}>
                {processedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className={`text-center py-12 ${t.text} opacity-70`}
                    >
                      <FileText size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No accounts found</p>
                      <p className="text-sm mt-2">
                        Try adjusting your search or filter criteria
                      </p>
                    </td>
                  </tr>
                ) : (
                  processedData.map((item, index) => {
                    return (
                      <tr
                        key={item.account?.id || index}
                        className={`${t.tableRow} hover:bg-white/10 transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-md`}
                      >
                        <td
                          className={`px-4 py-3 whitespace-nowrap text-sm ${t.text} font-medium`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                (item.debit || 0) > (item.credit || 0)
                                  ? "bg-cyan-400"
                                  : (item.credit || 0) > (item.debit || 0)
                                  ? "bg-purple-400"
                                  : "bg-gray-400"
                              }`}
                            ></div>
                            {item.account?.name || "Unknown Account"}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.account?.type && (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-mono border ${getAccountTypeColor(
                                item.account.type
                              )}`}
                            >
                              {item.account.type.toUpperCase()}
                            </span>
                          )}
                        </td>
                        <td
                          className={`px-4 py-3 whitespace-nowrap text-sm text-cyan-400 text-center font-mono font-bold`}
                        >
                          {formatAmount(item.debit || 0)}
                        </td>
                        <td
                          className={`px-4 pr-4 py-3 whitespace-nowrap text-sm text-purple-400 text-right font-mono font-bold`}
                        >
                          {formatAmount(item.credit || 0)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              <tfoot className={`font-bold ${t.tableHeader}`}>
                <tr className="border-t-2 border-neutral-600 hover:!bg-transparent hover:!shadow-none !transition-none">
                  <td
                    colSpan="2"
                    className={`px-4 py-4 text-right text-lg ${t.text} font-mono hover:!bg-transparent hover:!shadow-none !transition-none`}
                  >
                    TOTALS:
                  </td>
                  <td className="px-4 py-4 text-center text-lg font-mono text-cyan-400 hover:!bg-transparent hover:!shadow-none !transition-none">
                    {formatAmount(totalDebits)}
                  </td>
                  <td className="px-4 pr-4 py-4 text-right text-lg font-mono text-purple-400 hover:!bg-transparent hover:!shadow-none !transition-none">
                    {formatAmount(totalCredits)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        <div className={`text-center py-12 ${t.text} opacity-70 relative z-10`}>
          <EyeOff size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">
            Trial balance details are hidden
          </p>
          <p className="text-sm mt-2">
            Click the eye icon to show account details
          </p>
        </div>
      )}
    </div>
  );
};

export default TrialBalance;
