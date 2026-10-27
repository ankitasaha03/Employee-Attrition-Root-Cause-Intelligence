"use client";

import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
  Cell,
} from "recharts";
import { Employee } from "@/types/attrition";
import { AlertOctagon } from "lucide-react";

interface WorkloadAttritionMatrixProps {
  employees: Employee[];
  onSelectEmployee: (emp: Employee) => void;
}

export const WorkloadAttritionMatrix: React.FC<WorkloadAttritionMatrixProps> = ({
  employees,
  onSelectEmployee,
}) => {
  const data = employees.map((e) => ({
    ...e,
    x: e.monthlyHours,
    y: e.performanceScore,
    z: e.riskScore,
  }));

  const getColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "#ef4444";
      case "High":
        return "#f59e0b";
      case "Medium":
        return "#eab308";
      case "Low":
      default:
        return "#10b981";
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-sm flex flex-col justify-between">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Workload vs. Performance Risk Matrix
            </h3>
            <span className="flex items-center gap-1 text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full font-medium">
              <AlertOctagon className="w-2.5 h-2.5" /> High-Performer Burnout Detection
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Monthly Working Hours vs. Performance Rating (Click node to inspect employee)
          </p>
        </div>
      </div>

      <div className="relative h-64 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
            {/* Shaded Danger Zone Area: Hours > 215 & Performance > 4.5 */}
            <ReferenceArea
              x1={215}
              x2={255}
              y1={4.5}
              y2={5.0}
              fill="#ef4444"
              fillOpacity={0.08}
              stroke="#ef4444"
              strokeDasharray="3 3"
              strokeOpacity={0.3}
            />

            <ReferenceLine x={215} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.4} />
            <ReferenceLine y={4.5} stroke="#6366f1" strokeDasharray="3 3" strokeOpacity={0.4} />

            <XAxis
              type="number"
              dataKey="x"
              name="Monthly Hours"
              domain={[160, 255]}
              unit=" hrs"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Performance"
              domain={[3.8, 5.0]}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <ZAxis type="number" dataKey="z" range={[60, 240]} name="Risk Score" />

            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const emp = payload[0].payload as Employee & { x: number; y: number; z: number };
                  return (
                    <div className="bg-slate-950 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs max-w-xs z-50">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
                        <span className="font-bold text-white">{emp.name}</span>
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                          style={{
                            backgroundColor: `${getColor(emp.riskLevel)}20`,
                            color: getColor(emp.riskLevel),
                          }}
                        >
                          {emp.riskScore}% Risk ({emp.riskLevel})
                        </span>
                      </div>
                      <div className="text-slate-300 space-y-1">
                        <div className="text-slate-400 text-[11px]">
                          {emp.role} • <span className="text-slate-200">{emp.department}</span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span>Monthly Hours:</span>
                          <span className="font-semibold text-white">{emp.monthlyHours} hrs ({emp.overtimeHours}h OT)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Performance:</span>
                          <span className="font-semibold text-emerald-400">{emp.performanceScore} / 5.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Primary Driver:</span>
                          <span className="font-semibold text-amber-300">{emp.primaryDriver}</span>
                        </div>
                      </div>
                      <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-indigo-400 font-medium text-center">
                        Click bubble to open AI Retention Plan ↗
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Scatter
              name="Employees"
              data={data}
              onClick={(entry) => {
                if (entry) {
                  onSelectEmployee(entry as unknown as Employee);
                }
              }}
              className="cursor-pointer"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColor(entry.riskLevel)}
                  stroke="#ffffff"
                  strokeWidth={1}
                  fillOpacity={0.85}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {/* Danger zone tag */}
        <div className="absolute top-4 right-6 pointer-events-none text-right">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-950/80 border border-rose-500/40 px-2 py-0.5 rounded shadow">
            🔥 Critical Flight Quadrant (&gt;215h &amp; &gt;4.5 Rating)
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
        <span>X-Axis: Monthly Logged Hours</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-rose-500" /> Critical Risk
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> High Risk
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Low Risk
          </span>
        </div>
      </div>
    </div>
  );
};
