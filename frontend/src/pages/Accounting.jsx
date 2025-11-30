import React from "react";
import { PlusCircle, ChevronDown } from "lucide-react";

const Accounting = ({
  accounts,
  newAccount,
  setNewAccount,
  addNewAccount,
  t,
}) => {
  // Dynamic placeholders based on account type
  const getPlaceholders = (type) => {
    const placeholders = {
      asset: {
        code: "e.g., 1001, 1002",
        name: "e.g., Cash, Accounts Receivable",
      },
      liability: {
        code: "e.g., 2001, 2002",
        name: "e.g., Accounts Payable, Bank Loan",
      },
      equity: {
        code: "e.g., 3001, 3002",
        name: "e.g., Owner's Capital, Retained Earnings",
      },
      revenue: {
        code: "e.g., 4001, 4002",
        name: "e.g., Sales Revenue, Service Revenue",
      },
      expense: {
        code: "e.g., 5001, 5002",
        name: "e.g., Rent Expense, Salary Expense",
      },
    };
    return (
      placeholders[type] || { code: "e.g., 1001", name: "e.g., Account Name" }
    );
  };

  const placeholders = getPlaceholders(newAccount.type);

  return (
    <div
      className={`rounded-xl ${t.cardBg} ${t.shadow} p-6 md:p-8 ${t.border} backdrop-blur-xl transition-all duration-300 hover:shadow-2xl group relative overflow-hidden`}
    >
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute top-4 right-4 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
      <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping animation-delay-200"></div>

      {/* Enhanced Header */}
      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div
          className={`p-3 rounded-2xl ${t.glass} group-hover:scale-110 transition-all duration-500`}
        >
          <PlusCircle
            size={24}
            className="text-purple-400 group-hover:text-pink-400 transition-colors duration-300"
          />
        </div>
        <div>
          <h2
            className={`text-3xl font-black tracking-wider bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent`}
          >
            ADD NEW ACCOUNT
          </h2>
          <p className={`text-sm ${t.text} opacity-70 mt-1`}>
            Create a new account for your chart of accounts
          </p>
        </div>
      </div>

      <form onSubmit={addNewAccount} className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative group">
            <label
              className={`block text-sm font-mono mb-2 ${t.text} transition-colors duration-300 font-bold`}
              htmlFor="accType"
            >
              Account Type
            </label>
            <div className="relative">
              <select
                id="accType"
                value={newAccount.type}
                onChange={(e) =>
                  setNewAccount({
                    ...newAccount,
                    type: e.target.value,
                  })
                }
                className={`w-full px-4 py-3 border rounded-xl ${t.input} transition-all duration-300 focus:scale-[1.02] focus:shadow-xl appearance-none cursor-pointer font-medium`}
                required
              >
                <option value="" disabled>
                  Select Type
                </option>
                <option value="asset">Asset</option>
                <option value="liability">Liability</option>
                <option value="equity">Equity</option>
                <option value="revenue">Revenue</option>
                <option value="expense">Expense</option>
              </select>
              <ChevronDown
                size={18}
                className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${t.text} opacity-50 transition-transform duration-300 group-hover:scale-110`}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          <div className="relative group">
            <label
              className={`block text-sm font-mono mb-2 ${t.text} transition-colors duration-300 font-bold`}
              htmlFor="accCode"
            >
              Account Code
            </label>
            <div className="relative">
              <input
                id="accCode"
                type="text"
                value={newAccount.code}
                onChange={(e) =>
                  setNewAccount({
                    ...newAccount,
                    code: e.target.value,
                  })
                }
                className={`w-full px-4 py-3 border rounded-xl ${t.input} transition-all duration-300 focus:scale-[1.02] focus:shadow-xl placeholder:text-gray-500 font-mono`}
                placeholder={placeholders.code}
                required
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          <div className="relative group">
            <label
              className={`block text-sm font-mono mb-2 ${t.text} transition-colors duration-300 font-bold`}
              htmlFor="accName"
            >
              Account Name
            </label>
            <div className="relative">
              <input
                id="accName"
                type="text"
                value={newAccount.name}
                onChange={(e) =>
                  setNewAccount({
                    ...newAccount,
                    name: e.target.value,
                  })
                }
                className={`w-full px-4 py-3 border rounded-xl ${t.input} transition-all duration-300 focus:scale-[1.02] focus:shadow-xl placeholder:text-gray-500`}
                placeholder={placeholders.name}
                required
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            className={`flex items-center gap-3 px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl group bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600`}
          >
            <div className="p-1 rounded-lg bg-white/20 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300">
              <PlusCircle size={20} />
            </div>
            Add Account
          </button>
          <button
            type="button"
            onClick={() => setNewAccount({ code: "", name: "", type: "asset" })}
            className={`px-8 py-3 rounded-xl font-bold border-2 ${t.border} ${t.text} transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gray-700/50`}
          >
            Clear
          </button>
        </div>
      </form>
      <hr className="my-8 border-neutral-700" />
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${t.glass}`}>
            <PlusCircle size={20} className={t.secondaryAccent} />
          </div>
          <div>
            <h3
              className={`text-xl font-bold ${t.secondaryAccent} bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent`}
            >
              CHART OF ACCOUNTS
            </h3>
            <p className={`text-sm ${t.text} opacity-70 mt-1`}>
              Complete account listing with details
            </p>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-lg text-xs font-medium ${t.glass} ${t.text}`}
        >
          {accounts.length} Accounts
        </div>
      </div>

      <div
        className={`overflow-x-auto max-h-80 border ${t.border} rounded-lg backdrop-blur-sm`}
      >
        <table className="w-full divide-y divide-neutral-700">
          <thead className={`${t.tableHeader} sticky top-0 z-10`}>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-mono uppercase w-20">
                Code
              </th>
              <th className="px-3 py-2 text-left text-xs font-mono uppercase min-w-32">
                Name
              </th>
              <th className="px-3 py-2 text-left text-xs font-mono uppercase w-24">
                Type
              </th>
              <th className="px-3 py-2 text-left text-xs font-mono uppercase w-24">
                Category
              </th>
              <th className="px-3 py-2 text-left text-xs font-mono uppercase w-20">
                Status
              </th>
              <th className="px-3 py-2 text-center text-xs font-mono uppercase w-16">
                ID
              </th>
            </tr>
          </thead>
          <tbody className={`${t.cardBg} divide-y divide-neutral-700/50`}>
            {accounts
              .sort((a, b) => a.code.localeCompare(b.code))
              .map((acc, index) => (
                <tr
                  key={acc.id}
                  className={`${t.tableRow} hover:bg-white/5 transition-colors duration-200`}
                >
                  <td
                    className={`px-3 py-2 text-xs font-mono ${t.accent} font-semibold`}
                  >
                    {acc.code}
                  </td>
                  <td
                    className={`px-3 py-2 text-xs ${t.text} font-medium truncate max-w-48`}
                  >
                    {acc.name}
                  </td>
                  <td className={`px-3 py-2 text-xs`}>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        acc.type === "asset"
                          ? "bg-blue-500/20 text-blue-400"
                          : acc.type === "liability"
                          ? "bg-orange-500/20 text-orange-400"
                          : acc.type === "equity"
                          ? "bg-purple-500/20 text-purple-400"
                          : acc.type === "revenue"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {acc.type}
                    </span>
                  </td>
                  <td className={`px-3 py-2 text-xs ${t.text} opacity-70`}>
                    {acc.type === "asset"
                      ? "Balance Sheet"
                      : acc.type === "liability"
                      ? "Balance Sheet"
                      : acc.type === "equity"
                      ? "Balance Sheet"
                      : acc.type === "revenue"
                      ? "Income Statement"
                      : "Income Statement"}
                  </td>
                  <td className={`px-3 py-2 text-xs`}>
                    <span className={`inline-flex items-center gap-1`}>
                      <div
                        className={`w-2 h-2 rounded-full animate-pulse ${
                          index % 3 === 0
                            ? "bg-green-400 shadow-lg shadow-green-400/50"
                            : index % 3 === 1
                            ? "bg-yellow-400 shadow-lg shadow-yellow-400/50"
                            : "bg-gray-400"
                        }`}
                      ></div>
                      <span
                        className={`font-bold ${
                          index % 3 === 0
                            ? "text-green-400 drop-shadow-lg"
                            : index % 3 === 1
                            ? "text-yellow-400 drop-shadow-lg"
                            : "text-gray-400"
                        }`}
                      >
                        {index % 3 === 0
                          ? "ACTIVE"
                          : index % 3 === 1
                          ? "REVIEW"
                          : "INACTIVE"}
                      </span>
                    </span>
                  </td>
                  <td
                    className={`px-3 py-2 text-xs text-center ${t.text} opacity-50 font-mono`}
                  >
                    #{acc.id}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Accounting;
