import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import './App.css';
import {
    Sun,
    Moon,
    Calculator,
    LogOut,
    Trash2,
    CheckCircle,
} from 'lucide-react';

// Import Layout Components
import Footer from './layout/Footer';
import CompanyHeader from './layout/CompanyHeader';
import Sidebar from './layout/Sidebar';

// Lazy load Page Components for better performance
const AuthPage = lazy(() => import('./pages/AuthPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Accounting = lazy(() => import('./pages/Accounting'));
const Journal = lazy(() => import('./pages/Journal'));
const GeneralLedger = lazy(() => import('./components/GeneralLedger'));
const TrialBalance = lazy(() => import('./components/TrialBalance'));
const IncomeStatement = lazy(() => import('./components/IncomeStatement'));
const BalanceSheet = lazy(() => import('./components/BalanceSheet'));

import { CurrencyProvider } from './contexts/CurrencyContext';
import {
    authAPI,
    accountsAPI,
    journalEntriesAPI,
    getToken,
    removeToken,
} from './utils/api';

// Main Component
const SmartAccountingManager = () => {
    // Theme State
    const [theme, setTheme] = useState('dark');
    const toggleTheme = () =>
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

    // Currency State
    const [currency, setCurrency] = useState('USD');
    const handleCurrencyChange = (newCurrency) => {
        setCurrency(newCurrency);
        localStorage.setItem('selectedCurrency', newCurrency);
    };

    // Load saved currency on mount
    useEffect(() => {
        const savedCurrency = localStorage.getItem('selectedCurrency');
        if (savedCurrency) {
            setCurrency(savedCurrency);
        }
    }, []);

    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    // App State
    const [activeTab, setActiveTab] = useState('dashboard');
    const [journalEntries, setJournalEntries] = useState([]);
    const [adjustingEntries, setAdjustingEntries] = useState([]);
    const [showJournalForm, setShowJournalForm] = useState(false);
    const [showAdjustingForm, setShowAdjustingForm] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    // Initialize accounts from API - empty initially
    const [accounts, setAccounts] = useState([]);

    // ...existing code...

    // --- Auth & Account Logic ---
    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setActiveTab('dashboard');
        removeToken();
        // Clear all data
        setAccounts([]);
        setJournalEntries([]);
        setAdjustingEntries([]);
    };

    // Load all user data from API
    const loadUserData = async () => {
        if (!getToken()) return;

        try {
            let accountsData = await accountsAPI.getAll();

            // Always try to seed missing default accounts
            console.log(
                `Found ${accountsData.length} existing accounts, checking for missing defaults...`
            );
            try {
                const seedResult = await accountsAPI.seedDefaults();
                console.log('Seed result:', seedResult);
                if (seedResult.seeded > 0) {
                    console.log(`Seeded ${seedResult.seeded} missing accounts`);
                    // Reload accounts after seeding
                    accountsData = await accountsAPI.getAll();
                }
            } catch (error) {
                console.error('Error seeding default accounts:', error);
            }

            setAccounts(
                accountsData.map((acc) => ({
                    ...acc,
                    balance: acc.balance || 0,
                }))
            );

            // Load journal entries
            const journalData = await journalEntriesAPI.getAll(false);
            setJournalEntries(journalData);

            // Load adjusting entries
            const adjustingData = await journalEntriesAPI.getAll(true);
            setAdjustingEntries(adjustingData);
        } catch (error) {
            console.error('Error loading user data:', error);
            // If token is invalid, logout
            if (
                error.message.includes('token') ||
                error.message.includes('401') ||
                error.message.includes('403')
            ) {
                handleLogout();
            }
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = getToken();
            if (token) {
                try {
                    const response = await authAPI.verify();
                    setUser(response.user);
                    setIsAuthenticated(true);
                    await loadUserData();
                } catch (error) {
                    console.error('Auth verification failed:', error);
                    removeToken();
                }
            }
        };
        checkAuth();
    }, []);

    const [newEntry, setNewEntry] = useState({
        date: new Date().toISOString().split('T')[0],
        description: '',
        lines: [
            { accountId: '', debit: '', credit: '' },
            { accountId: '', debit: '', credit: '' },
        ],
    });

    const [newAccount, setNewAccount] = useState({
        code: '',
        name: '',
        type: 'asset',
    });

    // --- Styling Definitions ---
    const themeClasses = {
        dark: {
            bg: 'bg-black',
            text: 'text-gray-100',
            cardBg: 'bg-gray-900/40 backdrop-blur-xl border border-white/10',
            border: 'border-cyan-500/20',
            accent: 'text-cyan-400',
            secondaryAccent: 'text-blue-400',
            shadow: 'shadow-2xl shadow-black/50',
            glass: 'bg-gray-900/30 backdrop-blur-lg border border-white/10',
            glassHover: 'hover:bg-gray-900/50 hover:border-white/20',
            input: 'bg-gray-800/50 backdrop-blur-md border-gray-700/50 text-white focus:ring-cyan-400/50 focus:border-cyan-400/50',
            tableHeader:
                'bg-gray-800/30 backdrop-blur-md text-gray-200 border border-white/5',
            tableRow:
                'even:bg-gray-900/20 hover:bg-gray-800/30 backdrop-blur-sm',
            buttonPrimary:
                'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/25 backdrop-blur-sm border border-white/10',
            buttonSecondary:
                'bg-gray-800/40 backdrop-blur-md text-gray-300 hover:bg-gray-700/50 border border-white/10',
            glassCard:
                'bg-gray-900/20 backdrop-blur-2xl border border-white/10 shadow-2xl',
            glassPanel:
                'bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl border border-white/5',
            statCard: {
                bg: 'bg-gray-800/60 backdrop-blur-lg border-white/20',
                text: 'text-gray-400',
                value: 'text-gray-100',
                icon: 'text-cyan-400',
            },
        },
        light: {
            bg: 'bg-gray-50',
            text: 'text-gray-900',
            cardBg: 'bg-white/70 backdrop-blur-xl border border-gray-200/50',
            border: 'border-blue-200/50',
            accent: 'text-blue-600',
            buttonPrimary:
                'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30',
            buttonSecondary:
                'bg-white/60 backdrop-blur-sm border-gray-300/60 hover:bg-gray-100/60 text-gray-900 hover:text-black',
            glassCard:
                'bg-white/60 backdrop-blur-xl border-gray-200/60 shadow-xl shadow-gray-500/10',
            secondaryAccent: 'text-blue-600 hover:text-blue-700',
            input: 'bg-white/80 backdrop-blur-sm border-gray-300/60 focus:border-blue-500/60 text-gray-900 placeholder-gray-600',
            statCard: {
                bg: 'bg-white/80 backdrop-blur-lg border-gray-300/70',
                text: 'text-gray-700',
                value: 'text-gray-900',
                icon: 'text-blue-600',
            },
        },
    };
    const t = themeClasses[theme];

    // --- Auth & Account Logic ---
    const handleLogin = async (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
        // Load user data after login
        await loadUserData();
    };

    const resetForm = () => {
        setNewEntry({
            date: new Date().toISOString().split('T')[0],
            description: '',
            lines: [
                { accountId: '', debit: '', credit: '' },
                { accountId: '', debit: '', credit: '' },
            ],
        });
        setEditingEntry(null);
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
        return (
            Math.abs(totalDebits - totalCredits) < 0.01 && validLineCount >= 2
        );
    };

    // --- Unified Save/Update Logic ---
    const saveEntryHandler = async (isAdjusting) => {
        const setEntries = isAdjusting
            ? setAdjustingEntries
            : setJournalEntries;
        const entries = isAdjusting ? adjustingEntries : journalEntries;

        if (!validateEntry(newEntry)) {
            alert(
                'Validation Error: Please ensure Debits equal Credits, you have at least 2 lines, and all required fields are filled.'
            );
            return;
        }

        try {
            // Format entry for API
            const entryData = {
                date: newEntry.date,
                description: newEntry.description,
                isAdjusting: isAdjusting,
                lines: newEntry.lines.map((line) => ({
                    accountId: parseInt(line.accountId),
                    debit: parseFloat(line.debit) || 0,
                    credit: parseFloat(line.credit) || 0,
                })),
            };

            if (editingEntry) {
                // UPDATE LOGIC: Update via API
                const updated = await journalEntriesAPI.update(
                    editingEntry.id,
                    entryData
                );
                setEntries(
                    entries.map((e) => (e.id === editingEntry.id ? updated : e))
                );
            } else {
                // CREATE LOGIC: Create via API
                const created = await journalEntriesAPI.create(entryData);
                setEntries([...entries, created]);
            }

            setShowSuccessAlert(true);
            setTimeout(() => setShowSuccessAlert(false), 3000);
            resetForm();
        } catch (error) {
            console.error('Error saving entry:', error);
            alert('Error saving entry: ' + error.message);
        }
    };

    const saveJournalEntry = () => saveEntryHandler(false);
    const saveAdjustingEntry = () => saveEntryHandler(true);

    // --- Edit Handler ---
    const editEntry = (entry, isAdjusting) => {
        // 1. Load the entry data into the form state
        // Ensure lines have accountName for the form to work properly
        setNewEntry({
            date: entry.date,
            description: entry.description,
            // Deep copy the lines and ensure accountName is set
            lines: entry.lines.map((line) => {
                // Find account name if not present
                const account = accounts.find(
                    (acc) => acc.id.toString() === line.accountId.toString()
                );
                return {
                    ...line,
                    accountName: line.accountName || account?.name || '',
                    entryType: parseFloat(line.debit) > 0 ? 'debit' : 'credit',
                };
            }),
        });

        // 2. Store the entry object ID to know which one to update later
        setEditingEntry({ id: entry.id, isAdjusting });

        // 3. Open the correct form and switch tab if necessary
        if (isAdjusting) {
            setShowAdjustingForm(true);
            setActiveTab('adjusting');
        } else {
            setShowJournalForm(true);
            setActiveTab('journal');
        }
    };

    // --- Delete Handler ---
    const deleteEntry = async (id, isAdjusting) => {
        const setEntries = isAdjusting
            ? setAdjustingEntries
            : setJournalEntries;
        const entries = isAdjusting ? adjustingEntries : journalEntries;

        try {
            await journalEntriesAPI.delete(id);
            // Filter out the entry with the given id
            setEntries(entries.filter((e) => e.id !== id));

            // If the deleted entry was the one being edited, reset the form
            if (editingEntry && editingEntry.id === id) {
                resetForm();
            }
            setShowDeleteAlert(true);
            setTimeout(() => setShowDeleteAlert(false), 3000);
        } catch (error) {
            console.error('Error deleting entry:', error);
            alert('Error deleting entry: ' + error.message);
        }
    };

    const addNewAccount = async (e) => {
        e.preventDefault();
        if (!newAccount.code || !newAccount.name) return;

        try {
            const created = await accountsAPI.create(
                newAccount.code,
                newAccount.name,
                newAccount.type
            );
            setAccounts([
                ...accounts,
                { ...created, balance: created.balance || 0 },
            ]);
            setNewAccount({ code: '', name: '', type: 'asset' });
            setShowSuccessAlert(true);
            setTimeout(() => setShowSuccessAlert(false), 3000);
        } catch (error) {
            console.error('Error creating account:', error);
            alert('Error creating account: ' + error.message);
        }
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
                    if (
                        account.type === 'asset' ||
                        account.type === 'expense'
                    ) {
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
                .filter((acc) => acc.type === 'asset')
                .reduce((sum, acc) => sum + (currentBalances[acc.id] || 0), 0);
        const getTotalLiabilities = () =>
            accounts
                .filter((acc) => acc.type === 'liability')
                .reduce((sum, acc) => sum + (currentBalances[acc.id] || 0), 0);

        const getIncomeStatement = () => {
            let totalRevenue = 0,
                totalExpenses = 0;
            accounts.forEach((account) => {
                const balance = currentBalances[account.id] || 0;
                if (account.type === 'revenue') totalRevenue += balance;
                else if (account.type === 'expense') totalExpenses += balance;
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
                .filter((acc) => acc.type === 'equity')
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
                    if (account.type === 'asset' || account.type === 'expense')
                        debitBalance = balance;
                    else creditBalance = balance;
                } else if (balance < 0) {
                    if (account.type === 'asset' || account.type === 'expense')
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
                        theme === 'dark'
                            ? 'radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
                            : 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)',
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
                                {activeTab.toUpperCase().replace('_', ' ')}
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
                                        <CheckCircle
                                            size={16}
                                            className="text-green-400"
                                        />
                                        Entry saved successfully!
                                    </span>
                                    <button
                                        onClick={() =>
                                            setShowSuccessAlert(false)
                                        }
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
                                        <Trash2
                                            size={16}
                                            className="text-red-400"
                                        />
                                        Entry deleted successfully!
                                    </span>
                                    <button
                                        onClick={() =>
                                            setShowDeleteAlert(false)
                                        }
                                        className="font-semibold hover:text-white transition-colors"
                                    >
                                        X
                                    </button>
                                </div>
                            )}

                            {/* Render Component based on activeTab */}
                            {activeTab === 'dashboard' && (
                                <Suspense
                                    fallback={
                                        <div className="flex items-center justify-center h-64">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                        </div>
                                    }
                                >
                                    <Dashboard
                                        getTotalAssets={getTotalAssets}
                                        getTotalLiabilities={
                                            getTotalLiabilities
                                        }
                                        getTotalEquity={getTotalEquity}
                                        incomeStatement={incomeStatement}
                                        journalEntries={journalEntries}
                                        accounts={accounts}
                                        t={t}
                                    />
                                </Suspense>
                            )}

                            {activeTab === 'accounting' && (
                                <Suspense
                                    fallback={
                                        <div className="flex items-center justify-center h-64">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                        </div>
                                    }
                                >
                                    <Accounting
                                        accounts={accounts}
                                        newAccount={newAccount}
                                        setNewAccount={setNewAccount}
                                        addNewAccount={addNewAccount}
                                        t={t}
                                    />
                                </Suspense>
                            )}

                            {activeTab === 'journal' && (
                                <Suspense
                                    fallback={
                                        <div className="flex items-center justify-center h-64">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                        </div>
                                    }
                                >
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
                                </Suspense>
                            )}

                            {activeTab === 'adjusting' && (
                                <Suspense
                                    fallback={
                                        <div className="flex items-center justify-center h-64">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                        </div>
                                    }
                                >
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
                                </Suspense>
                            )}

                            {activeTab === 'ledger' && (
                                <Suspense
                                    fallback={
                                        <div className="flex items-center justify-center h-64">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                        </div>
                                    }
                                >
                                    <GeneralLedger
                                        accounts={accounts}
                                        journalEntries={journalEntries}
                                        adjustingEntries={adjustingEntries}
                                        balances={balances}
                                        t={t}
                                    />
                                </Suspense>
                            )}

                            {activeTab === 'trial' && (
                                <Suspense
                                    fallback={
                                        <div className="flex items-center justify-center h-64">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                        </div>
                                    }
                                >
                                    <TrialBalance
                                        trialBalanceData={trialBalanceData}
                                        t={t}
                                        theme={theme}
                                    />
                                </Suspense>
                            )}

                            {activeTab === 'income' && (
                                <Suspense
                                    fallback={
                                        <div className="flex items-center justify-center h-64">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                        </div>
                                    }
                                >
                                    <IncomeStatement
                                        accounts={accounts}
                                        balances={balances}
                                        incomeStatement={incomeStatement}
                                        t={t}
                                    />
                                </Suspense>
                            )}

                            {activeTab === 'balance' && (
                                <Suspense
                                    fallback={
                                        <div className="flex items-center justify-center h-64">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                        </div>
                                    }
                                >
                                    <BalanceSheet
                                        accounts={accounts}
                                        balances={balances}
                                        getTotalAssets={getTotalAssets}
                                        getTotalLiabilities={
                                            getTotalLiabilities
                                        }
                                        getTotalEquity={getTotalEquity}
                                        incomeStatement={incomeStatement}
                                        t={t}
                                        theme={theme}
                                    />
                                </Suspense>
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
