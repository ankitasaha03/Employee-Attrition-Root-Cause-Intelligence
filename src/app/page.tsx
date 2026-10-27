"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { ExecutiveKPICards } from "@/components/ExecutiveKPICards";
import { RiskDistributionChart } from "@/components/charts/RiskDistributionChart";
import { RootCauseDriverChart } from "@/components/charts/RootCauseDriverChart";
import { WorkloadAttritionMatrix } from "@/components/charts/WorkloadAttritionMatrix";
import { DepartmentHeatmapChart } from "@/components/charts/DepartmentHeatmapChart";
import { ScenarioSimulatorWidget } from "@/components/ScenarioSimulatorWidget";
import { AttritionRiskTable } from "@/components/AttritionRiskTable";
import { EmployeeDetailModal } from "@/components/EmployeeDetailModal";
import { AIChatbotDrawer } from "@/components/AIChatbotDrawer";
import { ExecutiveExportModal } from "@/components/ExecutiveExportModal";
import { initialEmployees, calculateSimulation } from "@/data/mockEmployees";
import { Employee, SimulationParams, SimulationResult } from "@/types/attrition";
import {
  Bot,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  BarChart3,
  Users2,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "matrix" | "simulation" | "ledger">("overview");

  // Simulation Params
  const [simulationParams, setSimulationParams] = useState<SimulationParams>({
    salaryAdjustmentPercent: 0,
    overtimeReductionPercent: 0,
    remoteDaysPerWeek: 1,
    upskillingProgramEnabled: false,
    retentionBonusBudget: 0,
  });

  const [simulatedReductionRate, setSimulatedReductionRate] = useState<number>(0);
  const [activeNotification, setActiveNotification] = useState<string | null>(
    "Alert: Dr. Elena Rostova logged 42h overtime this month. Flight probability escalated to 92%."
  );

  // Sync dark mode class with documentElement
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
    }
  }, [darkMode]);

  // Extract unique departments
  const departments = useMemo(() => {
    return Array.from(new Set(initialEmployees.map((e) => e.department)));
  }, []);

  // Filtered employees by department
  const filteredEmployees = useMemo(() => {
    if (selectedDept === "All") return employees;
    return employees.filter((e) => e.department === selectedDept);
  }, [employees, selectedDept]);

  // Simulation calculation
  const simResult: SimulationResult = useMemo(() => {
    return calculateSimulation(filteredEmployees, simulationParams);
  }, [filteredEmployees, simulationParams]);

  // Handler for applying retention action to an employee
  const handleApplyRetentionAction = (empId: string, actionText: string) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === empId) {
          const newRisk = Math.max(15, emp.riskScore - emp.aiRecommendation.expectedRiskReduction);
          const newLevel = newRisk >= 80 ? "Critical" : newRisk >= 70 ? "High" : newRisk >= 50 ? "Medium" : "Low";
          return {
            ...emp,
            riskScore: newRisk,
            riskLevel: newLevel,
            retentionStatus: "Intervention Applied",
            appliedAction: actionText,
          };
        }
        return emp;
      })
    );

    // Update selected employee in drawer if open
    setSelectedEmployee((prev) => {
      if (prev && prev.id === empId) {
        const newRisk = Math.max(15, prev.riskScore - prev.aiRecommendation.expectedRiskReduction);
        const newLevel = newRisk >= 80 ? "Critical" : newRisk >= 70 ? "High" : newRisk >= 50 ? "Medium" : "Low";
        return {
          ...prev,
          riskScore: newRisk,
          riskLevel: newLevel,
          retentionStatus: "Intervention Applied",
          appliedAction: actionText,
        };
      }
      return prev;
    });
  };

  // Quick Action from table
  const handleApplyQuickAction = (empId: string) => {
    const emp = employees.find((e) => e.id === empId);
    if (!emp) return;
    handleApplyRetentionAction(empId, emp.aiRecommendation.action);
    confetti({
      particleCount: 50,
      spread: 45,
      origin: { y: 0.7 },
    });
  };

  // Deploy simulation to dashboard
  const handleApplyScenarioToDashboard = (sim: SimulationResult) => {
    setSimulatedReductionRate(sim.rateReduction);
  };

  // Reset simulation and employee state
  const handleResetData = () => {
    setEmployees(initialEmployees);
    setSelectedDept("All");
    setSimulationParams({
      salaryAdjustmentPercent: 0,
      overtimeReductionPercent: 0,
      remoteDaysPerWeek: 1,
      upskillingProgramEnabled: false,
      retentionBonusBudget: 0,
    });
    setSimulatedReductionRate(0);
  };

  const handleSelectEmployeeById = (empId: string) => {
    const emp = employees.find((e) => e.id === empId);
    if (emp) {
      setSelectedEmployee(emp);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        selectedDept={selectedDept}
        setSelectedDept={setSelectedDept}
        departments={departments}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onResetData={handleResetData}
        unreadChatAlerts={true}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Real-Time Flight Risk Alert Banner */}
        {activeNotification && (
          <div className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 p-3.5 shadow-md flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="text-slate-200">
                <strong className="text-amber-400 font-semibold">Priority Telemetry Alert:</strong>{" "}
                {activeNotification}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const elena = employees.find((e) => e.id === "EMP-1042");
                  if (elena) setSelectedEmployee(elena);
                }}
                className="hidden sm:inline-flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
              >
                <span>Inspect Elena Rostova</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => setActiveNotification(null)}
                className="text-slate-500 hover:text-slate-300 p-1 rounded"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Executive Header & Navigation Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Executive Attrition Intelligence Command
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Active Scope:{" "}
              <span className="font-semibold text-indigo-400">
                {selectedDept === "All" ? "Global Enterprise (1,020 Total Headcount)" : `${selectedDept} Department`}
              </span>{" "}
              • Telemetry updated 3 mins ago
            </p>
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === "overview"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Overview
            </button>
            <button
              onClick={() => setActiveTab("matrix")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === "matrix"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Workload Matrix
            </button>
            <button
              onClick={() => setActiveTab("simulation")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === "simulation"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Scenario Simulator
            </button>
            <button
              onClick={() => setActiveTab("ledger")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === "ledger"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Users2 className="w-3.5 h-3.5" /> Personnel Ledger ({filteredEmployees.length})
            </button>
          </div>
        </div>

        {/* 1. Executive KPI Summary Cards */}
        <ExecutiveKPICards
          employees={filteredEmployees}
          baselineAttritionRate={14.8}
          simulatedReductionRate={simulatedReductionRate}
        />

        {/* Tab 1: Overview Dashboard Grid */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            {/* Visual Analytics Grid: 2 Charts Top */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RiskDistributionChart employees={filteredEmployees} />
              <RootCauseDriverChart />
            </div>

            {/* Department Comparison & Quick Matrix Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DepartmentHeatmapChart />
              <WorkloadAttritionMatrix
                employees={filteredEmployees}
                onSelectEmployee={(emp) => setSelectedEmployee(emp)}
              />
            </div>

            {/* Scenario Simulator Widget Section */}
            <ScenarioSimulatorWidget
              employees={filteredEmployees}
              simulationParams={simulationParams}
              onUpdateParams={setSimulationParams}
              onApplyScenarioToDashboard={handleApplyScenarioToDashboard}
            />

            {/* Workforce Ledger Table */}
            <AttritionRiskTable
              employees={filteredEmployees}
              onSelectEmployee={(emp) => setSelectedEmployee(emp)}
              onApplyQuickAction={handleApplyQuickAction}
            />
          </div>
        )}

        {/* Tab 2: Deep Matrix View */}
        {activeTab === "matrix" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <WorkloadAttritionMatrix
                  employees={filteredEmployees}
                  onSelectEmployee={(emp) => setSelectedEmployee(emp)}
                />
              </div>
              <div className="lg:col-span-4">
                <RiskDistributionChart employees={filteredEmployees} />
              </div>
            </div>
            <AttritionRiskTable
              employees={filteredEmployees}
              onSelectEmployee={(emp) => setSelectedEmployee(emp)}
              onApplyQuickAction={handleApplyQuickAction}
            />
          </div>
        )}

        {/* Tab 3: Dedicated Scenario Simulator View */}
        {activeTab === "simulation" && (
          <div className="space-y-6 animate-fade-in">
            <ScenarioSimulatorWidget
              employees={filteredEmployees}
              simulationParams={simulationParams}
              onUpdateParams={setSimulationParams}
              onApplyScenarioToDashboard={handleApplyScenarioToDashboard}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RootCauseDriverChart />
              <DepartmentHeatmapChart />
            </div>
          </div>
        )}

        {/* Tab 4: Dedicated Ledger View */}
        {activeTab === "ledger" && (
          <div className="space-y-6 animate-fade-in">
            <AttritionRiskTable
              employees={filteredEmployees}
              onSelectEmployee={(emp) => setSelectedEmployee(emp)}
              onApplyQuickAction={handleApplyQuickAction}
            />
          </div>
        )}
      </main>

      {/* Floating Copilot Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsChatOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-2xl shadow-indigo-600/40 border border-indigo-400/30 transition-all hover:scale-105 active:scale-95"
        >
          <div className="h-6 w-6 rounded-lg bg-slate-950/40 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span>Ask Vanguard Copilot</span>
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
        </button>
      </div>

      {/* Slide-out / Modal Components */}
      <EmployeeDetailModal
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        onApplyRetentionAction={handleApplyRetentionAction}
      />

      <AIChatbotDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        employees={employees}
        onSelectEmployeeById={handleSelectEmployeeById}
        onSetDeptFilter={(dept) => setSelectedDept(dept)}
        onApplySimParams={(params) => {
          setSimulationParams((prev) => ({ ...prev, ...params }));
          setActiveTab("simulation");
        }}
      />

      <ExecutiveExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        employees={filteredEmployees}
        simResult={simResult}
        selectedDept={selectedDept}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Vanguard RetainIQ Enterprise</span>
            <span>•</span>
            <span>Predictive HR Analytics &amp; Retention Optimization</span>
          </div>
          <div>
            Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, &amp; Recharts
          </div>
        </div>
      </footer>
    </div>
  );
}
