import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Pressable,
  Alert as RNAlert,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from "react-native";

import { useAlertStore } from "@/store/alertStore";

const Alert = {
  alert: (
    title: string,
    message?: string,
    buttons?: { text: string; onPress?: () => void; style?: "default" | "cancel" | "destructive" }[]
  ) => {
    useAlertStore.getState().showAlert(title, message, buttons);
  },
};
import { router, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Screen from "@/components/ui/Screen";
import AppText from "@/components/ui/AppText";
import { useProfileStore } from "@/store/profileStore";
import { useResponsive } from "@/hooks/useResponsive";
import API from "@/services/api";
import {
  FileText,
  Calendar,
  Building2,
  AlertTriangle,
  Trash2,
  Plus,
  ChevronRight,
} from "lucide-react-native";

interface Biomarker {
  id: string;
  name: string;
  severity: string;
}

interface Report {
  id: string;
  report_name: string;
  report_type: string;
  hospital_name: string;
  report_date: string;
  created_at: string;
  health_score: number;
  status: string;
  summary?: string;
  biomarkers: Biomarker[];
}

// ─────────────────────────────────────────────
// Skeleton loader
// ─────────────────────────────────────────────
function ReportSkeleton() {
  return (
    <View style={{ gap: 14 }}>
      <View style={[styles.skeletonText, { width: 140, height: 28, marginBottom: 8 }]} />
      <View style={[styles.skeletonText, { width: 180, height: 16, marginBottom: 16 }]} />
      <View style={styles.skeletonSummaryRow}>
        <View style={styles.skeletonSummaryCard} />
        <View style={styles.skeletonSummaryCard} />
      </View>
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.skeletonCard} />
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────
export default function ReportsScreen() {
  const { isMobile } = useResponsive();
  const { activeProfile } = useProfileStore();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchReports(isRefresh = false) {
    try {
      if (!activeProfile?.id) {
        setReports([]);
        return;
      }
      if (isRefresh) setRefreshing(true);
      const response = await API.get(`/profiles/${activeProfile.id}/reports`);
      const data = response.data?.data || response.data || [];
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("REPORT ERROR", err);
      setReports([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchReports();
  }, [activeProfile?.id]);

  // Auto-refresh when tab comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, [activeProfile?.id])
  );

  async function onRefresh() {
    await fetchReports(true);
  }

  async function handleDelete(id: string, name: string) {
    Alert.alert(
      "Delete Report",
      `Are you sure you want to permanently delete "${name || "this report"}"?\n\nThis action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingId(id);
              await API.delete(`/reports/${id}`);
              setReports((prev) => prev.filter((x) => x.id !== id));
            } catch (err) {
              console.log(err);
              Alert.alert("Error", "Failed to delete report. Please try again.");
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  }

  function criticalCount(report: Report) {
    return (report.biomarkers || []).filter((x) =>
      ["HIGH", "CRITICAL"].includes(x.severity?.toUpperCase())
    ).length;
  }

  function getScoreColor(score: number | null) {
    if (score === null || score === undefined) return "#64748B";
    if (score >= 80) return "#4ADE80";
    if (score >= 50) return "#F59E0B";
    return "#EF4444";
  }

  // ── Loading ──
  if (loading && reports.length === 0) {
    return (
      <Screen scrollable={false}>
        <ScrollView contentContainerStyle={styles.container}>
          <ReportSkeleton />
        </ScrollView>
      </Screen>
    );
  }

  // ── No profile ──
  if (!activeProfile) {
    return (
      <Screen>
        <View style={styles.emptyCenter}>
          <FileText size={48} color="#1E293B" style={{ marginBottom: 16 }} />
          <AppText style={styles.emptyText}>Select a profile to view reports</AppText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scrollable={false}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4ADE80"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={[styles.header, isMobile && { paddingRight: 60 }]}>
          <AppText variant="heading" style={styles.headingText}>
            Medical Reports
          </AppText>
          <AppText style={styles.subText}>
            AI-processed health reports &amp; history
          </AppText>
        </View>

        {/* SUMMARY CARDS */}
        <View style={styles.summaryRow}>
          <LinearGradient
            colors={["rgba(59,130,246,0.08)", "rgba(59,130,246,0.02)"]}
            style={[styles.summaryCard, { borderColor: "rgba(59,130,246,0.15)" }]}
          >
            <AppText style={styles.summaryTitle}>Total Reports</AppText>
            <AppText style={[styles.summaryValue, { color: "#3B82F6" }]}>
              {reports.length}
            </AppText>
          </LinearGradient>

          <LinearGradient
            colors={["rgba(239,68,68,0.08)", "rgba(239,68,68,0.02)"]}
            style={[styles.summaryCard, { borderColor: "rgba(239,68,68,0.15)" }]}
          >
            <AppText style={styles.summaryTitle}>Critical Cases</AppText>
            <AppText style={[styles.summaryValue, { color: "#EF4444" }]}>
              {reports.filter((x) => criticalCount(x) > 0).length}
            </AppText>
          </LinearGradient>
        </View>

        {/* UPLOAD BUTTON */}
        <Pressable
          onPress={() => router.push("/(tabs)/upload")}
          style={({ pressed }) => [styles.uploadBtn, pressed && { opacity: 0.8 }]}
        >
          <LinearGradient
            colors={["rgba(74,222,128,0.12)", "rgba(74,222,128,0.04)"]}
            style={styles.uploadBtnInner}
          >
            <Plus size={18} color="#4ADE80" />
            <AppText style={styles.uploadBtnText}>Upload New Report</AppText>
          </LinearGradient>
        </Pressable>

        {/* REPORT LIST */}
        {reports.length === 0 ? (
          <LinearGradient
            colors={["rgba(255,255,255,0.03)", "rgba(255,255,255,0.01)"]}
            style={styles.emptyContainer}
          >
            <FileText size={48} color="#64748B" style={{ marginBottom: 12 }} />
            <AppText style={styles.emptyText}>No reports available yet.</AppText>
            <AppText style={{ color: "#475569", fontSize: 13, marginTop: 6, textAlign: "center" }}>
              Upload your first lab report to get started.
            </AppText>
          </LinearGradient>
        ) : (
          <View style={!isMobile ? { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" } : {}}>
            {reports.map((report) => {
              const hasCritical = criticalCount(report) > 0;
              const scoreColor = getScoreColor(report.health_score);
              const isDeleting = deletingId === report.id;

              return (
                <View key={report.id} style={!isMobile ? { width: "49%", marginBottom: 14 } : { width: "100%" }}>
                  <View style={[styles.cardWrapper, { marginBottom: 0 }]}>
                    {/* 
                      Using separate TouchableOpacity for the card body and delete button
                      to avoid propagation issues on React Native 
                    */}
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => router.push(`/report/${report.id}`)}
                      style={styles.cardTouchable}
                    >
                      <LinearGradient
                        colors={["rgba(255, 255, 255, 0.04)", "rgba(255, 255, 255, 0.01)"]}
                        style={[
                          styles.reportCard,
                          hasCritical && { borderColor: "rgba(239,68,68,0.2)" },
                        ]}
                      >
                        <View style={{ flex: 1, marginRight: 12 }}>
                          {/* Title */}
                          <AppText style={styles.reportTitle}>
                            {report.report_name || report.report_type || "Lab Medical Report"}
                          </AppText>

                          {/* Hospital */}
                          <View style={styles.metaRow}>
                            <Building2 size={13} color="#64748B" />
                            <AppText style={styles.metaText}>
                              {report.hospital_name || "Unknown Clinic"}
                            </AppText>
                          </View>

                          {/* Date */}
                          <View style={styles.metaRow}>
                            <Calendar size={13} color="#64748B" />
                            <AppText style={styles.metaText}>
                              {new Date(report.created_at).toLocaleDateString("en-GB", {
                                day: "2-digit", month: "short", year: "numeric"
                              })}
                            </AppText>
                          </View>

                          {/* Pills */}
                          <View style={styles.statsRow}>
                            <View style={[styles.pill, { backgroundColor: `${scoreColor}18` }]}>
                              <AppText style={[styles.pillText, { color: scoreColor }]}>
                                Health: {report.health_score ?? "--"}
                              </AppText>
                            </View>

                            {hasCritical && (
                              <View style={[styles.pill, { backgroundColor: "rgba(239,68,68,0.1)" }]}>
                                <AlertTriangle size={11} color="#EF4444" />
                                <AppText style={[styles.pillText, { color: "#EF4444", marginLeft: 4 }]}>
                                  {criticalCount(report)} Alert{criticalCount(report) > 1 ? "s" : ""}
                                </AppText>
                              </View>
                            )}
                          </View>
                        </View>

                        {/* Right column: status + chevron */}
                        <View style={styles.rightColumn}>
                          <View
                            style={[
                              styles.statusBadge,
                              {
                                backgroundColor:
                                  report.status === "COMPLETED"
                                    ? "rgba(74,222,128,0.1)"
                                    : "rgba(255,255,255,0.06)",
                              },
                            ]}
                          >
                            <AppText
                              style={[
                                styles.statusText,
                                { color: report.status === "COMPLETED" ? "#4ADE80" : "#94A3B8" },
                              ]}
                            >
                              {report.status}
                            </AppText>
                          </View>
                          <ChevronRight size={16} color="#475569" />
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>

                    {/* Delete button — separate from card body to avoid propagation */}
                    <TouchableOpacity
                      onPress={() =>
                        handleDelete(
                          report.id,
                          report.report_name || report.report_type || "Report"
                        )
                      }
                      style={styles.deleteButton}
                      activeOpacity={0.7}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <ActivityIndicator size="small" color="#EF4444" />
                      ) : (
                        <Trash2 size={15} color="#EF4444" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </Screen>
  );
}

const IS_WEB = Platform.OS === "web";

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 140,
    maxWidth: IS_WEB ? 1100 : undefined,
    alignSelf: IS_WEB ? "center" : undefined,
    width: "100%",
  },
  header: {
    marginBottom: 24,
  },
  headingText: {
    fontSize: 34,
    fontWeight: "900",
    color: "#F8FAFC",
    letterSpacing: -0.5,
  },
  subText: {
    color: "#64748B",
    fontSize: 15,
    marginTop: 6,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  summaryTitle: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  summaryValue: {
    color: "#F8FAFC",
    fontSize: 32,
    fontWeight: "900",
    marginTop: 6,
  },
  uploadBtn: {
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 24,
  },
  uploadBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(74,222,128,0.2)",
    borderRadius: 18,
  },
  uploadBtnText: {
    color: "#4ADE80",
    fontWeight: "700",
    fontSize: 15,
  },
  // Card layout: card body + delete button side by side
  cardWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  cardTouchable: {
    flex: 1,
  },
  reportCard: {
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "rgba(239,68,68,0.08)",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.15)",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 42,
    minHeight: 42,
  },
  reportTitle: {
    fontWeight: "800",
    fontSize: 16,
    color: "#F8FAFC",
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  metaText: {
    color: "#94A3B8",
    fontSize: 13,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    alignItems: "center",
    flexWrap: "wrap",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  pillText: {
    fontSize: 11,
    fontWeight: "700",
  },
  rightColumn: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  emptyContainer: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  emptyCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    color: "#94A3B8",
    fontSize: 15,
    textAlign: "center",
  },
  // Skeleton
  skeletonText: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
  },
  skeletonSummaryRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 20,
  },
  skeletonSummaryCard: {
    flex: 1,
    height: 94,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  skeletonCard: {
    height: 130,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    marginBottom: 14,
  },
});