import React, { useContext } from "react";
import { Edit2, Trash2, Calendar, FileText, TrendingUp } from "lucide-react";
import { CurrencyContext } from "../contexts/CurrencyContext";

// Accepts editEntry, deleteEntry, and isAdjusting props
const JournalList = ({
  entries,
  accounts,
  t,
  editEntry,
  deleteEntry,
  isAdjusting,
}) => {
  const { formatAmount } = useContext(CurrencyContext);
  return (
    <div className="space-y-4">
      {entries.length === 0 ? (
        <div
          className={`text-center py-12 rounded-2xl ${t.glass} border border-white/10 backdrop-blur-xl`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-2xl bg-gray-700/30">
              <FileText size={32} className="text-gray-400" />
            </div>
            <div>
              <p className="text-gray-400 font-medium">No entries found</p>
              <p className="text-gray-500 text-sm mt-1">
                Create your first journal entry to get started
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`relative group rounded-2xl ${t.glass} border border-white/10 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] overflow-hidden`}
            >
              {/* Enhanced Header with Entry Info */}
              <div
                className={`px-6 py-4 border-b border-white/10 ${
                  t.cardBg
                } bg-gradient-to-r ${
                  isAdjusting
                    ? "from-orange-500/10 to-red-500/10"
                    : "from-cyan-500/10 to-blue-500/10"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isAdjusting ? "bg-orange-500/20" : "bg-cyan-500/20"
                      }`}
                    >
                      <Calendar
                        size={16}
                        className={
                          isAdjusting ? "text-orange-400" : "text-cyan-400"
                        }
                      />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${t.text}`}>
                        {entry.date}
                      </p>
                      <p className={`text-xs ${t.text} opacity-70 mt-1`}>
                        {isAdjusting ? "Adjusting Entry" : "Journal Entry"}
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Edit/Delete Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => editEntry(entry, isAdjusting)}
                      className={`group/btn flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        isAdjusting
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
                          : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
                      }`}
                      title="Edit Entry"
                    >
                      <div className="p-0.5 rounded bg-white/20 group-hover/btn:scale-110 transition-transform duration-300">
                        <Edit2 size={12} />
                      </div>
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEntry(entry.id, isAdjusting)}
                      className="group/btn flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600"
                      title="Delete Entry"
                    >
                      <div className="p-0.5 rounded bg-white/20 group-hover/btn:scale-110 transition-transform duration-300">
                        <Trash2 size={12} />
                      </div>
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className={`px-4 py-3 ${t.tableHeader}`}>
                    <tr>
                      <th
                        className={`px-6 py-3 text-left font-bold ${t.text} font-mono uppercase text-sm`}
                      >
                        Account
                      </th>
                      <th
                        className={`px-6 py-3 text-left font-bold ${t.text} font-mono uppercase text-sm`}
                      >
                        Description
                      </th>
                      <th
                        className={`px-6 py-3 text-right font-bold ${t.text} font-mono uppercase text-sm`}
                      >
                        Debit
                      </th>
                      <th
                        className={`px-6 py-3 text-right font-bold ${t.text} font-mono uppercase text-sm`}
                      >
                        Credit
                      </th>
                    </tr>
                  </thead>

                  <tbody className={`divide-y divide-white/5 ${t.cardBg}`}>
                    {entry.lines.map((line, index) => {
                      const account = accounts.find(
                        (a) => a.id === parseInt(line.accountId)
                      );
                      return (
                        <tr
                          key={index}
                          className={`${t.tableRow} transition-colors duration-200 hover:bg-white/5`}
                        >
                          <td
                            className={`px-6 py-3 text-sm font-medium ${t.text}`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  line.debit ? "bg-lime-400" : "bg-cyan-400"
                                }`}
                              ></div>
                              {account ? account.name : "Unknown Account"}
                            </div>
                          </td>
                          <td
                            className={`px-6 py-3 text-sm ${t.text} font-mono opacity-80`}
                          >
                            {entry.description}
                          </td>
                          <td
                            className={`px-6 py-3 text-sm font-mono font-bold ${
                              line.debit ? "text-lime-400" : "text-slate-600"
                            } text-right`}
                          >
                            {line.debit
                              ? formatAmount(parseFloat(line.debit))
                              : "—"}
                          </td>
                          <td
                            className={`px-6 py-3 text-sm font-mono font-bold ${
                              line.credit ? "text-cyan-400" : "text-slate-600"
                            } text-right`}
                          >
                            {line.credit
                              ? formatAmount(parseFloat(line.credit))
                              : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Entry Summary Footer */}
              <div
                className={`px-6 py-3 border-t border-white/10 ${
                  t.cardBg
                } bg-gradient-to-r ${
                  isAdjusting
                    ? "from-orange-500/5 to-red-500/5"
                    : "from-cyan-500/5 to-blue-500/5"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} className={t.secondaryAccent} />
                    <span className={`text-xs font-mono ${t.text} opacity-70`}>
                      {entry.lines.length} line
                      {entry.lines.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs font-mono">
                    <span className={`${t.text} opacity-70`}>
                      Total Debit:{" "}
                      <span className="text-lime-400 font-bold">
                        {formatAmount(
                          entry.lines.reduce(
                            (sum, line) => sum + (parseFloat(line.debit) || 0),
                            0
                          )
                        )}
                      </span>
                    </span>
                    <span className={`${t.text} opacity-70`}>
                      Total Credit:{" "}
                      <span className="text-cyan-400 font-bold">
                        {formatAmount(
                          entry.lines.reduce(
                            (sum, line) => sum + (parseFloat(line.credit) || 0),
                            0
                          )
                        )}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalList;
