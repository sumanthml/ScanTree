import API from "./api";

/**
 * GET /dashboard/{profileId}
 * Returns raw data — no wrapping needed,
 * backend returns overview, health_history, etc. directly.
 */
export async function getDashboard(profileId: string) {
  const response = await API.get(`/dashboard/${profileId}`);
  const body = response.data;
  // Backend may return { success, ...data } or just the data directly
  // Normalize so dashboardStore always gets a flat object
  if (body?.overview) return body;           // already flat
  if (body?.data?.overview) return body.data; // nested under data
  return body;
}