export interface FinancialStats {
  expected: number;
  overdue: number;
  currency: string;
}

export interface RiskProfile {
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  factor: number; // 0 to 100 for visual bar
}

export interface ActionItem {
  type: 'REMINDER' | 'ESCALATION' | 'SETTLEMENT';
  title: string;
  draftContent: string;
}

export interface AnalysisResult {
  summary: string;
  invoiceDetails: {
    number: string;
    dueDate: string;
    amount: string;
    status: string;
  };
  findings: string[];
  financialStats: FinancialStats;
  riskProfile: RiskProfile;
  recommendedActions: ActionItem[];
}

export interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'pdf' | 'other';
}
