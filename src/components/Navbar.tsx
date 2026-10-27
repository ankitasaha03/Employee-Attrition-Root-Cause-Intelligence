"use client";

import React from "react";
import {
  ShieldAlert,
  Bot,
  FileDown,
  Sparkles,
  Sun,
  Moon,
  RefreshCw,
  Building2,
} from "lucide-react";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  selectedDept: string;
  setSelectedDept: (dept: string) => void;
  departments: string[];
  onOpenChat: () => void;
  onOpenExport: () => void;
  onResetData: () => void;
  unreadChatAlerts: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  selectedDept,
  setSelectedDept,
  departments,
  onOpenChat,
  onOpenExport,
  onResetData,
  unreadChatAlerts,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                  Vanguard <span className="text-indigo-400 font-extrabold">RetainIQ</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 rounded-full">
                  <Sparkles className="w-3 h-3 text-indigo-400" /> Enterprise v4.2
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Root-Cause Attrition Analytics & AI Intervention Engine
              </p>
            </div>
          </div>

          {/* Department Filter & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Department Selector */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer pr-1"
                aria-label="Filter by department"
              >
                <option value="All" className="bg-slate-900 text-slate-200">
                  All Departments (Global)
                </option>
                {departments.map((dept) => (
                  <option key={dept} value={dept} className="bg-slate-900 text-slate-200">
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset / Sync button */}
            <button
              onClick={onResetData}
              title="Reset simulation & filters"
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-850 rounded-lg transition-colors border border-slate-800"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Export Brief Button */}
            <button
              onClick={onOpenExport}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-850 border border-slate-700/60 rounded-lg transition-colors shadow-sm"
            >
              <FileDown className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export Report</span>
            </button>

            {/* AI Copilot Button */}
            <button
              onClick={onOpenChat}
              className="relative inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-lg shadow-md shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">AI HR Copilot</span>
              {unreadChatAlerts && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 text-slate-400 hover:text-amber-300 hover:bg-slate-850 rounded-lg transition-colors border border-slate-800"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
