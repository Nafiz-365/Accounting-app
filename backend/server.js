import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Default accounts template for new users
const defaultAccounts = [
  // ASSETS (1000-1999)
  // Current Assets
  { code: "1000", name: "Cash - On-Hand", type: "asset" },
  { code: "1001", name: "Cash - Bank", type: "asset" },
  { code: "1002", name: "Petty Cash", type: "asset" },
  { code: "1003", name: "Accounts Receivable - Trade", type: "asset" },
  { code: "1004", name: "Accounts Receivable - Employee", type: "asset" },
  { code: "1005", name: "Accounts Receivable - Other", type: "asset" },
  { code: "1006", name: "Prepaid Expenses - Rent", type: "asset" },
  { code: "1007", name: "Prepaid Expenses - Insurance", type: "asset" },
  { code: "1008", name: "Prepaid Expenses - Advertising", type: "asset" },
  { code: "1009", name: "Inventory - Raw Materials", type: "asset" },
  { code: "1010", name: "Inventory - Work in Progress", type: "asset" },
  { code: "1011", name: "Inventory - Finished Goods", type: "asset" },
  { code: "1012", name: "Inventory - Supplies", type: "asset" },
  { code: "1013", name: "Prepaid Taxes", type: "asset" },
  { code: "1014", name: "Accrued Income", type: "asset" },
  { code: "1015", name: "Short-Term Investments", type: "asset" },

  // Non-Current Assets
  {
    code: "1020",
    name: "Property, Plant, and Equipment - Land",
    type: "asset",
  },
  {
    code: "1021",
    name: "Property, Plant, and Equipment - Buildings",
    type: "asset",
  },
  {
    code: "1022",
    name: "Property, Plant, and Equipment - Machinery and Equipment",
    type: "asset",
  },
  {
    code: "1023",
    name: "Property, Plant, and Equipment - Furniture & Fixtures",
    type: "asset",
  },
  {
    code: "1024",
    name: "Property, Plant, and Equipment - Vehicles",
    type: "asset",
  },
  {
    code: "1025",
    name: "Property, Plant, and Equipment - Leasehold Improvements",
    type: "asset",
  },
  { code: "1026", name: "Intangible Assets - Goodwill", type: "asset" },
  {
    code: "1027",
    name: "Intangible Assets - Software Licenses",
    type: "asset",
  },
  {
    code: "1028",
    name: "Intangible Assets - Patents and Trademarks",
    type: "asset",
  },
  { code: "1029", name: "Investments - Real Estate", type: "asset" },
  { code: "1030", name: "Investments - Stocks and Bonds", type: "asset" },
  { code: "1031", name: "Investments - Private Equity", type: "asset" },

  // Accumulated Depreciation
  { code: "1040", name: "Accumulated Depreciation - Buildings", type: "asset" },
  { code: "1041", name: "Accumulated Depreciation - Equipment", type: "asset" },
  { code: "1042", name: "Accumulated Depreciation - Vehicles", type: "asset" },
  {
    code: "1043",
    name: "Accumulated Depreciation - Furniture & Fixtures",
    type: "asset",
  },

  // Other Assets
  { code: "1050", name: "Security Deposits", type: "asset" },
  { code: "1051", name: "Long-Term Prepaid Expenses", type: "asset" },
  { code: "1052", name: "Deferred Tax Assets", type: "asset" },

  // LIABILITIES (2000-2999)
  // Current Liabilities
  { code: "2000", name: "Accounts Payable - Trade", type: "liability" },
  { code: "2001", name: "Accounts Payable - Employee", type: "liability" },
  { code: "2002", name: "Accounts Payable - Taxes", type: "liability" },
  { code: "2003", name: "Accrued Expenses - Salaries", type: "liability" },
  { code: "2004", name: "Accrued Expenses - Utilities", type: "liability" },
  { code: "2005", name: "Accrued Expenses - Taxes", type: "liability" },
  { code: "2006", name: "Short-Term Loans", type: "liability" },
  { code: "2007", name: "Customer Deposits", type: "liability" },
  { code: "2008", name: "Unearned Revenue - Service", type: "liability" },
  { code: "2009", name: "Unearned Revenue - Rent", type: "liability" },
  { code: "2010", name: "Notes Payable - Short-Term", type: "liability" },
  {
    code: "2011",
    name: "Current Portion of Long-Term Debt",
    type: "liability",
  },
  { code: "2012", name: "Sales Taxes Payable", type: "liability" },
  { code: "2013", name: "Payroll Taxes Payable", type: "liability" },
  { code: "2014", name: "Deferred Revenue - Memberships", type: "liability" },
  { code: "2015", name: "Deferred Revenue - Subscriptions", type: "liability" },

  // Non-Current Liabilities
  { code: "2020", name: "Notes Payable - Long-Term", type: "liability" },
  { code: "2021", name: "Bank Loans - Long-Term", type: "liability" },
  { code: "2022", name: "Mortgage Payable", type: "liability" },
  { code: "2023", name: "Bonds Payable", type: "liability" },
  { code: "2024", name: "Deferred Tax Liabilities", type: "liability" },
  { code: "2025", name: "Pension Liabilities", type: "liability" },
  { code: "2026", name: "Capital Lease Obligations", type: "liability" },
  { code: "2027", name: "Contingent Liabilities", type: "liability" },
  { code: "2028", name: "Long-Term Customer Deposits", type: "liability" },

  // Other Liabilities
  { code: "2030", name: "Income Tax Payable", type: "liability" },
  { code: "2031", name: "Interest Payable", type: "liability" },
  { code: "2032", name: "Legal Liabilities", type: "liability" },
  { code: "2033", name: "Environmental Liabilities", type: "liability" },

  // EQUITY (3000-3999)
  { code: "3000", name: "Owner's Equity - Capital", type: "equity" },
  { code: "3001", name: "Partner's Capital", type: "equity" },
  { code: "3002", name: "Common Stock", type: "equity" },
  { code: "3003", name: "Preferred Stock", type: "equity" },
  { code: "3004", name: "Additional Paid-In Capital", type: "equity" },
  { code: "3005", name: "Treasury Stock", type: "equity" },
  { code: "3006", name: "Retained Earnings", type: "equity" },
  {
    code: "3007",
    name: "Accumulated Other Comprehensive Income",
    type: "equity",
  },
  { code: "3008", name: "Owner's Drawings", type: "equity" },
  { code: "3009", name: "Dividends Declared", type: "equity" },
  { code: "3010", name: "Stock Options Outstanding", type: "equity" },
  { code: "3011", name: "Minority Interest", type: "equity" },

  // REVENUE (4000-4999)
  // Primary Revenue
  { code: "4000", name: "Revenue - Sales - Product", type: "revenue" },
  { code: "4001", name: "Revenue - Sales - Service", type: "revenue" },
  { code: "4002", name: "Revenue - Sales - Online Sales", type: "revenue" },
  { code: "4003", name: "Revenue - Sales - Wholesale", type: "revenue" },
  { code: "4004", name: "Revenue - Subscription Sales", type: "revenue" },
  { code: "4005", name: "Revenue - Membership Fees", type: "revenue" },
  { code: "4006", name: "Revenue - Licensing Income", type: "revenue" },

  // Other Revenue
  { code: "4010", name: "Revenue - Rental Income", type: "revenue" },
  { code: "4011", name: "Revenue - Consulting Fees", type: "revenue" },
  { code: "4012", name: "Revenue - Interest Income", type: "revenue" },
  { code: "4013", name: "Revenue - Dividend Income", type: "revenue" },
  { code: "4014", name: "Revenue - Commission Income", type: "revenue" },
  { code: "4015", name: "Revenue - Royalty Income", type: "revenue" },
  { code: "4016", name: "Revenue - Gain on Sale of Assets", type: "revenue" },
  { code: "4017", name: "Revenue - Foreign Exchange Gains", type: "revenue" },
  { code: "4018", name: "Revenue - Other Income", type: "revenue" },

  // Contra-Revenue Accounts
  { code: "4020", name: "Sales Returns and Allowances", type: "revenue" },
  { code: "4021", name: "Sales Discounts", type: "revenue" },
  { code: "4022", name: "Customer Refunds", type: "revenue" },
  { code: "4023", name: "Bad Debt Recovery", type: "revenue" },

  // EXPENSES (5000-5999)
  // Cost of Goods Sold (COGS)
  { code: "5000", name: "Cost of Goods Sold - Raw Materials", type: "expense" },
  { code: "5001", name: "Cost of Goods Sold - Direct Labor", type: "expense" },
  {
    code: "5002",
    name: "Cost of Goods Sold - Manufacturing Overhead",
    type: "expense",
  },
  { code: "5003", name: "Cost of Goods Sold - Shipping", type: "expense" },
  { code: "5004", name: "Cost of Goods Sold - Freight-in", type: "expense" },
  { code: "5005", name: "Cost of Goods Sold - Packaging", type: "expense" },

  // Operating Expenses
  {
    code: "5010",
    name: "Operating Expense - Salaries and Wages",
    type: "expense",
  },
  { code: "5010.1", name: "Salaries - Administrative", type: "expense" },
  { code: "5010.2", name: "Salaries - Sales", type: "expense" },
  { code: "5011", name: "Operating Expense - Rent", type: "expense" },
  { code: "5011.1", name: "Office Rent", type: "expense" },
  { code: "5011.2", name: "Warehouse Rent", type: "expense" },
  { code: "5011.3", name: "Retail Store Rent", type: "expense" },
  { code: "5012", name: "Operating Expense - Utilities", type: "expense" },
  { code: "5012.1", name: "Electricity", type: "expense" },
  { code: "5012.2", name: "Water", type: "expense" },
  { code: "5012.3", name: "Internet", type: "expense" },
  { code: "5012.4", name: "Telephone", type: "expense" },
  { code: "5013", name: "Operating Expense - Insurance", type: "expense" },
  { code: "5014", name: "Operating Expense - Advertising", type: "expense" },
  { code: "5014.1", name: "Digital Marketing", type: "expense" },
  { code: "5014.2", name: "Print Advertising", type: "expense" },
  { code: "5014.3", name: "Trade Shows and Events", type: "expense" },
  {
    code: "5015",
    name: "Operating Expense - Depreciation and Amortization",
    type: "expense",
  },
  { code: "5015.1", name: "Depreciation - Buildings", type: "expense" },
  { code: "5015.2", name: "Depreciation - Equipment", type: "expense" },
  { code: "5015.3", name: "Amortization - Intangibles", type: "expense" },
  {
    code: "5016",
    name: "Operating Expense - Travel and Entertainment",
    type: "expense",
  },
  { code: "5016.1", name: "Travel", type: "expense" },
  { code: "5016.2", name: "Meals and Entertainment", type: "expense" },
  { code: "5016.3", name: "Hotel and Lodging", type: "expense" },
  { code: "5016.4", name: "Airfare and Transportation", type: "expense" },

  // Non-Operating Expenses
  {
    code: "5020",
    name: "Non-Operating Expense - Interest Expense",
    type: "expense",
  },
  {
    code: "5021",
    name: "Non-Operating Expense - Bad Debt Expense",
    type: "expense",
  },
  {
    code: "5022",
    name: "Non-Operating Expense - Loss on Sale of Assets",
    type: "expense",
  },
  {
    code: "5023",
    name: "Non-Operating Expense - Foreign Exchange Losses",
    type: "expense",
  },
  {
    code: "5024",
    name: "Non-Operating Expense - Income Tax Expense",
    type: "expense",
  },
  { code: "5025", name: "Non-Operating Expense - Legal Fees", type: "expense" },
  {
    code: "5026",
    name: "Non-Operating Expense - Environmental Expenses",
    type: "expense",
  },

  // Other Expenses
  {
    code: "5030",
    name: "Other Expense - Donations and Contributions",
    type: "expense",
  },
  {
    code: "5031",
    name: "Other Expense - Research and Development",
    type: "expense",
  },
  { code: "5032", name: "Other Expense - Bank Fees", type: "expense" },
  { code: "5033", name: "Other Expense - Professional Fees", type: "expense" },
  { code: "5033.1", name: "Consulting Fees", type: "expense" },
  { code: "5033.2", name: "Audit Fees", type: "expense" },
  {
    code: "5034",
    name: "Other Expense - Software Subscriptions",
    type: "expense",
  },
  { code: "5035", name: "Other Expense - Licensing Fees", type: "expense" },
];

