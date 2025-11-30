import React from "react";
import { PlusCircle, BookOpen, PenTool, Calendar, X } from "lucide-react";
import JournalEntryForm from "../components/JournalEntryForm";
import JournalList from "../components/JournalList";

const Journal = ({
  isAdjusting,
  entries,
  showForm,
  setShowForm,
  newEntry,
  setNewEntry,
  accounts,
  saveJournalEntry,
  saveAdjustingEntry,
  resetForm,
  editEntry,
  deleteEntry,
  editingEntry,
  t,
}) => {
  const title = isAdjusting ? "ADJUSTING ENTRIES" : "JOURNAL ENTRIES";
  const saveEntry = isAdjusting ? saveAdjustingEntry : saveJournalEntry;
  const isEditing = !!editingEntry && editingEntry.isAdjusting === isAdjusting;

  const cancelForm = () => {
    resetForm();
    setShowForm(false);
  };

  return (
    <div
      className={`rounded-xl ${t.cardBg} ${t.shadow} p-6 md:p-8 ${t.border} backdrop-blur-xl transition-all duration-300 hover:shadow-2xl group relative overflow-hidden`}
    >
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-400 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute top-4 right-4 w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
      <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping animation-delay-200"></div>

      {/* Enhanced Header */}
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-2xl ${t.glass} group-hover:scale-110 transition-all duration-500`}
          >
            {isAdjusting ? (
              <PenTool
                size={24}
                className="text-orange-400 group-hover:text-orange-300 transition-colors duration-300"
              />
            ) : (
              <BookOpen
                size={24}
                className="text-cyan-400 group-hover:text-blue-400 transition-colors duration-300"
              />
            )}
          </div>
          <div>
            <h2
              className={`text-3xl font-black tracking-wider bg-gradient-to-r ${
                isAdjusting
                  ? "from-orange-400 to-red-400"
                  : "from-cyan-400 to-blue-400"
              } bg-clip-text text-transparent`}
            >
              {title}
            </h2>
            <p className={`text-sm ${t.text} opacity-70 mt-1`}>
              {isAdjusting
                ? "End-of-period adjustments and corrections"
                : "Record daily business transactions"}
            </p>
          </div>
        </div>

        {/* Enhanced New Entry Button */}
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl group ${
            isAdjusting
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
              : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
          }`}
        >
          <div className="p-1 rounded-lg bg-white/20 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300">
            <PlusCircle size={20} />
          </div>
          <span>New Entry</span>
        </button>
      </div>

      {/* Split Screen Layout */}
      <div className="relative z-10">
        <div
          className={`transition-all duration-500 ease-in-out ${
            showForm && (isEditing || !editingEntry)
              ? "opacity-100 scale-100"
              : "opacity-100 scale-100"
          }`}
        >
          {showForm && (isEditing || !editingEntry) ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 transition-all duration-500 ease-in-out">
              {/* Left Side - New Journal Entry Form */}
              <div
                className={`lg:col-span-2 rounded-2xl ${
                  t.glass
                } p-6 border border-white/10 backdrop-blur-xl transition-all duration-500 ease-in-out transform ${
                  showForm
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-full opacity-0"
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className={t.secondaryAccent} />
                    <span className={`text-sm font-bold ${t.secondaryAccent}`}>
                      NEW JOURNAL ENTRY
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={cancelForm}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      isAdjusting
                        ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800"
                        : "bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700"
                    }`}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
                <JournalEntryForm
                  newEntry={newEntry}
                  setNewEntry={setNewEntry}
                  accounts={accounts}
                  saveEntry={saveEntry}
                  cancelForm={cancelForm}
                  isAdjusting={isAdjusting}
                  isEditing={isEditing}
                  t={t}
                />
              </div>

              {/* Right Side - Recorded Records */}
              <div
                className={`lg:col-span-3 rounded-2xl ${
                  t.glass
                } p-6 border border-white/10 backdrop-blur-xl transition-all duration-500 ease-in-out transform ${
                  showForm
                    ? "translate-x-0 opacity-100 scale-100"
                    : "translate-x-0 opacity-100 scale-105"
                }`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen size={16} className={t.secondaryAccent} />
                  <span className={`text-sm font-bold ${t.secondaryAccent}`}>
                    RECORDED ENTRIES
                  </span>
                </div>
                <JournalList
                  entries={entries}
                  accounts={accounts}
                  t={t}
                  editEntry={editEntry}
                  deleteEntry={deleteEntry}
                  isAdjusting={isAdjusting}
                />
              </div>
            </div>
          ) : (
            /* Records Section Covers Full Width When Form is Hidden */
            <div
              className={`rounded-2xl ${
                t.glass
              } p-6 border border-white/10 backdrop-blur-xl transition-all duration-500 ease-in-out transform ${
                showForm ? "scale-95 opacity-0" : "scale-100 opacity-100"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={16} className={t.secondaryAccent} />
                <span className={`text-sm font-bold ${t.secondaryAccent}`}>
                  RECORDED ENTRIES
                </span>
              </div>
              <JournalList
                entries={entries}
                accounts={accounts}
                t={t}
                editEntry={editEntry}
                deleteEntry={deleteEntry}
                isAdjusting={isAdjusting}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Journal;
