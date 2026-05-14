// frontend/utils/constants.ts

export const APP_NAME = "ScanTrace";

export const APP_VERSION = "1.0.0";

export const API_BASE_URL =
  "http://localhost:8000/api";

// STORAGE KEYS
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
  THEME_MODE: "theme_mode",
};

// ROUTES
export const ROUTES = {
  LOGIN: "/(auth)/login",
  REGISTER: "/(auth)/register",

  DASHBOARD: "/(tabs)/dashboard",
  REPORTS: "/(tabs)/reports",
  UPLOAD: "/(tabs)/upload",
  NOTIFICATIONS:
    "/(tabs)/notifications",
  PROFILE: "/(tabs)/profile",
};

// REPORT STATUS
export const REPORT_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  ANALYZING: "analyzing",
  COMPLETED: "completed",
  FAILED: "failed",
};

// BIOMARKER STATUS
export const BIOMARKER_LEVELS = {
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high",
  CRITICAL: "critical",
};

// COLORS
export const COLORS = {
  PRIMARY: "#22C55E",
  SECONDARY: "#2563EB",

  SUCCESS: "#22C55E",
  WARNING: "#F59E0B",
  DANGER: "#EF4444",
  INFO: "#3B82F6",

  DARK: "#0F172A",
  LIGHT: "#F8FAFC",
};

// AI PROCESSING STEPS
export const AI_STEPS = [
  "Uploading report",
  "OCR extraction",
  "Biomarker mapping",
  "Validation & normalization",
  "Historical comparison",
  "AI insight generation",
  "Severity detection",
  "Final report generation",
];

// DASHBOARD STATS
export const DASHBOARD_STATS = [
  {
    label: "Health Score",
    value: "86",
    change: "+4.2%",
    color: "#22C55E",
  },

  {
    label: "Reports",
    value: "18",
    change: "+2",
    color: "#2563EB",
  },

  {
    label: "Critical Alerts",
    value: "03",
    change: "-1",
    color: "#EF4444",
  },

  {
    label: "AI Insights",
    value: "126",
    change: "+18%",
    color: "#7C3AED",
  },
];

// MOCK REPORTS
export const MOCK_REPORTS = [
  {
    id: "report_001",
    title: "Complete Blood Count",
    hospital: "Apollo Hospitals",
    date: "12 May 2026",
    status: "completed",
  },

  {
    id: "report_002",
    title: "Lipid Profile",
    hospital: "Fortis Healthcare",
    date: "08 May 2026",
    status: "processing",
  },

  {
    id: "report_003",
    title: "Vitamin Analysis",
    hospital: "AIIMS Delhi",
    date: "02 May 2026",
    status: "completed",
  },
];

// FLOATING AI INSIGHTS
export const FLOATING_INSIGHTS = [
  {
    title: "Glucose",
    status: "↑ 18%",
    color: "#EF4444",
  },

  {
    title: "Hemoglobin",
    status: "↓ 6%",
    color: "#F59E0B",
  },

  {
    title: "Cholesterol",
    status: "Normal",
    color: "#22C55E",
  },
];