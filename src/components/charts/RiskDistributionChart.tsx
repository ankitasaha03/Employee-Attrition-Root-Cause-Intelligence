"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Employee } from "@/types/attrition";

interface RiskDistributionChartProps {
  employees: Employee[];
}

const COLORS = {
  Critical: "#ef4444", // Crimson
  High: "#f59e0b",     // Amber
  Medium: "#eab308",   // Yellow
  Low: "#10b981",      // Emerald
};

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({
  employees,
}) => {
  const critical = employees.filter((e) => e.riskLevel === "Critical").length;
  const high = employees.filter((e) => e.riskLevel === "High").length;
  const medium = employees.filter((e) => e.riskLevel === "Medium").length;
  const low = employees.filter((e) => e.riskLevel === "Low").length;

  const data = [
    { name: "Critical", value: critical, color: COLORS.Critical },
    { name: "High", value: high, color: COLORS.High },
    { name: "Medium", value: medium, color: COLORS.Medium },
    { name: "Low", value: low, color: COLORS.Low },
  ].filter((d) => d.value > 0);

  const total = employees.length || 1;
  const criticalPercent = Math.round(((critical + high) / total) * 100);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-sm flex flex-col justify-between">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Attrition Risk Distribution
          </h3>
          <p className="text-xs text-slate-400">Headcount segmented by predictive flight score</p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          N = {employees.length}
        </span>
      </div>

      <div className="relative h-56 w-full my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={84}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0];
                  const pct = Math.round(((item.value as number) / total) * 100);
                  return (
                    <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg shadow-xl text-xs">
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: item.payload.color }}
                        />
                        {item.name} Risk
                      </div>
                      <div className="text-slate-300 mt-1">
                        {item.value} employees ({pct}%)
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-rose-400 tracking-tight">
            {criticalPercent}%
          </span>
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            Flight Risk
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between px-2 py-1 bg-slate-950/60 rounded border border-rose-500/20">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="h-2 w-2 rounded-full bg-rose-500" /> Critical (&gt;80)
          </span>
          <span className="font-bold text-rose-400">{critical}</span>
        </div>
        <div className="flex items-center justify-between px-2 py-1 bg-slate-950/60 rounded border border-amber-500/20">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> High (70-79)
          </span>
          <span className="font-bold text-amber-400">{high}</span>
        </div>
        <div className="flex items-center justify-between px-2 py-1 bg-slate-950/60 rounded border border-yellow-500/20">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="h-2 w-2 rounded-full bg-yellow-500" /> Medium (50-69)
          </span>
          <span className="font-bold text-yellow-400">{medium}</span>
        </div>
        <div className="flex items-center justify-between px-2 py-1 bg-slate-950/60 rounded border border-emerald-500/20">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Low (&lt;50)
          </span>
          <span className="font-bold text-emerald-400">{low}</span>
        </div>
      </div>
    </div>
  );
};
