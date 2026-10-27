"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { departmentMetrics } from "@/data/mockEmployees";
import { formatCurrency } from "@/lib/utils";
import { Building, DollarSign, Percent } from "lucide-react";

export const DepartmentHeatmapChart: React.FC = () => {
  const [metricType, setMetricType] = useState<"rate" | "cost">("rate");

  const data = departmentMetrics.map((dept) => ({
    ...dept,
    rate: dept.attritionRate,
    cost: dept.replacementCostExposure,
  }));

  const getBarColor = (deptName: string, rate: number) => {
    if (rate >= 18) return "#ef4444"; // Red (Sales)
    if (rate >= 15) return "#f59e0b"; // Amber (Engineering, R&D)
    if (rate >= 12) return "#eab308"; // Yellow (Ops)
    return "#10b981"; // Emerald (HR, Marketing)
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-sm flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-800 gap-2">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-400" />
            Departmental Vulnerability Index
          </h3>
          <p className="text-xs text-slate-400">
            Comparing cross-functional risk rates &amp; financial capital exposure
          </p>
        </div>

        {/* Metric Selector Toggle */}
        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setMetricType("rate")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
              metricType === "rate"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Percent className="w-3 h-3" /> Attrition Rate
          </button>
          <button
            onClick={() => setMetricType("cost")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
              metricType === "cost"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <DollarSign className="w-3 h-3" /> Cost Exposure
          </button>
        </div>
      </div>

      <div className="h-64 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 15, right: 15, left: 0, bottom: 5 }}>
            <XAxis
              dataKey="department"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(val) =>
                metricType === "rate" ? `${val}%` : `$${(val / 1000000).toFixed(1)}M`
              }
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-xl text-xs max-w-xs">
                      <div className="font-bold text-white text-sm border-b border-slate-800 pb-1 mb-1.5 flex items-center justify-between">
                        <span>{d.department}</span>
                        <span className="text-indigo-400 font-semibold">{d.totalEmployees} employees</span>
                      </div>
                      <div className="space-y-1 text-slate-300">
                        <div className="flex justify-between">
                          <span>Attrition Rate:</span>
                          <span className="font-bold text-rose-400">{d.attritionRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>High-Risk Count:</span>
                          <span className="font-bold text-amber-400">{d.highRiskCount} seats</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Replacement Capital:</span>
                          <span className="font-bold text-emerald-400">{formatCurrency(d.replacementCostExposure)}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-slate-800">
                          <span>Primary Driver:</span>
                          <span className="font-semibold text-indigo-300">{d.primaryDriver}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey={metricType === "rate" ? "rate" : "cost"}
              radius={[6, 6, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    metricType === "rate"
                      ? getBarColor(entry.department, entry.rate)
                      : "#6366f1"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
        <span>Highest Turnover Risk: Sales (19.2%) &amp; R&amp;D (16.8%)</span>
        <span>Largest Capital Exposure: Engineering ($3.82M)</span>
      </div>
    </div>
  );
};
