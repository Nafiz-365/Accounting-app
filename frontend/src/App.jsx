import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import {
  Sun,
  Moon,
  Calculator,
  LogOut,
  Trash2,
  CheckCircle,
} from "lucide-react";

// Import Layout Components
import Footer from "./layout/Footer";
import CompanyHeader from "./layout/CompanyHeader";
import Sidebar from "./layout/Sidebar";

// Import Page Components
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Accounting from "./pages/Accounting";
import Journal from "./pages/Journal";
import GeneralLedger from "./components/GeneralLedger";
import TrialBalance from "./components/TrialBalance";
import IncomeStatement from "./components/IncomeStatement";
import BalanceSheet from "./components/BalanceSheet";
import { CurrencyProvider } from "./contexts/CurrencyContext";

// Main Component
const SmartAccountingManager = () => {
  // Theme State
  const [theme, setTheme] = useState("dark");
  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  // Currency State
  const [currency, setCurrency] = useState("USD");
  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem("selectedCurrency", newCurrency);
  };

  // Load saved currency on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // App State
  const [activeTab, setActiveTab] = useState("dashboard");
  const [journalEntries, setJournalEntries] = useState([]);
  const [adjustingEntries, setAdjustingEntries] = useState([]);
  const [showJournalForm, setShowJournalForm] = useState(false);
  const [showAdjustingForm, setShowAdjustingForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null); // <-- NEW: State for the entry being edited
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const [accounts, setAccounts] = useState([
    // ASSETS (1000-1999)
    // Current Assets
    { id: 1, code: "1000", name: "Cash - On-Hand", type: "asset", balance: 0 },
    { id: 2, code: "1001", name: "Cash - Bank", type: "asset", balance: 0 },
    { id: 3, code: "1002", name: "Petty Cash", type: "asset", balance: 0 },
    {
      id: 4,
      code: "1003",
      name: "Accounts Receivable - Trade",
      type: "asset",
      balance: 0,
    },
    {
      id: 5,
      code: "1004",
      name: "Accounts Receivable - Employee",
      type: "asset",
      balance: 0,
    },
    {
      id: 6,
      code: "1005",
      name: "Accounts Receivable - Other",
      type: "asset",
      balance: 0,
    },
    {
      id: 7,
      code: "1006",
      name: "Prepaid Expenses - Rent",
      type: "asset",
      balance: 0,
    },
    {
      id: 8,
      code: "1007",
      name: "Prepaid Expenses - Insurance",
      type: "asset",
      balance: 0,
    },
    {
      id: 9,
      code: "1008",
      name: "Prepaid Expenses - Advertising",
      type: "asset",
      balance: 0,
    },
    {
      id: 10,
      code: "1009",
      name: "Inventory - Raw Materials",
      type: "asset",
      balance: 0,
    },
    {
      id: 11,
      code: "1010",
      name: "Inventory - Work in Progress",
      type: "asset",
      balance: 0,
    },
    {
      id: 12,
      code: "1011",
      name: "Inventory - Finished Goods",
      type: "asset",
      balance: 0,
    },
    {
      id: 13,
      code: "1012",
      name: "Inventory - Supplies",
      type: "asset",
      balance: 0,
    },
    { id: 14, code: "1013", name: "Prepaid Taxes", type: "asset", balance: 0 },
    { id: 15, code: "1014", name: "Accrued Income", type: "asset", balance: 0 },
    {
      id: 16,
      code: "1015",
      name: "Short-Term Investments",
      type: "asset",
      balance: 0,
    },

    // Non-Current Assets
    {
      id: 17,
      code: "1020",
      name: "Property, Plant, and Equipment - Land",
      type: "asset",
      balance: 0,
    },
    {
      id: 18,
      code: "1021",
      name: "Property, Plant, and Equipment - Buildings",
      type: "asset",
      balance: 0,
    },
    {
      id: 19,
      code: "1022",
      name: "Property, Plant, and Equipment - Machinery and Equipment",
      type: "asset",
      balance: 0,
    },
    {
      id: 20,
      code: "1023",
      name: "Property, Plant, and Equipment - Furniture & Fixtures",
      type: "asset",
      balance: 0,
    },
    {
      id: 21,
      code: "1024",
      name: "Property, Plant, and Equipment - Vehicles",
      type: "asset",
      balance: 0,
    },
    {
      id: 22,
      code: "1025",
      name: "Property, Plant, and Equipment - Leasehold Improvements",
      type: "asset",
      balance: 0,
    },
    {
      id: 23,
      code: "1026",
      name: "Intangible Assets - Goodwill",
      type: "asset",
      balance: 0,
    },
    {
      id: 24,
      code: "1027",
      name: "Intangible Assets - Software Licenses",
      type: "asset",
      balance: 0,
    },
    {
      id: 25,
      code: "1028",
      name: "Intangible Assets - Patents and Trademarks",
      type: "asset",
      balance: 0,
    },
    {
      id: 26,
      code: "1029",
      name: "Investments - Real Estate",
      type: "asset",
      balance: 0,
    },
    {
      id: 27,
      code: "1030",
      name: "Investments - Stocks and Bonds",
      type: "asset",
      balance: 0,
    },
    {
      id: 28,
      code: "1031",
      name: "Investments - Private Equity",
      type: "asset",
      balance: 0,
    },

    // Accumulated Depreciation
    {
      id: 29,
      code: "1040",
      name: "Accumulated Depreciation - Buildings",
      type: "asset",
      balance: 0,
    },
    {
      id: 30,
      code: "1041",
      name: "Accumulated Depreciation - Equipment",
      type: "asset",
      balance: 0,
    },
    {
      id: 31,
      code: "1042",
      name: "Accumulated Depreciation - Vehicles",
      type: "asset",
      balance: 0,
    },
    {
      id: 32,
      code: "1043",
      name: "Accumulated Depreciation - Furniture & Fixtures",
      type: "asset",
      balance: 0,
    },

    // Other Assets
    {
      id: 33,
      code: "1050",
      name: "Security Deposits",
      type: "asset",
      balance: 0,
    },
    {
      id: 34,
      code: "1051",
      name: "Long-Term Prepaid Expenses",
      type: "asset",
      balance: 0,
    },
    {
      id: 35,
      code: "1052",
      name: "Deferred Tax Assets",
      type: "asset",
      balance: 0,
    },

    // LIABILITIES (2000-2999)
    // Current Liabilities
    {
      id: 36,
      code: "2000",
      name: "Accounts Payable - Trade",
      type: "liability",
      balance: 0,
    },
    {
      id: 37,
      code: "2001",
      name: "Accounts Payable - Employee",
      type: "liability",
      balance: 0,
    },
    {
      id: 38,
      code: "2002",
      name: "Accounts Payable - Taxes",
      type: "liability",
      balance: 0,
    },
    {
      id: 39,
      code: "2003",
      name: "Accrued Expenses - Salaries",
      type: "liability",
      balance: 0,
    },
    {
      id: 40,
      code: "2004",
      name: "Accrued Expenses - Utilities",
      type: "liability",
      balance: 0,
    },
    {
      id: 41,
      code: "2005",
      name: "Accrued Expenses - Taxes",
      type: "liability",
      balance: 0,
    },
    {
      id: 42,
      code: "2006",
      name: "Short-Term Loans",
      type: "liability",
      balance: 0,
    },
    {
      id: 43,
      code: "2007",
      name: "Customer Deposits",
      type: "liability",
      balance: 0,
    },
    {
      id: 44,
      code: "2008",
      name: "Unearned Revenue - Service",
      type: "liability",
      balance: 0,
    },
    {
      id: 45,
      code: "2009",
      name: "Unearned Revenue - Rent",
      type: "liability",
      balance: 0,
    },
    {
      id: 46,
      code: "2010",
      name: "Notes Payable - Short-Term",
      type: "liability",
      balance: 0,
    },
    {
      id: 47,
      code: "2011",
      name: "Current Portion of Long-Term Debt",
      type: "liability",
      balance: 0,
    },
    {
      id: 48,
      code: "2012",
      name: "Sales Taxes Payable",
      type: "liability",
      balance: 0,
    },
    {
      id: 49,
      code: "2013",
      name: "Payroll Taxes Payable",
      type: "liability",
      balance: 0,
    },
    {
      id: 50,
      code: "2014",
      name: "Deferred Revenue - Memberships",
      type: "liability",
      balance: 0,
    },
    {
      id: 51,
      code: "2015",
      name: "Deferred Revenue - Subscriptions",
      type: "liability",
      balance: 0,
    },

    // Non-Current Liabilities
    {
      id: 52,
      code: "2020",
      name: "Notes Payable - Long-Term",
      type: "liability",
      balance: 0,
    },
    {
      id: 53,
      code: "2021",
      name: "Bank Loans - Long-Term",
      type: "liability",
      balance: 0,
    },
    {
      id: 54,
      code: "2022",
      name: "Mortgage Payable",
      type: "liability",
      balance: 0,
    },
    {
      id: 55,
      code: "2023",
      name: "Bonds Payable",
      type: "liability",
      balance: 0,
    },
    {
      id: 56,
      code: "2024",
      name: "Deferred Tax Liabilities",
      type: "liability",
      balance: 0,
    },
    {
      id: 57,
      code: "2025",
      name: "Pension Liabilities",
      type: "liability",
      balance: 0,
    },
    {
      id: 58,
      code: "2026",
      name: "Capital Lease Obligations",
      type: "liability",
      balance: 0,
    },
    {
      id: 59,
      code: "2027",
      name: "Contingent Liabilities",
      type: "liability",
      balance: 0,
    },
    {
      id: 60,
      code: "2028",
      name: "Long-Term Customer Deposits",
      type: "liability",
      balance: 0,
    },

    // Other Liabilities
    {
      id: 61,
      code: "2030",
      name: "Income Tax Payable",
      type: "liability",
      balance: 0,
    },
    {
      id: 62,
      code: "2031",
      name: "Interest Payable",
      type: "liability",
      balance: 0,
    },
    {
      id: 63,
      code: "2032",
      name: "Legal Liabilities",
      type: "liability",
      balance: 0,
    },
    {
      id: 64,
      code: "2033",
      name: "Environmental Liabilities",
      type: "liability",
      balance: 0,
    },

    // EQUITY (3000-3999)
    {
      id: 65,
      code: "3000",
      name: "Owner's Equity - Capital",
      type: "equity",
      balance: 0,
    },
    {
      id: 66,
      code: "3001",
      name: "Partner's Capital",
      type: "equity",
      balance: 0,
    },
    { id: 67, code: "3002", name: "Common Stock", type: "equity", balance: 0 },
    {
      id: 68,
      code: "3003",
      name: "Preferred Stock",
      type: "equity",
      balance: 0,
    },
    {
      id: 69,
      code: "3004",
      name: "Additional Paid-In Capital",
      type: "equity",
      balance: 0,
    },
    {
      id: 70,
      code: "3005",
      name: "Treasury Stock",
      type: "equity",
      balance: 0,
    },
    {
      id: 71,
      code: "3006",
      name: "Retained Earnings",
      type: "equity",
      balance: 0,
    },
    {
      id: 72,
      code: "3007",
      name: "Accumulated Other Comprehensive Income",
      type: "equity",
      balance: 0,
    },
    {
      id: 73,
      code: "3008",
      name: "Owner's Drawings",
      type: "equity",
      balance: 0,
    },
    {
      id: 74,
      code: "3009",
      name: "Dividends Declared",
      type: "equity",
      balance: 0,
    },
    {
      id: 75,
      code: "3010",
      name: "Stock Options Outstanding",
      type: "equity",
      balance: 0,
    },
    {
      id: 76,
      code: "3011",
      name: "Minority Interest",
      type: "equity",
      balance: 0,
    },

    // REVENUE (4000-4999)
    // Primary Revenue
    {
      id: 77,
      code: "4000",
      name: "Revenue - Sales - Product",
      type: "revenue",
      balance: 0,
    },
    {
      id: 78,
      code: "4001",
      name: "Revenue - Sales - Service",
      type: "revenue",
      balance: 0,
    },
    {
      id: 79,
      code: "4002",
      name: "Revenue - Sales - Online Sales",
      type: "revenue",
      balance: 0,
    },
    {
      id: 80,
      code: "4003",
      name: "Revenue - Sales - Wholesale",
      type: "revenue",
      balance: 0,
    },
    {
      id: 81,
      code: "4004",
      name: "Revenue - Subscription Sales",
      type: "revenue",
      balance: 0,
    },
    {
      id: 82,
      code: "4005",
      name: "Revenue - Membership Fees",
      type: "revenue",
      balance: 0,
    },
    {
      id: 83,
      code: "4006",
      name: "Revenue - Licensing Income",
      type: "revenue",
      balance: 0,
    },

    // Other Revenue
    {
      id: 84,
      code: "4010",
      name: "Revenue - Rental Income",
      type: "revenue",
      balance: 0,
    },
    {
      id: 85,
      code: "4011",
      name: "Revenue - Consulting Fees",
      type: "revenue",
      balance: 0,
    },
    {
      id: 86,
      code: "4012",
      name: "Revenue - Interest Income",
      type: "revenue",
      balance: 0,
    },
    {
      id: 87,
      code: "4013",
      name: "Revenue - Dividend Income",
      type: "revenue",
      balance: 0,
    },
    {
      id: 88,
      code: "4014",
      name: "Revenue - Commission Income",
      type: "revenue",
      balance: 0,
    },
    {
      id: 89,
      code: "4015",
      name: "Revenue - Royalty Income",
      type: "revenue",
      balance: 0,
    },
    {
      id: 90,
      code: "4016",
      name: "Revenue - Gain on Sale of Assets",
      type: "revenue",
      balance: 0,
    },
    {
      id: 91,
      code: "4017",
      name: "Revenue - Foreign Exchange Gains",
      type: "revenue",
      balance: 0,
    },
    {
      id: 92,
      code: "4018",
      name: "Revenue - Other Income",
      type: "revenue",
      balance: 0,
    },

    // Contra-Revenue Accounts
    {
      id: 93,
      code: "4020",
      name: "Sales Returns and Allowances",
      type: "revenue",
      balance: 0,
    },
    {
      id: 94,
      code: "4021",
      name: "Sales Discounts",
      type: "revenue",
      balance: 0,
    },
    {
      id: 95,
      code: "4022",
      name: "Customer Refunds",
      type: "revenue",
      balance: 0,
    },
    {
      id: 96,
      code: "4023",
      name: "Bad Debt Recovery",
      type: "revenue",
      balance: 0,
    },

    // EXPENSES (5000-5999)
    // Cost of Goods Sold (COGS)
    {
      id: 97,
      code: "5000",
      name: "Cost of Goods Sold - Raw Materials",
      type: "expense",
      balance: 0,
    },
    {
      id: 98,
      code: "5001",
      name: "Cost of Goods Sold - Direct Labor",
      type: "expense",
      balance: 0,
    },
    {
      id: 99,
      code: "5002",
      name: "Cost of Goods Sold - Manufacturing Overhead",
      type: "expense",
      balance: 0,
    },
    {
      id: 100,
      code: "5003",
      name: "Cost of Goods Sold - Shipping",
      type: "expense",
      balance: 0,
    },
    {
      id: 101,
      code: "5004",
      name: "Cost of Goods Sold - Freight-in",
      type: "expense",
      balance: 0,
    },
    {
      id: 102,
      code: "5005",
      name: "Cost of Goods Sold - Packaging",
      type: "expense",
      balance: 0,
    },

    // Operating Expenses
    {
      id: 103,
      code: "5010",
      name: "Operating Expense - Salaries and Wages",
      type: "expense",
      balance: 0,
    },
    {
      id: 104,
      code: "5010.1",
      name: "Salaries - Administrative",
      type: "expense",
      balance: 0,
    },
    {
      id: 105,
      code: "5010.2",
      name: "Salaries - Sales",
      type: "expense",
      balance: 0,
    },
    {
      id: 106,
      code: "5011",
      name: "Operating Expense - Rent",
      type: "expense",
      balance: 0,
    },
    {
      id: 107,
      code: "5011.1",
      name: "Office Rent",
      type: "expense",
      balance: 0,
    },
    {
      id: 108,
      code: "5011.2",
      name: "Warehouse Rent",
      type: "expense",
      balance: 0,
    },
    {
      id: 109,
      code: "5011.3",
      name: "Retail Store Rent",
      type: "expense",
      balance: 0,
    },
    {
      id: 110,
      code: "5012",
      name: "Operating Expense - Utilities",
      type: "expense",
      balance: 0,
    },
    {
      id: 111,
      code: "5012.1",
      name: "Electricity",
      type: "expense",
      balance: 0,
    },
    { id: 112, code: "5012.2", name: "Water", type: "expense", balance: 0 },
    { id: 113, code: "5012.3", name: "Internet", type: "expense", balance: 0 },
    { id: 114, code: "5012.4", name: "Telephone", type: "expense", balance: 0 },
    {
      id: 115,
      code: "5013",
      name: "Operating Expense - Insurance",
      type: "expense",
      balance: 0,
    },
    {
      id: 116,
      code: "5014",
      name: "Operating Expense - Advertising",
      type: "expense",
      balance: 0,
    },
    {
      id: 117,
      code: "5014.1",
      name: "Digital Marketing",
      type: "expense",
      balance: 0,
    },
    {
      id: 118,
      code: "5014.2",
      name: "Print Advertising",
      type: "expense",
      balance: 0,
    },
    {
      id: 119,
      code: "5014.3",
      name: "Trade Shows and Events",
      type: "expense",
      balance: 0,
    },
    {
      id: 120,
      code: "5015",
      name: "Operating Expense - Depreciation and Amortization",
      type: "expense",
      balance: 0,
    },
    {
      id: 121,
      code: "5015.1",
      name: "Depreciation - Buildings",
      type: "expense",
      balance: 0,
    },
    {
      id: 122,
      code: "5015.2",
      name: "Depreciation - Equipment",
      type: "expense",
      balance: 0,
    },
    {
      id: 123,
      code: "5015.3",
      name: "Amortization - Intangibles",
      type: "expense",
      balance: 0,
    },
    {
      id: 124,
      code: "5016",
      name: "Operating Expense - Travel and Entertainment",
      type: "expense",
      balance: 0,
    },
    { id: 125, code: "5016.1", name: "Travel", type: "expense", balance: 0 },
    {
      id: 126,
      code: "5016.2",
      name: "Meals and Entertainment",
      type: "expense",
      balance: 0,
    },
    {
      id: 127,
      code: "5016.3",
      name: "Hotel and Lodging",
      type: "expense",
      balance: 0,
    },
    {
      id: 128,
      code: "5016.4",
      name: "Airfare and Transportation",
      type: "expense",
      balance: 0,
    },

    // Non-Operating Expenses
    {
      id: 129,
      code: "5020",
      name: "Non-Operating Expense - Interest Expense",
      type: "expense",
      balance: 0,
    },
    {
      id: 130,
      code: "5021",
      name: "Non-Operating Expense - Bad Debt Expense",
      type: "expense",
      balance: 0,
    },
    {
      id: 131,
      code: "5022",
      name: "Non-Operating Expense - Loss on Sale of Assets",
      type: "expense",
      balance: 0,
    },
    {
      id: 132,
      code: "5023",
      name: "Non-Operating Expense - Foreign Exchange Losses",
      type: "expense",
      balance: 0,
    },
    {
      id: 133,
      code: "5024",
      name: "Non-Operating Expense - Income Tax Expense",
      type: "expense",
      balance: 0,
    },
    {
      id: 134,
      code: "5025",
      name: "Non-Operating Expense - Legal Fees",
      type: "expense",
      balance: 0,
    },
    {
      id: 135,
      code: "5026",
      name: "Non-Operating Expense - Environmental Expenses",
      type: "expense",
      balance: 0,
    },

    // Other Expenses
    {
      id: 136,
      code: "5030",
      name: "Other Expense - Donations and Contributions",
      type: "expense",
      balance: 0,
    },
    {
      id: 137,
      code: "5031",
      name: "Other Expense - Research and Development",
      type: "expense",
      balance: 0,
    },
    {
      id: 138,
      code: "5032",
      name: "Other Expense - Bank Fees",
      type: "expense",
      balance: 0,
    },
    {
      id: 139,
      code: "5033",
      name: "Other Expense - Professional Fees",
      type: "expense",
      balance: 0,
    },
    {
      id: 140,
      code: "5033.1",
      name: "Consulting Fees",
      type: "expense",
      balance: 0,
    },
    {
      id: 141,
      code: "5033.2",
      name: "Audit Fees",
      type: "expense",
      balance: 0,
    },
    {
      id: 142,
      code: "5034",
      name: "Other Expense - Software Subscriptions",
      type: "expense",
      balance: 0,
    },
    {
      id: 143,
      code: "5035",
      name: "Other Expense - Licensing Fees",
      type: "expense",
      balance: 0,
    },
  ]);

  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    lines: [
      { accountId: "", debit: "", credit: "" },
      { accountId: "", debit: "", credit: "" },
    ],
  });

  const [newAccount, setNewAccount] = useState({
    code: "",
    name: "",
    type: "asset",
  });

  // --- Styling Definitions ---
  const themeClasses = {
    dark: {
      bg: "bg-black",
      text: "text-gray-100",
      cardBg: "bg-gray-900/40 backdrop-blur-xl border border-white/10",
      border: "border-cyan-500/20",
      accent: "text-cyan-400",
      secondaryAccent: "text-blue-400",
      shadow: "shadow-2xl shadow-black/50",
      glass: "bg-gray-900/30 backdrop-blur-lg border border-white/10",
      glassHover: "hover:bg-gray-900/50 hover:border-white/20",
      input:
        "bg-gray-800/50 backdrop-blur-md border-gray-700/50 text-white focus:ring-cyan-400/50 focus:border-cyan-400/50",
      tableHeader:
        "bg-gray-800/30 backdrop-blur-md text-gray-200 border border-white/5",
      tableRow: "even:bg-gray-900/20 hover:bg-gray-800/30 backdrop-blur-sm",
      buttonPrimary:
        "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/25 backdrop-blur-sm border border-white/10",
      buttonSecondary:
        "bg-gray-800/40 backdrop-blur-md text-gray-300 hover:bg-gray-700/50 border border-white/10",
      glassCard:
        "bg-gray-900/20 backdrop-blur-2xl border border-white/10 shadow-2xl",
      glassPanel:
        "bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl border border-white/5",
      statCard: {
        bg: "bg-gray-800/60 backdrop-blur-lg border-white/20",
        text: "text-gray-400",
        value: "text-gray-100",
        icon: "text-cyan-400",
      },
    },
    light: {
      bg: "bg-gray-50",
      text: "text-gray-900",
      cardBg: "bg-white/70 backdrop-blur-xl border border-gray-200/50",
      border: "border-blue-200/50",
      accent: "text-blue-600",
      buttonPrimary:
        "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30",
      buttonSecondary:
        "bg-white/60 backdrop-blur-sm border-gray-300/60 hover:bg-gray-100/60 text-gray-900 hover:text-black",
      glassCard:
        "bg-white/60 backdrop-blur-xl border-gray-200/60 shadow-xl shadow-gray-500/10",
      secondaryAccent: "text-blue-600 hover:text-blue-700",
      input:
        "bg-white/80 backdrop-blur-sm border-gray-300/60 focus:border-blue-500/60 text-gray-900 placeholder-gray-600",
      statCard: {
        bg: "bg-white/80 backdrop-blur-lg border-gray-300/70",
        text: "text-gray-700",
        value: "text-gray-900",
        icon: "text-blue-600",
      },
    },
  };
  const t = themeClasses[theme];

  // --- Auth & Account Logic ---
  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setActiveTab("dashboard");
  };

  const resetForm = () => {
    setNewEntry({
      date: new Date().toISOString().split("T")[0],
      description: "",
      lines: [
        { accountId: "", debit: "", credit: "" },
        { accountId: "", debit: "", credit: "" },
      ],
    });
    setEditingEntry(null); // <-- UPDATED: Reset editing state
    setShowJournalForm(false);
    setShowAdjustingForm(false);
  };

  const validateEntry = (entry) => {
    // Check if description exists
    if (!entry.description || !entry.date) return false;

    // Check if Debits equals Credits and lines are valid
    let totalDebits = 0,
      totalCredits = 0;
    let validLineCount = 0;

    entry.lines.forEach((line) => {
      const debit = parseFloat(line.debit) || 0;
      const credit = parseFloat(line.credit) || 0;
      totalDebits += debit;
      totalCredits += credit;

      if (line.accountId && (debit > 0 || credit > 0)) {
        validLineCount++;
      }
    });

    // Must have at least two valid lines and balance must equal zero
    return Math.abs(totalDebits - totalCredits) < 0.01 && validLineCount >= 2;
  };

  // --- NEW: Unified Save/Update Logic ---
  const saveEntryHandler = (isAdjusting) => {
    const setEntries = isAdjusting ? setAdjustingEntries : setJournalEntries;
    const entries = isAdjusting ? adjustingEntries : journalEntries;

    if (!validateEntry(newEntry)) {
      alert(
        "Validation Error: Please ensure Debits equal Credits, you have at least 2 lines, and all required fields are filled."
      );
      return;
    }

    if (editingEntry) {
      // EDIT LOGIC: Find the old entry and replace it
      setEntries(
        entries.map((e) =>
          e.id === editingEntry.id ? { ...newEntry, id: editingEntry.id } : e
        )
      );
    } else {
      // NEW ENTRY LOGIC: Add a new entry
      setEntries([...entries, { ...newEntry, id: Date.now() }]);
    }

    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
    resetForm();
  };

  const saveJournalEntry = () => saveEntryHandler(false);
  const saveAdjustingEntry = () => saveEntryHandler(true);

  // --- NEW: Edit Handler ---
  const editEntry = (entry, isAdjusting) => {
    // 1. Load the entry data into the form state
    setNewEntry({
      date: entry.date,
      description: entry.description,
      // Deep copy the lines to avoid modifying state directly
      lines: entry.lines.map((line) => ({ ...line })),
    });

    // 2. Store the entry object ID to know which one to update later
    setEditingEntry({ id: entry.id, isAdjusting });

    // 3. Open the correct form and switch tab if necessary
    if (isAdjusting) {
      setShowAdjustingForm(true);
      setActiveTab("adjusting");
    } else {
      setShowJournalForm(true);
      setActiveTab("journal");
    }
  };

  // --- NEW: Delete Handler ---
  const deleteEntry = (id, isAdjusting) => {
    const setEntries = isAdjusting ? setAdjustingEntries : setJournalEntries;
    const entries = isAdjusting ? adjustingEntries : journalEntries;

    // Filter out the entry with the given id
    setEntries(entries.filter((e) => e.id !== id));

    // If the deleted entry was the one being edited, reset the form
    if (editingEntry && editingEntry.id === id) {
      resetForm();
    }
    setShowDeleteAlert(true);
    setTimeout(() => setShowDeleteAlert(false), 3000);
  };

  const addNewAccount = (e) => {
    e.preventDefault();
    if (!newAccount.code || !newAccount.name) return;
    setAccounts([...accounts, { ...newAccount, id: Date.now(), balance: 0 }]);
    setNewAccount({ code: "", name: "", type: "asset" });
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  // --- Core Accounting Calculations (Memoized) ---
  const {
    balances,
    getTotalAssets,
    getTotalLiabilities,
    getTotalEquity,
    incomeStatement,
    trialBalanceData,
  } = useMemo(() => {
    const calculateBalances = () => {
      const balances = {};
      accounts.forEach((acc) => {
        balances[acc.id] = 0;
      });
      [...journalEntries, ...adjustingEntries].forEach((entry) => {
        entry.lines.forEach((line) => {
          const account = accounts.find(
            (a) => a.id === parseInt(line.accountId)
          );
          if (!account) return;
          const debit = parseFloat(line.debit) || 0;
          const credit = parseFloat(line.credit) || 0;
          if (account.type === "asset" || account.type === "expense") {
            balances[account.id] += debit - credit;
          } else {
            balances[account.id] += credit - debit;
          }
        });
      });
      return balances;
    };

    const currentBalances = calculateBalances();

    const getTotalAssets = () =>
      accounts
        .filter((acc) => acc.type === "asset")
        .reduce((sum, acc) => sum + (currentBalances[acc.id] || 0), 0);
    const getTotalLiabilities = () =>
      accounts
        .filter((acc) => acc.type === "liability")
        .reduce((sum, acc) => sum + (currentBalances[acc.id] || 0), 0);

    const getIncomeStatement = () => {
      let totalRevenue = 0,
        totalExpenses = 0;
      accounts.forEach((account) => {
        const balance = currentBalances[account.id] || 0;
        if (account.type === "revenue") totalRevenue += balance;
        else if (account.type === "expense") totalExpenses += balance;
      });
      return {
        revenue: totalRevenue,
        expenses: totalExpenses,
        netIncome: totalRevenue - totalExpenses,
      };
    };
    const currentIncomeStatement = getIncomeStatement();

    const getTotalEquity = () => {
      const equityAccounts = accounts
        .filter((acc) => acc.type === "equity")
        .reduce((sum, acc) => sum + (currentBalances[acc.id] || 0), 0);
      return equityAccounts + (currentIncomeStatement.netIncome || 0);
    };

    const getTrialBalance = () => {
      let totalDebits = 0;
      let totalCredits = 0;
      const trialBalanceData = [];
      const allEntries = [...journalEntries, ...adjustingEntries];
      const accountsWithActivity = new Set(
        allEntries.flatMap((entry) =>
          entry.lines.map((line) => parseInt(line.accountId))
        )
      );

      accounts.forEach((account) => {
        const balance = currentBalances[account.id] || 0;
        let debitBalance = 0;
        let creditBalance = 0;
        const hasActivity = accountsWithActivity.has(account.id);
        const hasNonZeroBalance = Math.abs(balance) > 0.01;

        if (!hasActivity && !hasNonZeroBalance) return;

        if (balance > 0) {
          if (account.type === "asset" || account.type === "expense")
            debitBalance = balance;
          else creditBalance = balance;
        } else if (balance < 0) {
          if (account.type === "asset" || account.type === "expense")
            creditBalance = Math.abs(balance);
          else debitBalance = Math.abs(balance);
        }

        if (debitBalance !== 0 || creditBalance !== 0 || hasActivity) {
          trialBalanceData.push({
            account,
            debit: debitBalance,
            credit: creditBalance,
          });
          totalDebits += debitBalance;
          totalCredits += creditBalance;
        }
      });
      return { data: trialBalanceData, totalDebits, totalCredits };
    };

    return {
      balances: currentBalances,
      getTotalAssets,
      getTotalLiabilities,
      getTotalEquity,
      incomeStatement: currentIncomeStatement,
      trialBalanceData: getTrialBalance(),
    };
  }, [accounts, journalEntries, adjustingEntries]);

  // --- Main Render Decision ---

  if (!isAuthenticated) {
    return (
      <AuthPage
        onLogin={handleLogin}
        theme={theme}
        toggleTheme={toggleTheme}
        t={t}
      />
    );
  }

  return (
    <CurrencyProvider>
      <div
        className={`${t.bg} min-h-screen font-sans relative`}
        style={{
          backgroundImage:
            theme === "dark"
              ? "radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)"
              : "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)",
        }}
      >
        <div
          className={`flex flex-col md:flex-row max-w-full mx-auto relative z-10`}
        >
          {/* Company Header - Spans full width */}
          <div className="w-full md:hidden">
            <CompanyHeader theme={theme} user={user} />
          </div>

          {/* Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            theme={theme}
            onLogout={handleLogout}
            toggleTheme={toggleTheme}
          />

          {/* Main Content Area */}
          <div className="flex-1 min-h-screen flex flex-col">
            {/* Company Header - Desktop (above main header) */}
            <div className="hidden md:block">
              <CompanyHeader
                theme={theme}
                user={user}
                currency={currency}
                onCurrencyChange={handleCurrencyChange}
              />
            </div>

            {/* Header */}
            <header
              className={`flex justify-between items-center p-4 ${t.glassPanel} ${t.text} border-b ${t.border} backdrop-blur-xl transition-all duration-300`}
            >
              <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent hidden sm:block font-medium">
                {activeTab.toUpperCase().replace("_", " ")}
              </div>
            </header>

            <main className="flex-1 p-4 md:p-8 pb-12">
              {/* Eye-catching horizontal line */}
              <div className="mb-6 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
              {showSuccessAlert && (
                <div
                  className={`mb-4 p-4 ${t.glassCard} border border-green-500/50 text-green-300 rounded-xl flex items-center justify-between backdrop-blur-xl transition-all duration-300 animate-pulse`}
                >
                  <span className="flex items-center gap-2 font-medium">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <CheckCircle size={16} className="text-green-400" />
                    Entry saved successfully!
                  </span>
                  <button
                    onClick={() => setShowSuccessAlert(false)}
                    className="font-semibold hover:text-white transition-colors"
                  >
                    X
                  </button>
                </div>
              )}

              {showDeleteAlert && (
                <div
                  className={`mb-4 p-4 ${t.glassCard} border border-red-500/50 text-red-300 rounded-xl flex items-center justify-between backdrop-blur-xl transition-all duration-300 animate-pulse`}
                >
                  <span className="flex items-center gap-2 font-medium">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <Trash2 size={16} className="text-red-400" />
                    Entry deleted successfully!
                  </span>
                  <button
                    onClick={() => setShowDeleteAlert(false)}
                    className="font-semibold hover:text-white transition-colors"
                  >
                    X
                  </button>
                </div>
              )}

              {/* Render Component based on activeTab */}
              {activeTab === "dashboard" && (
                <Dashboard
                  getTotalAssets={getTotalAssets}
                  getTotalLiabilities={getTotalLiabilities}
                  getTotalEquity={getTotalEquity}
                  incomeStatement={incomeStatement}
                  journalEntries={journalEntries}
                  accounts={accounts}
                  t={t}
                />
              )}

              {activeTab === "accounting" && (
                <Accounting
                  accounts={accounts}
                  newAccount={newAccount}
                  setNewAccount={setNewAccount}
                  addNewAccount={addNewAccount}
                  t={t}
                />
              )}

              {activeTab === "journal" && (
                <Journal
                  isAdjusting={false}
                  entries={journalEntries}
                  showForm={showJournalForm}
                  setShowForm={setShowJournalForm}
                  newEntry={newEntry}
                  setNewEntry={setNewEntry}
                  accounts={accounts}
                  saveJournalEntry={saveJournalEntry}
                  saveAdjustingEntry={saveAdjustingEntry}
                  resetForm={resetForm}
                  editEntry={editEntry}
                  deleteEntry={deleteEntry}
                  editingEntry={editingEntry}
                  t={t}
                />
              )}

              {activeTab === "adjusting" && (
                <Journal
                  isAdjusting={true}
                  entries={adjustingEntries}
                  showForm={showAdjustingForm}
                  setShowForm={setShowAdjustingForm}
                  newEntry={newEntry}
                  setNewEntry={setNewEntry}
                  accounts={accounts}
                  saveJournalEntry={saveJournalEntry}
                  saveAdjustingEntry={saveAdjustingEntry}
                  resetForm={resetForm}
                  editEntry={editEntry}
                  deleteEntry={deleteEntry}
                  editingEntry={editingEntry}
                  t={t}
                />
              )}

              {activeTab === "ledger" && (
                <GeneralLedger
                  accounts={accounts}
                  journalEntries={journalEntries}
                  adjustingEntries={adjustingEntries}
                  balances={balances}
                  t={t}
                />
              )}

              {activeTab === "trial" && (
                <TrialBalance
                  trialBalanceData={trialBalanceData}
                  t={t}
                  theme={theme}
                />
              )}

              {activeTab === "income" && (
                <IncomeStatement
                  accounts={accounts}
                  balances={balances}
                  incomeStatement={incomeStatement}
                  t={t}
                />
              )}

              {activeTab === "balance" && (
                <BalanceSheet
                  accounts={accounts}
                  balances={balances}
                  getTotalAssets={getTotalAssets}
                  getTotalLiabilities={getTotalLiabilities}
                  getTotalEquity={getTotalEquity}
                  incomeStatement={incomeStatement}
                  t={t}
                  theme={theme}
                />
              )}
            </main>

            <Footer theme={theme} />
          </div>
        </div>
      </div>
    </CurrencyProvider>
  );
};

export default SmartAccountingManager;