// Function to seed default accounts for a new user
async function seedDefaultAccounts(userId) {
  try {
    for (const account of defaultAccounts) {
      await db.run(
        "INSERT INTO accounts (user_id, code, name, type) VALUES (?, ?, ?, ?)",
        [userId, account.code, account.name, account.type]
      );
    }
    console.log(`Default accounts seeded for user ${userId}`);
  } catch (error) {
    console.error("Error seeding default accounts:", error);
    throw error;
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// Database initialization
let db;

async function initDatabase() {
  db = await open({
    filename: path.join(__dirname, "accounting.db"),
    driver: sqlite3.Database,
  });

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      balance REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, code)
    );

    CREATE TABLE IF NOT EXISTS journal_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      description TEXT NOT NULL,
      is_adjusting INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS journal_entry_lines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entry_id INTEGER NOT NULL,
      account_id INTEGER NOT NULL,
      debit REAL DEFAULT 0,
      credit REAL DEFAULT 0,
      FOREIGN KEY (entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE,
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_accounts_user ON accounts(user_id);
    CREATE INDEX IF NOT EXISTS idx_journal_user ON journal_entries(user_id);
    CREATE INDEX IF NOT EXISTS idx_lines_entry ON journal_entry_lines(entry_id);
  `);

  console.log("Database initialized successfully");
}

// Function to create default accounts for a new user
async function createDefaultAccounts(userId) {
  const defaultAccounts = [
    // Assets
    { code: "1000", name: "Cash", type: "asset" },
    { code: "1100", name: "Accounts Receivable", type: "asset" },
    { code: "1200", name: "Inventory", type: "asset" },
    { code: "1300", name: "Prepaid Expenses", type: "asset" },
    { code: "1500", name: "Equipment", type: "asset" },
    { code: "1600", name: "Accumulated Depreciation", type: "asset" },

    // Liabilities
    { code: "2000", name: "Accounts Payable", type: "liability" },
    { code: "2100", name: "Accrued Expenses", type: "liability" },
    { code: "2200", name: "Short-term Notes Payable", type: "liability" },
    { code: "2300", name: "Long-term Debt", type: "liability" },

    // Equity
    { code: "3000", name: "Common Stock", type: "equity" },
    { code: "3100", name: "Retained Earnings", type: "equity" },

    // Revenue
    { code: "4000", name: "Sales Revenue", type: "revenue" },
    { code: "4100", name: "Service Revenue", type: "revenue" },
    { code: "4200", name: "Interest Revenue", type: "revenue" },

    // Expenses
    { code: "5000", name: "Cost of Goods Sold", type: "expense" },
    { code: "6000", name: "Salaries Expense", type: "expense" },
    { code: "6100", name: "Rent Expense", type: "expense" },
    { code: "6200", name: "Utilities Expense", type: "expense" },
    { code: "6300", name: "Depreciation Expense", type: "expense" },
    { code: "6400", name: "Interest Expense", type: "expense" },
    { code: "6500", name: "Office Supplies", type: "expense" },
  ];

  try {
    for (const account of defaultAccounts) {
      await db.run(
        "INSERT INTO accounts (user_id, code, name, type) VALUES (?, ?, ?, ?)",
        [userId, account.code, account.name, account.type]
      );
    }
    console.log(`Default accounts created for user ${userId}`);
  } catch (error) {
    console.error("Error creating default accounts:", error);
    throw error;
  }
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// ==================== AUTHENTICATION ROUTES ====================

// Register new user
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await db.get("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await db.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    // Seed default accounts for the new user
    await seedDefaultAccounts(result.lastID);

    // Generate token
    const token = jwt.sign({ id: result.lastID, email, name }, JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: result.lastID,
        name,
        email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// Login user
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Update last login
    await db.run(
      "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?",
      [user.id]
    );

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

// Verify token
app.get("/api/auth/verify", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// ==================== ACCOUNTS ROUTES ====================

// Get all accounts for user
app.get("/api/accounts", authenticateToken, async (req, res) => {
  try {
    const accounts = await db.all(
      "SELECT * FROM accounts WHERE user_id = ? ORDER BY code",
      [req.user.id]
    );
    res.json(accounts);
  } catch (error) {
    console.error("Get accounts error:", error);
    res.status(500).json({ error: "Error fetching accounts" });
  }
});

// Create new account
app.post("/api/accounts", authenticateToken, async (req, res) => {
  try {
    const { code, name, type } = req.body;

    if (!code || !name || !type) {
      return res
        .status(400)
        .json({ error: "Code, name, and type are required" });
    }

    // Check if code already exists for this user
    const existing = await db.get(
      "SELECT * FROM accounts WHERE user_id = ? AND code = ?",
      [req.user.id, code]
    );

    if (existing) {
      return res.status(400).json({ error: "Account code already exists" });
    }

    const result = await db.run(
      "INSERT INTO accounts (user_id, code, name, type) VALUES (?, ?, ?, ?)",
      [req.user.id, code, name, type]
    );

    const account = await db.get("SELECT * FROM accounts WHERE id = ?", [
      result.lastID,
    ]);

    res.status(201).json(account);
  } catch (error) {
    console.error("Create account error:", error);
    res.status(500).json({ error: "Error creating account" });
  }
});

// Update account
app.put("/api/accounts/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, type } = req.body;

    // Verify account belongs to user
    const account = await db.get(
      "SELECT * FROM accounts WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    await db.run(
      "UPDATE accounts SET code = ?, name = ?, type = ? WHERE id = ? AND user_id = ?",
      [code, name, type, id, req.user.id]
    );

    const updated = await db.get("SELECT * FROM accounts WHERE id = ?", [id]);
    res.json(updated);
  } catch (error) {
    console.error("Update account error:", error);
    res.status(500).json({ error: "Error updating account" });
  }
});

// Delete account
app.delete("/api/accounts/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify account belongs to user
    const account = await db.get(
      "SELECT * FROM accounts WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    await db.run("DELETE FROM accounts WHERE id = ? AND user_id = ?", [
      id,
      req.user.id,
    ]);

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ error: "Error deleting account" });
  }
});

// Seed default accounts for existing user
app.post("/api/accounts/seed-defaults", authenticateToken, async (req, res) => {
  try {
    // Get existing accounts for this user
    const existingAccounts = await db.all(
      "SELECT code FROM accounts WHERE user_id = ?",
      [req.user.id]
    );

    const existingCodes = new Set(existingAccounts.map((acc) => acc.code));
    const missingAccounts = defaultAccounts.filter(
      (account) => !existingCodes.has(account.code)
    );

    if (missingAccounts.length === 0) {
      return res.json({
        message: "All default accounts already exist",
        seeded: 0,
        total: defaultAccounts.length,
      });
    }

    // Insert only missing accounts
    for (const account of missingAccounts) {
      await db.run(
        "INSERT INTO accounts (user_id, code, name, type) VALUES (?, ?, ?, ?)",
        [req.user.id, account.code, account.name, account.type]
      );
    }

    res.json({
      message: `Seeded ${missingAccounts.length} missing default accounts`,
      seeded: missingAccounts.length,
      total: defaultAccounts.length,
    });
  } catch (error) {
    console.error("Seed default accounts error:", error);
    res.status(500).json({ error: "Error seeding default accounts" });
  }
});

// ==================== JOURNAL ENTRIES ROUTES ====================

// Get all journal entries for user
app.get("/api/journal-entries", authenticateToken, async (req, res) => {
  try {
    const { is_adjusting } = req.query;
    const adjusting = is_adjusting === "true" ? 1 : 0;

    // Get all entries
    const entries = await db.all(
      `SELECT * FROM journal_entries 
       WHERE user_id = ? AND is_adjusting = ?
       ORDER BY date DESC, created_at DESC`,
      [req.user.id, adjusting]
    );

    // Get all lines for these entries
    const entryIds = entries.map((e) => e.id);
    let allLines = [];
    if (entryIds.length > 0) {
      const placeholders = entryIds.map(() => "?").join(",");
      allLines = await db.all(
        `SELECT jel.*, a.name as account_name 
         FROM journal_entry_lines jel
         LEFT JOIN accounts a ON jel.account_id = a.id
         WHERE jel.entry_id IN (${placeholders})
         ORDER BY jel.entry_id, jel.id`,
        entryIds
      );
    }

    // Group lines by entry_id
    const linesByEntry = {};
    allLines.forEach((line) => {
      if (!linesByEntry[line.entry_id]) {
        linesByEntry[line.entry_id] = [];
      }
      linesByEntry[line.entry_id].push({
        id: line.id,
        accountId: line.account_id.toString(),
        accountName: line.account_name || "",
        debit: line.debit.toString(),
        credit: line.credit.toString(),
      });
    });

    // Combine entries with their lines
    const formattedEntries = entries.map((entry) => ({
      id: entry.id,
      date: entry.date,
      description: entry.description,
      isAdjusting: entry.is_adjusting === 1,
      lines: linesByEntry[entry.id] || [],
      createdAt: entry.created_at,
    }));

    res.json(formattedEntries);
  } catch (error) {
    console.error("Get journal entries error:", error);
    res.status(500).json({ error: "Error fetching journal entries" });
  }
});

app.post("/api/journal-entries", authenticateToken, async (req, res) => {
  try {
    const { date, description, lines, isAdjusting } = req.body;

    console.log("Creating journal entry with data:", {
      date,
      description,
      lines,
      isAdjusting,
    });

    if (!date || !description || !lines || lines.length < 2) {
      return res.status(400).json({
        error: "Date, description, and at least 2 lines are required",
      });
    }

    // Validate debits equal credits
    let totalDebits = 0;
    let totalCredits = 0;
    lines.forEach((line) => {
      totalDebits += parseFloat(line.debit) || 0;
      totalCredits += parseFloat(line.credit) || 0;
    });

    console.log("Totals:", { totalDebits, totalCredits });

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      return res.status(400).json({
        error: "Total debits must equal total credits",
      });
    }

    // Validate that all account IDs exist for this user
    for (const line of lines) {
      const account = await db.get(
        "SELECT id FROM accounts WHERE id = ? AND user_id = ?",
        [line.accountId, req.user.id]
      );
      if (!account) {
        console.log(
          "Account not found:",
          line.accountId,
          "for user:",
          req.user.id
        );
        return res.status(400).json({
          error: `Account with ID ${line.accountId} not found`,
        });
      }
    }

    // Start transaction
    await db.run("BEGIN TRANSACTION");

    try {
      // Insert journal entry
      const entryResult = await db.run(
        "INSERT INTO journal_entries (user_id, date, description, is_adjusting) VALUES (?, ?, ?, ?)",
        [req.user.id, date, description, isAdjusting ? 1 : 0]
      );

      const entryId = entryResult.lastID;
      console.log("Journal entry created with ID:", entryId);

      // Insert lines
      for (const line of lines) {
        await db.run(
          "INSERT INTO journal_entry_lines (entry_id, account_id, debit, credit) VALUES (?, ?, ?, ?)",
          [
            entryId,
            line.accountId,
            parseFloat(line.debit) || 0,
            parseFloat(line.credit) || 0,
          ]
        );
      }

      await db.run("COMMIT");
      console.log("Transaction committed successfully");

      // Fetch complete entry with lines
      const entry = await db.get("SELECT * FROM journal_entries WHERE id = ?", [
        entryId,
      ]);

      const fetchedLines = await db.all(
        `SELECT jel.*, a.name as account_name 
         FROM journal_entry_lines jel
         LEFT JOIN accounts a ON jel.account_id = a.id
         WHERE jel.entry_id = ?
         ORDER BY jel.id`,
        [entryId]
      );

      const formattedEntry = {
        id: entry.id,
        date: entry.date,
        description: entry.description,
        isAdjusting: entry.is_adjusting === 1,
        lines: fetchedLines.map((line) => ({
          id: line.id,
          accountId: line.account_id.toString(),
          accountName: line.account_name || "",
          debit: line.debit.toString(),
          credit: line.credit.toString(),
        })),
        createdAt: entry.created_at,
      };

      res.status(201).json(formattedEntry);
    } catch (error) {
      await db.run("ROLLBACK");
      console.error("Transaction rolled back:", error);
      throw error;
    }
  } catch (error) {
    console.error("Create journal entry error:", error);
    res
      .status(500)
      .json({ error: "Error creating journal entry", details: error.message });
  }
});

// Update journal entry
app.put("/api/journal-entries/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, description, lines, isAdjusting } = req.body;

    // Verify entry belongs to user
    const entry = await db.get(
      "SELECT * FROM journal_entries WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );

    if (!entry) {
      return res.status(404).json({ error: "Journal entry not found" });
    }

    // Validate debits equal credits
    let totalDebits = 0;
    let totalCredits = 0;
    lines.forEach((line) => {
      totalDebits += parseFloat(line.debit) || 0;
      totalCredits += parseFloat(line.credit) || 0;
    });

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      return res.status(400).json({
        error: "Total debits must equal total credits",
      });
    }

    // Start transaction
    await db.run("BEGIN TRANSACTION");

    try {
      // Update entry
      await db.run(
        "UPDATE journal_entries SET date = ?, description = ?, is_adjusting = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [date, description, isAdjusting ? 1 : 0, id]
      );

      // Delete old lines
      await db.run("DELETE FROM journal_entry_lines WHERE entry_id = ?", [id]);

      // Insert new lines
      for (const line of lines) {
        await db.run(
          "INSERT INTO journal_entry_lines (entry_id, account_id, debit, credit) VALUES (?, ?, ?, ?)",
          [
            id,
            line.accountId,
            parseFloat(line.debit) || 0,
            parseFloat(line.credit) || 0,
          ]
        );
      }

      await db.run("COMMIT");

      // Fetch updated entry with lines
      const updatedEntry = await db.get(
        "SELECT * FROM journal_entries WHERE id = ?",
        [id]
      );

      const fetchedLines = await db.all(
        `SELECT jel.*, a.name as account_name 
         FROM journal_entry_lines jel
         LEFT JOIN accounts a ON jel.account_id = a.id
         WHERE jel.entry_id = ?
         ORDER BY jel.id`,
        [id]
      );

      const formattedEntry = {
        id: updatedEntry.id,
        date: updatedEntry.date,
        description: updatedEntry.description,
        isAdjusting: updatedEntry.is_adjusting === 1,
        lines: fetchedLines.map((line) => ({
          id: line.id,
          accountId: line.account_id.toString(),
          accountName: line.account_name || "",
          debit: line.debit.toString(),
          credit: line.credit.toString(),
        })),
        createdAt: updatedEntry.created_at,
      };

      res.json(formattedEntry);
    } catch (error) {
      await db.run("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("Update journal entry error:", error);
    res.status(500).json({ error: "Error updating journal entry" });
  }
});

// Delete journal entry
app.delete("/api/journal-entries/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify entry belongs to user
    const entry = await db.get(
      "SELECT * FROM journal_entries WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );

    if (!entry) {
      return res.status(404).json({ error: "Journal entry not found" });
    }

    // Delete entry (lines will be deleted via CASCADE)
    await db.run("DELETE FROM journal_entries WHERE id = ? AND user_id = ?", [
      id,
      req.user.id,
    ]);

    res.json({ message: "Journal entry deleted successfully" });
  } catch (error) {
    console.error("Delete journal entry error:", error);
    res.status(500).json({ error: "Error deleting journal entry" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Start server
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });
