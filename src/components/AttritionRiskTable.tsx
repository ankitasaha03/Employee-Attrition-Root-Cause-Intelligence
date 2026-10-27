"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronRight,
  ShieldAlert,
  ArrowUpDown,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Employee, RetentionStatus } from "@/types/attrition";
import { formatCurrency, getRiskColor } from "@/lib/utils";

interface AttritionRiskTableProps {
  employees: Employee[];
  onSelectEmployee: (emp: Employee) => void;
  onApplyQuickAction: (empId: string) => void;
}

export const AttritionRiskTable: React.FC<AttritionRiskTableProps> = ({
  employees,
  onSelectEmployee,
  onApplyQuickAction,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortField, setSortField] = useState<"riskScore" | "replacementCost" | "monthlyHours">("riskScore");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Filtered & Sorted Employees
  const filteredEmployees = useMemo(() => {
    return employees
      .filter((emp) => {
        const matchesSearch =
          emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.department.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRisk = riskFilter === "All" || emp.riskLevel === riskFilter;
        const matchesStatus = statusFilter === "All" || emp.retentionStatus === statusFilter;

        return matchesSearch && matchesRisk && matchesStatus;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        return sortAsc ? valA - valB : valB - valA;
      });
  }, [employees, searchQuery, riskFilter, statusFilter, sortField, sortAsc]);

  const toggleSort = (field: "riskScore" | "replacementCost" | "monthlyHours") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getStatusBadge = (status: RetentionStatus) => {
    switch (status) {
      case "Retained":
        return "bg-emerald-950/60 text-emerald-400 border-emerald-500/40";
      case "Intervention Applied":
        return "bg-indigo-950/60 text-indigo-300 border-indigo-500/40";
      case "Action In Review":
        return "bg-amber-950/60 text-amber-300 border-amber-500/40";
      case "Unaddressed":
      default:
        return "bg-rose-950/60 text-rose-300 border-rose-500/40";
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden backdrop-blur-sm">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight">
              Predictive Flight-Risk Workforce Ledger
            </h3>
            <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
              {filteredEmployees.length} of {employees.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time individual employee risk scores, core attrition drivers, and prescriptive retention actions
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Bar */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ID, name, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Risk Level Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            aria-label="Filter by Risk"
          >
            <option value="All">All Risk Levels</option>
            <option value="Critical">Critical (&gt;80)</option>
            <option value="High">High (70-79)</option>
            <option value="Medium">Medium (50-69)</option>
            <option value="Low">Low (&lt;50)</option>
          </select>

          {/* Retention Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            aria-label="Filter by Retention Status"
          >
            <option value="All">All Statuses</option>
            <option value="Unaddressed">Unaddressed</option>
            <option value="Action In Review">In Review</option>
            <option value="Intervention Applied">Action Applied</option>
            <option value="Retained">Retained</option>
          </select>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold tracking-wider uppercase text-[11px]">
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-3">Role &amp; Dept</th>
              <th
                className="py-3 px-3 cursor-pointer hover:text-white transition-colors select-none"
                onClick={() => toggleSort("riskScore")}
              >
                <div className="flex items-center gap-1">
                  <span>Risk Score</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-3">Primary Flight Driver</th>
              <th
                className="py-3 px-3 cursor-pointer hover:text-white transition-colors select-none"
                onClick={() => toggleSort("monthlyHours")}
              >
                <div className="flex items-center gap-1">
                  <span>Workload (OT)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th
                className="py-3 px-3 cursor-pointer hover:text-white transition-colors select-none"
                onClick={() => toggleSort("replacementCost")}
              >
                <div className="flex items-center gap-1">
                  <span>Replacement Cost</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-3">Retention Status</th>
              <th className="py-3 px-4 text-right">Prescriptive Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShieldAlert className="w-8 h-8 text-slate-600" />
                    <p className="text-sm font-medium">No employees match current criteria.</p>
                    <p className="text-xs text-slate-500">Try broadening your search or resetting filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => {
                const riskStyles = getRiskColor(emp.riskLevel);
                return (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectEmployee(emp)}
                  >
                    {/* Employee Profile */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-slate-700 to-indigo-900 border border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-200">
                          {emp.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                            {emp.name}
                            <span className="text-[10px] font-mono text-slate-500">
                              {emp.id}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {emp.tenureYears} yrs tenure • {emp.workArrangement}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role & Dept */}
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-slate-200">{emp.role}</div>
                      <div className="text-[11px] text-indigo-400">{emp.department}</div>
                    </td>

                    {/* Risk Score & Level */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${riskStyles.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${riskStyles.dot}`} />
                          {emp.riskScore}%
                        </span>
                        <span className="text-[11px] font-medium text-slate-400">
                          {emp.riskLevel}
                        </span>
                      </div>
                    </td>

                    {/* Primary Flight Driver */}
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-slate-300">
                        {emp.primaryDriver}
                      </div>
                      {emp.secondaryDriver && (
                        <div className="text-[10px] text-slate-500">
                          + {emp.secondaryDriver}
                        </div>
                      )}
                    </td>

                    {/* Workload */}
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-slate-200">
                        {emp.monthlyHours}h <span className="text-slate-500">/mo</span>
                      </div>
                      <div className={`text-[11px] font-semibold ${emp.overtimeHours > 30 ? "text-rose-400" : "text-amber-400"}`}>
                        {emp.overtimeHours}h overtime
                      </div>
                    </td>

                    {/* Replacement Cost */}
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white">
                        {formatCurrency(emp.replacementCost)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Base: {formatCurrency(emp.salary)}
                      </div>
                    </td>

                    {/* Retention Status */}
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(emp.retentionStatus)}`}>
                        {emp.retentionStatus === "Retained" && <CheckCircle2 className="w-3 h-3" />}
                        {emp.retentionStatus}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      {emp.retentionStatus === "Unaddressed" ? (
                        <button
                          onClick={() => onApplyQuickAction(emp.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow transition-colors active:scale-95"
                          title="Apply AI Recommended Retention Package"
                        >
                          <Sparkles className="w-3 h-3 text-indigo-200" />
                          <span>Apply AI Plan</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onSelectEmployee(emp)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <span>Review Dossier</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
