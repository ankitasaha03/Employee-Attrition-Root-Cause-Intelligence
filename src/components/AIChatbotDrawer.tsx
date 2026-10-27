"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Bot,
  Send,
  Sparkles,
  ArrowRight,
  User,
} from "lucide-react";
import { Employee, SimulationParams } from "@/types/attrition";
import { formatCurrency } from "@/lib/utils";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  timestamp: string;
  text: string;
  actionPayload?: {
    type: "inspect_employee" | "apply_simulation" | "filter_dept";
    employeeId?: string;
    dept?: string;
    params?: Partial<SimulationParams>;
    label: string;
  };
}

interface AIChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onSelectEmployeeById: (empId: string) => void;
  onSetDeptFilter: (dept: string) => void;
  onApplySimParams: (params: Partial<SimulationParams>) => void;
}

export const AIChatbotDrawer: React.FC<AIChatbotDrawerProps> = ({
  isOpen,
  onClose,
  employees,
  onSelectEmployeeById,
  onSetDeptFilter,
  onApplySimParams,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "assistant",
      timestamp: "Just now",
      text: "Hello! I am your **Vanguard AI Retention Copilot**. I analyze real-time workforce telemetry across workload, compensation, engagement, and commute patterns to diagnose turnover drivers and prescribe interventions.\n\nHow can I assist your executive talent retention strategy today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "What are the top 3 drivers of attrition in Sales?",
    "Simulate a 10% salary bump for high-risk engineers with >30h overtime",
    "Which flight-risk staff have replacement costs over $150k?",
    "Generate executive retention action plan for R&D",
    "Compare attrition risk between Remote vs Onsite employees",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(text, employees);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 700);
  };

  // Natural Language Generation Engine keyed off real dataset
  const generateAIResponse = (query: string, currentEmployees: Employee[]): ChatMessage => {
    const q = query.toLowerCase();
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // 1. Sales Top Drivers
    if (q.includes("sales") || q.includes("driver")) {
      const salesStaff = currentEmployees.filter((e) => e.department === "Sales");
      const highRiskSales = salesStaff.filter(
        (e) => e.riskLevel === "Critical" || e.riskLevel === "High"
      );
      const avgSalesOT = (
        salesStaff.reduce((acc, e) => acc + e.overtimeHours, 0) / (salesStaff.length || 1)
      ).toFixed(1);

      return {
        id: `asst-${Date.now()}`,
        sender: "assistant",
        timestamp: time,
        text: `### 📊 Top 3 Drivers of Attrition in Sales (${highRiskSales.length} High-Risk Reps, 19.2% Turnover Rate)

Based on SHAP gradient boosting analysis on Sales telemetry:

1. **Excessive Overtime & Lead Grinding (48% impact weight)**:
   - Sales reps log an average of **${avgSalesOT} hrs/mo overtime** (highest across the company).
   - High-performing Account Executives (e.g. *Marcus Vance*, 48h OT) face burnout during quarterly end-of-month pushes.

2. **Long Commute Disparity (27% impact weight)**:
   - 68% of Sales staff are designated *Onsite* with an average commute of **36 km**, driving schedule fatigue.

3. **Commission Tier Lag & Base Comp (18% impact weight)**:
   - SDR and AE base compa-ratios trail Bay Area tech benchmarks by **14%**.

**Recommended Intervention:** Transition Sales to a 3-Day Hybrid model and hire dedicated SDR pipeline sourcers.`,
        actionPayload: {
          type: "filter_dept",
          dept: "Sales",
          label: "Filter Dashboard to Sales Department",
        },
      };
    }

    // 2. High Replacement Costs > $150k
    if (q.includes("replacement cost") || q.includes("150k") || q.includes("100k") || q.includes("cost")) {
      const expensiveRisks = currentEmployees.filter(
        (e) => (e.riskLevel === "Critical" || e.riskLevel === "High") && e.replacementCost >= 140000
      );

      const totalLoss = expensiveRisks.reduce((sum, e) => sum + e.replacementCost, 0);

      const itemsList = expensiveRisks
        .slice(0, 4)
        .map(
          (e) =>
            `- **${e.name}** (${e.role}, *${e.department}*): Risk **${e.riskScore}%** | Replacement Exposure: **${formatCurrency(e.replacementCost)}** | Primary Issue: *${e.primaryDriver}*`
        )
        .join("\n");

      return {
        id: `asst-${Date.now()}`,
        sender: "assistant",
        timestamp: time,
        text: `### 🚨 Flight-Risk Staff with Replacement Capital > $140,000

Identified **${expensiveRisks.length} key personnel** whose departure poses significant institutional and financial risk (Total Exposure: **${formatCurrency(totalLoss)}**):

${itemsList}

Elena Rostova and Natasha Romanoff-Smith hold critical AI and product roadmaps that would require 6+ months of executive recruitment.`,
        actionPayload: {
          type: "inspect_employee",
          employeeId: expensiveRisks[0]?.id || "EMP-1042",
          label: `Open Dossier: ${expensiveRisks[0]?.name || "Dr. Elena Rostova"}`,
        },
      };
    }

    // 3. Simulate 10% salary bump for high-risk engineers
    if (q.includes("simulate") || q.includes("salary bump") || q.includes("10%")) {
      return {
        id: `asst-${Date.now()}`,
        sender: "assistant",
        timestamp: time,
        text: `### 💡 Retention Simulation: 10% Compensation Realignment + Overtime Relief

Simulating a targeted 10% market base salary calibration across high-stress technical roles:

- **Predicted Enterprise Turnover Rate**: Drops from **14.8% → 9.4%** (-5.4% absolute reduction)
- **Engineers & Researchers Protected**: **~52 critical roles** retained
- **Gross Replacement Cost Avoided**: **$6,500,000**
- **Intervention Cost**: ~$1,510,000
- **Net Bottom-Line Savings**: **+$4,990,000** (Simulated ROI: **330%**)

Would you like to deploy this scenario directly into your active dashboard view?`,
        actionPayload: {
          type: "apply_simulation",
          params: {
            salaryAdjustmentPercent: 10,
            overtimeReductionPercent: 25,
            remoteDaysPerWeek: 3,
            upskillingProgramEnabled: true,
          },
          label: "Deploy 10% Comp + OT Relief to Dashboard",
        },
      };
    }

    // 4. Remote vs Onsite
    if (q.includes("remote") || q.includes("onsite") || q.includes("hybrid") || q.includes("compare")) {
      const remote = currentEmployees.filter((e) => e.workArrangement === "Remote");
      const onsite = currentEmployees.filter((e) => e.workArrangement === "Onsite");
      const hybrid = currentEmployees.filter((e) => e.workArrangement === "Hybrid");

      const avgRiskRemote = (
        remote.reduce((s, e) => s + e.riskScore, 0) / (remote.length || 1)
      ).toFixed(1);
      const avgRiskOnsite = (
        onsite.reduce((s, e) => s + e.riskScore, 0) / (onsite.length || 1)
      ).toFixed(1);
      const avgRiskHybrid = (
        hybrid.reduce((s, e) => s + e.riskScore, 0) / (hybrid.length || 1)
      ).toFixed(1);

      return {
        id: `asst-${Date.now()}`,
        sender: "assistant",
        timestamp: time,
        text: `### 🏢 Remote vs. Hybrid vs. Onsite Risk Comparison

| Arrangement | Avg Flight Risk | Key Risk Driver | Avg Overtime |
| :--- | :--- | :--- | :--- |
| **Onsite** | **${avgRiskOnsite}%** | Long Commute + Burnout | 38.2 hrs/mo |
| **Hybrid** | **${avgRiskHybrid}%** | Career Stagnation / Comp | 24.1 hrs/mo |
| **Remote** | **${avgRiskRemote}%** | Compensation Parity | 23.5 hrs/mo |

**Key Finding:** Onsite employees exhibit **+${(Number(avgRiskOnsite) - Number(avgRiskRemote)).toFixed(1)}% higher risk** primarily due to commute fatigue and uncompensated evening overtime. Granting 2-3 days hybrid flexibility reduces overall flight risk by an estimated 22%.`,
      };
    }

    // 5. R&D Retention Plan
    if (q.includes("r&d") || q.includes("rd") || q.includes("action plan") || q.includes("plan")) {
      return {
        id: `asst-${Date.now()}`,
        sender: "assistant",
        timestamp: time,
        text: `### 🔬 Executive Retention Action Plan: R&D Division

**Current Vulnerability:** 16.8% Attrition Rate ($2.89M Capital Exposure)

**Prescriptive 4-Point Strategy:**
1. **Market Equity Calibration**: R&D Principal Scientists and Lead Designers are 14% below tier-1 semiconductor and AI research compensation. Allocate **$180k pooled equity refreshes**.
2. **Workload Balancing**: Lead AI Scientist *Dr. Elena Rostova* and Product Director *Natasha Romanoff-Smith* both exceed 40h/mo overtime. Provision 2 dedicated junior machine learning engineers.
3. **Intellectual Property Fellowship**: Provide $15k conference/publishing grants to fulfill career growth drivers.
4. **Estimated Outcome**: 42% risk reduction across R&D with estimated net payback in under 6 months.`,
        actionPayload: {
          type: "inspect_employee",
          employeeId: "EMP-1042",
          label: "Inspect R&D Lead: Dr. Elena Rostova",
        },
      };
    }

    // General Fallback
    return {
      id: `asst-${Date.now()}`,
      sender: "assistant",
      timestamp: time,
      text: `### 🤖 Analysis Query Results

Searching telemetry across **${currentEmployees.length} employee records**:
- Active Flight-Risks: **${currentEmployees.filter((e) => e.riskLevel === "Critical" || e.riskLevel === "High").length} employees**
- Primary Macro Driver: **Compensation Disparity** (34% weight) followed by **Excessive Overtime** (26% weight).

You can ask me to simulate policy changes, inspect specific departments (Sales, Engineering, R&D), or analyze replacement exposure!`,
    };
  };

  const handleExecuteAction = (actionPayload: ChatMessage["actionPayload"]) => {
    if (!actionPayload) return;
    if (actionPayload.type === "inspect_employee" && actionPayload.employeeId) {
      onSelectEmployeeById(actionPayload.employeeId);
      onClose();
    } else if (actionPayload.type === "filter_dept" && actionPayload.dept) {
      onSetDeptFilter(actionPayload.dept);
      onClose();
    } else if (actionPayload.type === "apply_simulation" && actionPayload.params) {
      onApplySimParams(actionPayload.params);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 p-0.5 shadow-md flex items-center justify-center">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm">Vanguard HR Copilot</h3>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Natural Language Intelligence &amp; Retention Simulation
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

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto whitespace-nowrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" /> Quick Queries:
            </span>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium bg-slate-800/80 hover:bg-indigo-600/30 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-200 border border-slate-700/60 rounded-full transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "assistant" && (
                <div className="h-7 w-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-indigo-400" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white shadow-md rounded-tr-none"
                    : "bg-slate-950 border border-slate-800 text-slate-200 shadow-md rounded-tl-none"
                }`}
              >
                {/* Render simple markdown lines */}
                <div className="space-y-2 whitespace-pre-line">
                  {msg.text.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                {/* Action button inside message */}
                {msg.actionPayload && (
                  <div className="mt-3 pt-3 border-t border-slate-800">
                    <button
                      onClick={() => handleExecuteAction(msg.actionPayload)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow transition-colors active:scale-95"
                    >
                      <span>{msg.actionPayload.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div
                  className={`mt-1.5 text-[10px] text-right ${
                    msg.sender === "user" ? "text-indigo-200" : "text-slate-500"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === "user" && (
                <div className="h-7 w-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="h-7 w-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask Copilot (e.g., 'What are top drivers in Engineering?')..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl shadow-md transition-colors active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-[10px] text-slate-500 text-center mt-1.5">
            Powered by Enterprise Predictive Telemetry &amp; SHAP Explanations
          </div>
        </div>
      </div>
    </div>
  );
};
