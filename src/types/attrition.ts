export type RiskLevel = "Critical" | "High" | "Medium" | "Low";

export type RetentionStatus =
  | "Unaddressed"
  | "Action In Review"
  | "Intervention Applied"
  | "Retained";

export type PrimaryDriver =
  | "Compensation Disparity"
  | "Excessive Overtime"
  | "Low Engagement"
  | "High Absenteeism"
  | "Long Commute Distance"
  | "Lack of Career Growth"
  | "Manager Friction";

export interface AIRecommendation {
  action: string;
  expectedRiskReduction: number; // percentage points e.g. 28
  costEstimate: number;
  confidence: number; // 0 - 100
  rationale: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  workArrangement: "Remote" | "Hybrid" | "Onsite";
  tenureYears: number;
  monthlyHours: number;
  overtimeHours: number;
  performanceScore: number; // 1.0 - 5.0
  salary: number;
  compaRatio: number; // 0.7 - 1.3 (relative to market median)
  engagementScore: number; // 0 - 100
  absenteeismDays: number;
  distanceKm: number;
  trainingHoursLastYear: number;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  primaryDriver: PrimaryDriver;
  secondaryDriver?: string;
  replacementCost: number;
  retentionStatus: RetentionStatus;
  appliedAction?: string;
  aiRecommendation: AIRecommendation;
  historicalRisk: { month: string; risk: number }[];
  breakdown: {
    workload: number;
    compensation: number;
    engagement: number;
    careerGrowth: number;
    commute: number;
  };
}

export interface DriverImpact {
  name: PrimaryDriver;
  impactWeight: number; // 0-100
  affectedHeadcount: number;
  avgRiskLift: number;
  category: "Compensation" | "Workload" | "Culture" | "Logistics" | "Development";
}

export interface DepartmentMetric {
  department: string;
  totalEmployees: number;
  highRiskCount: number;
  avgRiskScore: number;
  attritionRate: number;
  replacementCostExposure: number;
  primaryDriver: PrimaryDriver;
}

export interface SimulationParams {
  salaryAdjustmentPercent: number; // 0 to 25%
  overtimeReductionPercent: number; // 0 to 50%
  remoteDaysPerWeek: number; // 0 to 5
  upskillingProgramEnabled: boolean;
  retentionBonusBudget: number; // $
}

export interface SimulationResult {
  currentAttritionRate: number;
  predictedAttritionRate: number;
  rateReduction: number;
  currentRiskHeadcount: number;
  predictedRiskHeadcount: number;
  headcountSaved: number;
  annualReplacementCostSaved: number;
  interventionCost: number;
  netSavings: number;
  roiPercent: number;
}
