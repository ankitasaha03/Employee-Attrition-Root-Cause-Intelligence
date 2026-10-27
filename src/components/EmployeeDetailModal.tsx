"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  ShieldAlert,
  Clock,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Award,
  CheckCircle2,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Employee } from "@/types/attrition";
import { formatCurrency, getRiskColor } from "@/lib/utils";
import confetti from "canvas-confetti";

interface EmployeeDetailModalProps {
  employee: Employee | null;
  onClose: () => void;
  onApplyRetentionAction: (empId: string, actionText: string) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  onClose,
  onApplyRetentionAction,
}) => {
  const [isApplying, setIsApplying] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!employee) return null;

  const riskStyles = getRiskColor(employee.riskLevel);

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      onApplyRetentionAction(employee.id, employee.aiRecommendation.action);
      setIsApplying(false);
      setSuccessMessage("Retention package authorized & dispatched to People Ops!");

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex justify-end transition-all animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full min-h-screen overflow-y-auto p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
        {/* Top bar */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider uppercase text-indigo-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> AI Retention Dossier
              </span>
              <span className="text-xs text-slate-500 font-mono">#{employee.id}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success banner if triggered */}
          {successMessage && (
            <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 flex items-center gap-2.5 animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Profile Header */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 p-0.5 shadow-lg flex items-center justify-center font-bold text-lg text-white">
                {employee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  {employee.name}
                </h2>
                <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <span className="text-indigo-400 font-semibold">{employee.role}</span>
                  <span>•</span>
                  <span>{employee.department}</span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-1">
                  <span>{employee.tenureYears} yrs tenure</span>
                  <span>•</span>
                  <span>{employee.workArrangement}</span>
                  <span>•</span>
                  <span>{employee.distanceKm} km commute</span>
                </div>
              </div>
            </div>

            {/* Risk Gauge Badge */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
              <div className="text-xs text-slate-400 sm:text-right">Flight Probability</div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl font-black ${riskStyles.text}`}>
                  {employee.riskScore}%
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${riskStyles.badge}`}>
                  {employee.riskLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Key HR Telemetry Grid */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
              <div className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Monthly Workload
              </div>
              <div className="text-base font-bold text-white mt-1">
                {employee.monthlyHours}h <span className="text-xs font-normal text-slate-400">total</span>
              </div>
              <div className="text-[11px] text-rose-400 font-semibold mt-0.5">
                +{employee.overtimeHours}h overtime
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
              <div className="text-slate-400 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-indigo-400" /> Compensation
              </div>
              <div className="text-base font-bold text-white mt-1">
                {formatCurrency(employee.salary)}
              </div>
              <div className={`text-[11px] font-semibold mt-0.5 ${employee.compaRatio < 0.9 ? "text-amber-400" : "text-emerald-400"}`}>
                Compa: {(employee.compaRatio * 100).toFixed(0)}% mkt
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
              <div className="text-slate-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-emerald-400" /> Performance
              </div>
              <div className="text-base font-bold text-white mt-1">
                {employee.performanceScore} <span className="text-xs font-normal text-slate-400">/ 5.0</span>
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                Top Tier Performer
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
              <div className="text-slate-400 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Replace Cost
              </div>
              <div className="text-base font-bold text-white mt-1">
                {formatCurrency(employee.replacementCost)}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Recruit &amp; ramp loss
              </div>
            </div>
          </div>

          {/* Root-Cause Drivers Breakdown */}
          <div className="mt-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Root-Cause Attribution Breakdown
            </h4>
            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Workload &amp; Overtime Pressure</span>
                  <span className="font-semibold text-rose-400">{employee.breakdown.workload}% stress</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${employee.breakdown.workload}%` }}
                    className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Compensation &amp; Equity Disparity</span>
                  <span className="font-semibold text-indigo-400">{employee.breakdown.compensation}% gap</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${employee.breakdown.compensation}%` }}
                    className="h-full bg-indigo-500 rounded-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Disengagement &amp; Burnout Index</span>
                  <span className="font-semibold text-amber-400">{employee.breakdown.engagement}% severity</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${employee.breakdown.engagement}%` }}
                    className="h-full bg-amber-500 rounded-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Career Growth Stagnation</span>
                  <span className="font-semibold text-purple-400">{employee.breakdown.careerGrowth}% barrier</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${employee.breakdown.careerGrowth}%` }}
                    className="h-full bg-purple-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 6-Month Risk Trajectory Sparkline */}
          <div className="mt-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                6-Month Predictive Flight Trajectory
              </h4>
              <span className="text-[11px] text-rose-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Accelerating Trend
              </span>
            </div>
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={employee.historicalRisk}>
                  <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <YAxis domain={[30, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-950 border border-slate-800 px-2 py-1 rounded text-xs text-white">
                            {payload[0].payload.month}: <span className="font-bold text-rose-400">{payload[0].value}% Risk</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="risk"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    dot={{ fill: "#ef4444", r: 3 }}
                    activeDot={{ r: 5, fill: "#ffffff" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Prescriptive AI Recommendation Box */}
          <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-indigo-950/50 via-slate-950 to-slate-900 border border-indigo-500/40 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-indigo-500/20">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Prescriptive AI Retention Action Plan
                </span>
              </div>
              <span className="text-[11px] font-semibold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">
                {employee.aiRecommendation.confidence}% Model Confidence
              </span>
            </div>

            <div className="mt-3">
              <div className="text-sm font-bold text-white">
                {employee.aiRecommendation.action}
              </div>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                {employee.aiRecommendation.rationale}
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs pt-3 border-t border-indigo-500/20">
              <div className="p-2 bg-indigo-950/40 rounded border border-indigo-500/20">
                <span className="text-slate-400 text-[11px]">Expected Risk Drop:</span>
                <div className="text-base font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                  <TrendingDown className="w-4 h-4" /> -{employee.aiRecommendation.expectedRiskReduction}%
                </div>
              </div>
              <div className="p-2 bg-indigo-950/40 rounded border border-indigo-500/20">
                <span className="text-slate-400 text-[11px]">Estimated Investment:</span>
                <div className="text-base font-bold text-white mt-0.5">
                  {formatCurrency(employee.aiRecommendation.costEstimate)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close Dossier
          </button>
          <button
            onClick={handleApply}
            disabled={isApplying || employee.retentionStatus === "Retained"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-lg shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {employee.retentionStatus === "Retained"
                ? "Retention Plan Completed"
                : isApplying
                ? "Deploying Action Plan..."
                : "Authorize AI Retention Plan"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
