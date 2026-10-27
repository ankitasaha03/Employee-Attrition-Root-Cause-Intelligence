"use client";

import React, { useState } from "react";
import {
  Sliders,
  TrendingDown,
  DollarSign,
  Users,
  CheckCircle2,
  RefreshCw,
  Zap,
} from "lucide-react";
import { SimulationParams, SimulationResult, Employee } from "@/types/attrition";
import { calculateSimulation } from "@/data/mockEmployees";
import { formatCurrency } from "@/lib/utils";

interface ScenarioSimulatorWidgetProps {
  employees: Employee[];
  simulationParams: SimulationParams;
  onUpdateParams: (params: SimulationParams) => void;
  onApplyScenarioToDashboard: (simResult: SimulationResult) => void;
}

export const ScenarioSimulatorWidget: React.FC<ScenarioSimulatorWidgetProps> = ({
  employees,
  simulationParams,
  onUpdateParams,
  onApplyScenarioToDashboard,
}) => {
  const [appliedNotice, setAppliedNotice] = useState(false);

  const result = calculateSimulation(employees, simulationParams);

  const handleSliderChange = (
    field: keyof SimulationParams,
    value: number | boolean
  ) => {
    onUpdateParams({
      ...simulationParams,
      [field]: value,
    });
  };

  const applyPreset = (presetName: string) => {
    switch (presetName) {
      case "workload":
        onUpdateParams({
          salaryAdjustmentPercent: 2,
          overtimeReductionPercent: 35,
          remoteDaysPerWeek: 3,
          upskillingProgramEnabled: true,
          retentionBonusBudget: 50000,
        });
        break;
      case "comp":
        onUpdateParams({
          salaryAdjustmentPercent: 12,
          overtimeReductionPercent: 15,
          remoteDaysPerWeek: 2,
          upskillingProgramEnabled: false,
          retentionBonusBudget: 150000,
        });
        break;
      case "max":
        onUpdateParams({
          salaryAdjustmentPercent: 14,
          overtimeReductionPercent: 40,
          remoteDaysPerWeek: 3,
          upskillingProgramEnabled: true,
          retentionBonusBudget: 200000,
        });
        break;
      case "zeroCost":
        onUpdateParams({
          salaryAdjustmentPercent: 0,
          overtimeReductionPercent: 25,
          remoteDaysPerWeek: 4,
          upskillingProgramEnabled: false,
          retentionBonusBudget: 0,
        });
        break;
      default:
        break;
    }
  };

  const handleDeployToDashboard = () => {
    onApplyScenarioToDashboard(result);
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 3000);
  };

  return (
    <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 p-5 sm:p-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <Sliders className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">
              Retention Policy Scenario Simulator
            </h3>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-medium">
              Dynamic Monte-Carlo Model
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate compensation, workload, and remote policy adjustments to predict turnover reduction and financial ROI
          </p>
        </div>

        {/* Presets */}
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-[11px] text-slate-400 font-semibold mr-1">Presets:</span>
          <button
            onClick={() => applyPreset("workload")}
            className="px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md border border-slate-700 transition-colors"
          >
            Workload Sanity
          </button>
          <button
            onClick={() => applyPreset("comp")}
            className="px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md border border-slate-700 transition-colors"
          >
            Comp Realignment
          </button>
          <button
            onClick={() => applyPreset("zeroCost")}
            className="px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md border border-slate-700 transition-colors"
          >
            Zero-Capex Policy
          </button>
          <button
            onClick={() => applyPreset("max")}
            className="px-2.5 py-1 text-[11px] font-medium bg-indigo-600/40 hover:bg-indigo-600/60 text-indigo-200 rounded-md border border-indigo-500/30 transition-colors"
          >
            Retention Max 🔥
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Panel */}
        <div className="lg:col-span-7 space-y-5">
          {/* Slider 1: Salary Adjustment */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-slate-300 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
                Across-the-Board Market Salary Adjustment
              </span>
              <span className="font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                +{simulationParams.salaryAdjustmentPercent}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={simulationParams.salaryAdjustmentPercent}
              onChange={(e) =>
                handleSliderChange("salaryAdjustmentPercent", Number(e.target.value))
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0% (Status Quo)</span>
              <span>+10% Tier-1 Benchmark</span>
              <span>+20% High Cap</span>
            </div>
          </div>

          {/* Slider 2: Overtime Reduction */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-slate-300 flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
                Overtime Hour Cap / Workload Rebalancing
              </span>
              <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                -{simulationParams.overtimeReductionPercent}% reduction
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={simulationParams.overtimeReductionPercent}
              onChange={(e) =>
                handleSliderChange("overtimeReductionPercent", Number(e.target.value))
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0% Uncapped</span>
              <span>-25% Controlled</span>
              <span>-50% Strict 40h Baseline</span>
            </div>
          </div>

          {/* Slider 3: Remote Work Days */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                Hybrid / Remote Flexibility Allowance
              </span>
              <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {simulationParams.remoteDaysPerWeek} Days / Week Remote
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={simulationParams.remoteDaysPerWeek}
              onChange={(e) =>
                handleSliderChange("remoteDaysPerWeek", Number(e.target.value))
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0 Days (Full In-Office)</span>
              <span>2-3 Days Hybrid</span>
              <span>5 Days (Full Remote)</span>
            </div>
          </div>

          {/* Toggles */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-medium select-none">
              <input
                type="checkbox"
                checked={simulationParams.upskillingProgramEnabled}
                onChange={(e) =>
                  handleSliderChange("upskillingProgramEnabled", e.target.checked)
                }
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span>Career Mobility &amp; Mentorship Fellowship Program</span>
            </label>

            <button
              onClick={() =>
                onUpdateParams({
                  salaryAdjustmentPercent: 0,
                  overtimeReductionPercent: 0,
                  remoteDaysPerWeek: 1,
                  upskillingProgramEnabled: false,
                  retentionBonusBudget: 0,
                })
              }
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Reset Sliders
            </button>
          </div>
        </div>

        {/* Dynamic Prediction Outcome Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950/90 rounded-xl border border-indigo-500/30 p-5 shadow-inner">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <span>Predicted Impact Outcome</span>
              <span className="text-indigo-400 font-mono">1,020 Headcount Base</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {/* Turnover Rate Change */}
              <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400">Predicted Turnover:</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-emerald-400">
                    {result.predictedAttritionRate}%
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    {result.currentAttritionRate}%
                  </span>
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                  ↓ {result.rateReduction}% absolute drop
                </div>
              </div>

              {/* Headcount Retained */}
              <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400">Preserved Headcount:</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-white">
                    +{result.headcountSaved}
                  </span>
                  <span className="text-xs text-slate-400">seats saved</span>
                </div>
                <div className="text-[11px] text-indigo-400 font-semibold mt-1">
                  from {result.currentRiskHeadcount} to {result.predictedRiskHeadcount} flight risks
                </div>
              </div>
            </div>

            {/* Financial ROI Breakdown */}
            <div className="mt-4 p-3 bg-indigo-950/30 rounded-lg border border-indigo-500/30 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Replacement Cost Avoided:</span>
                <span className="font-bold text-emerald-400">
                  {formatCurrency(result.annualReplacementCostSaved)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Intervention Capex:</span>
                <span className="font-semibold text-rose-300">
                  - {formatCurrency(result.interventionCost)}
                </span>
              </div>
              <div className="flex justify-between text-white font-bold pt-1.5 border-t border-indigo-500/20 text-sm">
                <span>Net Financial Savings:</span>
                <span className="text-emerald-300">{formatCurrency(result.netSavings)}</span>
              </div>
              <div className="flex justify-between text-indigo-300 text-[11px]">
                <span>Simulated Program ROI:</span>
                <span className="font-bold">{result.roiPercent}% Return</span>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="mt-5">
            <button
              onClick={handleDeployToDashboard}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Apply Simulated Interventions to Dashboard</span>
            </button>
            {appliedNotice && (
              <div className="mt-2 text-center text-xs font-semibold text-emerald-400 animate-fade-in flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Simulation parameters updated executive KPI metrics!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
