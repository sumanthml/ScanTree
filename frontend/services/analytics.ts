import API from "./api";

export interface AnalyticsOverview {
  total_reports: number;
  average_health_score: number;
  latest_health_score: number;
  abnormal_biomarkers?: number;
}

export interface AnalyticsData {
  overview: AnalyticsOverview;
  health_history: { health_score: number; date?: string }[];
  dynamic_biomarkers: {
    name: string;
    unit?: string;
    status?: string;
    history: { date: string; value: number }[];
  }[];
  critical_changes: {
    name: string;
    change_percent: number;
    trend?: string;
    risk_level?: string;
    clinical_status?: string;
    title?: string;
    description?: string;
  }[];
  comparison_insights: {
    title: string;
    description: string;
  }[];
}

/**
 * Fetch analytics for a profile — calls GET /analytics/profile/{id}/trends
 * Returns normalized AnalyticsData for the analytics screen.
 */
export async function getProfileAnalytics(profileId: string): Promise<AnalyticsData> {
  const response = await API.get(`/analytics/profile/${profileId}/trends`);

  // Backend wraps in { success, data }
  const body = response.data;
  const raw = body?.data ?? body ?? {};

  // Normalize the shape to what analytics.tsx expects
  return {
    overview: {
      total_reports: raw?.overview?.total_reports ?? 0,
      average_health_score: raw?.overview?.average_health_score ?? 0,
      latest_health_score: raw?.overview?.latest_health_score ?? 0,
      abnormal_biomarkers: raw?.overview?.abnormal_biomarkers ?? 0,
    },
    health_history: Array.isArray(raw?.health_history) ? raw.health_history : [],
    dynamic_biomarkers: Array.isArray(raw?.dynamic_biomarkers) ? raw.dynamic_biomarkers : [],
    critical_changes: Array.isArray(raw?.critical_changes) ? raw.critical_changes : [],
    comparison_insights: Array.isArray(raw?.comparison_insights) ? raw.comparison_insights :
      Array.isArray(raw?.ai_insights) ? raw.ai_insights : [],
  };
}