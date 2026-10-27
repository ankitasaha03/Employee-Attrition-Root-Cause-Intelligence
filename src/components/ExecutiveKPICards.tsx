"use client";

import React from "react";
import {
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Activity,
  Users,
  ShieldCheck,
  Clock,
  HeartPulse,
} from "lucide-react";
import { Employee } from "@/types/attrition";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface ExecutiveKPICardsProps {
  employees: Employee[];
  baselineAttritionRate?: number;
  simulatedReductionRate?: number;
}

export const ExecutiveKPICards: React.FC<ExecutiveKPICardsProps> = ({
  employees,
  baselineAttritionRate = 14.8,
  simulatedReductionRate = 0,
}) => {
  const totalEmployees = employees.length;
  const criticalCount = employees.filter((e) => e.riskLevel === "Critical").length;
  const highCount = employees.filter((e) => e.riskLevel === "High").length;
  const mediumCount = employees.filter((e) => e.riskLevel === "Medium").length;
  const lowCount = employees.filter((e) => e.riskLevel === "Low").length;

  const totalHighRisk = criticalCount + highCount;

  // Replacement cost exposed
  const totalCostExposed = employees
    .filter((e) => e.riskLevel === "Critical" || e.riskLevel === "High")
    .reduce((sum, e) => sum + e.replacementCost, 0);

  // Saved replacement cost from active interventions
  const savedViaInterventions = employees
    .filter((e) => e.retentionStatus === "Intervention Applied" || e.retentionStatus === "Retained")
    .reduce((sum, e) => sum + e.replacementCost * (e.aiRecommendation.expectedRiskReduction / 100), 0);

  // Averages
  const avgEngagement =
    employees.length > 0
      ? Math.round(employees.reduce((acc, e) => acc + e.engagementScore, 0) / employees.length)
      : 58;

  const avgOvertime =
    employees.length > 0
      ? Number(
          (employees.reduce((acc, e) => acc + e.overtimeHours, 0) / employees.length).toFixed(1)
        )
      : 26.4;

  const currentRate = Math.max(
    3.5,
    Number((baselineAttritionRate - simulatedReductionRate).toFixed(1))
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Attrition Rate Card */}
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-sm transition-all hover:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Annualized Attrition Rate
          </span>
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-3xl font-extrabold tracking-tight text-white">
            {formatPercent(currentRate)}
          </span>
          {simulatedReductionRate > 0 ? (
            <span className="inline-flex items-center text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              <TrendingDown className="w-3 h-3 mr-1" /> -{simulatedReductionRate.toFixed(1)}% sim
            </span>
          ) : (
            <span className="inline-flex items-center text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              <TrendingDown className="w-3 h-3 mr-1" /> -1.2% MoM
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
          <span>Industry Benchmark: 17.5%</span>
          <span className="text-emerald-400 font-medium">-2.7% Favorable</span>
        </div>
      </div>

      {/* 2. High-Risk Flight Exposure Card */}
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-sm transition-all hover:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            High-Risk Flight Count
          </span>
          <div className="h-8 w-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-3xl font-extrabold tracking-tight text-rose-400">
            {totalHighRisk}
          </span>
          <span className="text-xs text-slate-400 font-normal">
            of {totalEmployees} active tracked
          </span>
        </div>

        {/* Breakdown bar */}
        <div className="mt-3">
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${(criticalCount / (totalEmployees || 1)) * 100}%` }}
              className="bg-rose-500"
              title={`Critical: ${criticalCount}`}
            />
            <div
              style={{ width: `${(highCount / (totalEmployees || 1)) * 100}%` }}
              className="bg-amber-500"
              title={`High: ${highCount}`}
            />
            <div
              style={{ width: `${(mediumCount / (totalEmployees || 1)) * 100}%` }}
              className="bg-yellow-500"
              title={`Medium: ${mediumCount}`}
            />
            <div
              style={{ width: `${(lowCount / (totalEmployees || 1)) * 100}%` }}
              className="bg-emerald-500"
              title={`Low: ${lowCount}`}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-500 inline-block" /> {criticalCount} Critical
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500 inline-block" /> {highCount} High
            </span>
            <span className="text-slate-500">{lowCount} Low Risk</span>
          </div>
        </div>
      </div>

      {/* 3. Estimated Replacement Cost Card */}
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-sm transition-all hover:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Replacement Cost Impact
          </span>
          <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-white">
            {formatCurrency(totalCostExposed)}
          </span>
          <span className="text-xs text-rose-400 font-medium">Exposed</span>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            {formatCurrency(savedViaInterventions)} Protected
          </span>
          <span className="text-[11px] text-slate-500">Avg $125k/seat</span>
        </div>
      </div>

      {/* 4. Engagement & Overtime Strain Card */}
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-sm transition-all hover:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Workforce Strain Index
          </span>
          <div className="h-8 w-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <HeartPulse className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-3 h-3 text-amber-400" /> Avg Overtime
            </div>
            <div className="text-xl font-bold text-white mt-0.5">
              {avgOvertime} <span className="text-xs font-normal text-slate-400">hrs/mo</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Users className="w-3 h-3 text-indigo-400" /> eNPS / Eng.
            </div>
            <div className="text-xl font-bold text-white mt-0.5">
              {avgEngagement} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
          <span>Strain Threshold: &gt;25h</span>
          <span className={avgOvertime > 25 ? "text-amber-400 font-semibold" : "text-emerald-400 font-medium"}>
            {avgOvertime > 25 ? "Elevated Fatigue" : "Optimal"}
          </span>
        </div>
      </div>
    </div>
  );
};
