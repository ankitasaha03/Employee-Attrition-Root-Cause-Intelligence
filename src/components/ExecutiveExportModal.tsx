"use client";

import React from "react";
import {
  X,
  Printer,
  Download,
  FileText,
} from "lucide-react";
import { Employee, SimulationResult } from "@/types/attrition";
import { formatCurrency } from "@/lib/utils";

interface ExecutiveExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  simResult: SimulationResult;
  selectedDept: string;
}

export const ExecutiveExportModal: React.FC<ExecutiveExportModalProps> = ({
  isOpen,
  onClose,
  employees,
  simResult,
  selectedDept,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const headers = [
      "Employee ID",
      "Name",
      "Department",
      "Role",
      "Risk Score (%)",
      "Risk Level",
      "Primary Driver",
      "Monthly Hours",
      "Overtime Hours",
      "Salary ($)",
      "Replacement Cost ($)",
      "Retention Status",
      "AI Recommendation",
    ];

    const rows = employees.map((e) => [
      e.id,
      `"${e.name}"`,
      `"${e.department}"`,
      `"${e.role}"`,
      e.riskScore,
      e.riskLevel,
      `"${e.primaryDriver}"`,
      e.monthlyHours,
      e.overtimeHours,
      e.salary,
      e.replacementCost,
      e.retentionStatus,
      `"${e.aiRecommendation.action.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Attrition_Risk_Report_${selectedDept}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const highRisks = employees.filter(
    (e) => e.riskLevel === "Critical" || e.riskLevel === "High"
  );
  const totalCost = highRisks.reduce((s, e) => s + e.replacementCost, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl text-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Executive Talent Retention Briefing
              </h3>
              <p className="text-xs text-slate-400">
                Department Scope: <span className="text-indigo-400 font-semibold">{selectedDept}</span> • Generated {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Content Body */}
        <div className="mt-5 space-y-5 text-xs">
          {/* Executive Summary Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              1. Executive Strategic Summary
            </h4>
            <p className="text-slate-300 leading-relaxed">
              The organization currently registers an annualized attrition rate of{" "}
              <strong className="text-white">14.8%</strong> (favorably below the 17.5% tech industry benchmark). However, predictive telemetry isolates{" "}
              <strong className="text-rose-400">{highRisks.length} key personnel</strong> at imminent flight risk representing a cumulative capital exposure of{" "}
              <strong className="text-emerald-400">{formatCurrency(totalCost)}</strong> in recruit, severance, and productivity ramp loss.
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px]">Tracked Personnel</span>
              <div className="text-lg font-bold text-white mt-0.5">{employees.length}</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px]">Critical Flight Risk</span>
              <div className="text-lg font-bold text-rose-400 mt-0.5">{highRisks.length}</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px]">Capital Exposure</span>
              <div className="text-lg font-bold text-white mt-0.5">{formatCurrency(totalCost)}</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px]">Projected Net ROI</span>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">{simResult.roiPercent}%</div>
            </div>
          </div>

          {/* Top Vulnerable Talent */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              2. Highest Exposure Flight Risks (Priority Focus)
            </h4>
            <div className="divide-y divide-slate-800">
              {highRisks.slice(0, 4).map((emp) => (
                <div key={emp.id} className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white">{emp.name}</span>{" "}
                    <span className="text-slate-400">({emp.role} • {emp.department})</span>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Driver: <span className="text-amber-300">{emp.primaryDriver}</span> • Replacement: {formatCurrency(emp.replacementCost)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-rose-400">{emp.riskScore}% Risk</span>
                    <div className="text-[11px] text-indigo-400">{emp.retentionStatus}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Policy Recommendations */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1.5">
              3. Recommended Policy Interventions
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
              <li>Calibrate engineering &amp; R&amp;D market bands to 95th percentile compa-ratio.</li>
              <li>Enforce strict 40h/week overtime baseline caps for critical pipeline architects.</li>
              <li>Institute a minimum of 2 flexible hybrid days per week to resolve commute stress.</li>
            </ul>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleDownloadCSV}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Download CSV Ledger</span>
          </button>
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Executive Brief</span>
          </button>
        </div>
      </div>
    </div>
  );
};
