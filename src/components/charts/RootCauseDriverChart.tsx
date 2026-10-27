"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { driverImpacts } from "@/data/mockEmployees";
import { Sparkles, Info } from "lucide-react";

export const RootCauseDriverChart: React.FC = () => {
  // Sort descending by impact weight
  const sortedData = [...driverImpacts].sort((a, b) => b.impactWeight - a.impactWeight);

  const getBarColor = (category: string) => {
    switch (category) {
      case "Compensation":
        return "#6366f1"; // Indigo
      case "Workload":
        return "#f59e0b"; // Amber
      case "Development":
        return "#8b5cf6"; // Purple
      case "Culture":
        return "#ec4899"; // Pink
      case "Logistics":
        return "#06b6d4"; // Cyan
      default:
        return "#64748b";
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-sm flex flex-col justify-between">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Root-Cause Driver Ranking
            </h3>
            <span className="flex items-center gap-1 text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-medium">
              <Sparkles className="w-2.5 h-2.5" /> SHAP Feature Weight
            </span>
          </div>
          <p className="text-xs text-slate-400">Relative statistical impact on predicted turnover probability</p>
        </div>
      </div>

      <div className="h-64 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={sortedData}
            margin={{ top: 5, right: 25, left: 20, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={[0, 40]}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              unit="%"
            />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
              tick={{ fill: "#cbd5e1", fontSize: 11 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg shadow-2xl text-xs max-w-xs">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: getBarColor(data.category) }}
                        />
                        {data.name}
                      </div>
                      <div className="text-slate-300 mt-1.5 space-y-1">
                        <div>
                          Impact Weight: <span className="font-bold text-indigo-400">{data.impactWeight}%</span>
                        </div>
                        <div>
                          Affected Headcount: <span className="font-semibold text-white">{data.affectedHeadcount} employees</span>
                        </div>
                        <div>
                          Avg Risk Lift: <span className="font-semibold text-rose-400">+{data.avgRiskLift}% lift</span>
                        </div>
                        <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                          Category: <span className="text-slate-300">{data.category}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="impactWeight" radius={[0, 6, 6, 0]}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.category)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 gap-2">
        <span className="flex items-center gap-1 text-slate-400">
          <Info className="w-3.5 h-3.5 text-indigo-400" /> Compensation & Overtime drive 60% of turnover risk
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-indigo-500" /> Comp
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Workload
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-purple-500" /> Career
          </span>
        </div>
      </div>
    </div>
  );
};
