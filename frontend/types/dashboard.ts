/*
=====================================
DASHBOARD STATS
=====================================
*/

export interface DashboardStats {

  total_reports: number;

  average_health_score: number;

  abnormal_biomarkers: number;

  high_risk_insights: number;
}

/*
=====================================
RECENT REPORT
=====================================
*/

export interface RecentReport {

  id: string;

  report_name: string;

  report_type: string;

  hospital_name: string;

  report_date: string;

  health_score: number;

  risk_level: string;
}

/*
=====================================
TOP CONCERN
=====================================
*/

export interface TopConcern {

  title: string;

  severity: string;

  count: number;
}

/*
=====================================
RECENT BIOMARKER
=====================================
*/

export interface RecentBiomarker {

  id: string;

  biomarker_name: string;

  value: string;

  unit: string;

  status: string;
}

/*
=====================================
DASHBOARD DATA
=====================================
*/

export interface DashboardData {

  stats: DashboardStats;

  recent_reports: RecentReport[];

  top_concerns: TopConcern[];

  recent_biomarkers: RecentBiomarker[];
}

/*
=====================================
FINAL API RESPONSE
=====================================
*/

export interface DashboardResponse {

  success: boolean;

  data: DashboardData;
}