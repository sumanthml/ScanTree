import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
  Pressable,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useEffect, useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { LineChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import { useProfileStore } from "@/store/profileStore";
import { useDashboardStore } from "@/store/dashboardStore";
import AppText from "@/components/ui/AppText";
import { getBiomarkerExplanation } from "@/utils/biomarkers";
import {
  Award,
  FileText,
  ShieldAlert,
  Activity,
  Calendar,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Upload,
  BarChart2,
  Heart,
  User,
  Clock,
} from "lucide-react-native";

const IS_WEB = Platform.OS === "web";

/* ─── HELPERS ──────────────────────────────────────────── */

function healthStatus(score: number): { label: string; emoji: string; color: string; desc: string } {
  if (score >= 85) return { label: "Excellent", emoji: "💚", color: "#4ADE80", desc: "Your results look great! Keep up your healthy lifestyle." };
  if (score >= 70) return { label: "Good", emoji: "💙", color: "#3B82F6", desc: "Most values are normal. A few could use attention." };
  if (score >= 50) return { label: "Needs Attention", emoji: "💛", color: "#F59E0B", desc: "Some biomarkers are outside healthy ranges. Consider consulting your doctor." };
  if (score > 0) return { label: "Critical", emoji: "❤️‍🩹", color: "#EF4444", desc: "Several values need urgent medical attention." };
  return { label: "No Data", emoji: "🩶", color: "#475569", desc: "Upload a report to see your health status." };
}

function formatDate(d: any): string {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ─── SMALL COMPONENTS ─────────────────────────────────── */

function Card({ title, value, subtitle, icon: Icon, color }: any) {
  return (
    <LinearGradient
      colors={["rgba(255, 255, 255, 0.04)", "rgba(255, 255, 255, 0.01)"]}
      style={styles.metric}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <AppText style={styles.metricTitle}>{title}</AppText>
          <AppText style={styles.metricValue}>{value}</AppText>
          {subtitle ? <AppText style={styles.metricSub}>{subtitle}</AppText> : null}
        </View>
        <View style={[styles.iconContainer, { backgroundColor: `${color}18` }]}>
          <Icon size={20} color={color} />
        </View>
      </View>
    </LinearGradient>
  );
}

function QuickAction({ icon: Icon, label, color, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={styles.quickAction}>
      <View style={[styles.quickActionIcon, { backgroundColor: `${color}15` }]}>
        <Icon size={18} color={color} />
      </View>
      <AppText style={styles.quickActionLabel}>{label}</AppText>
    </TouchableOpacity>
  );
}

function SafeLineChart({ data, color, labels: inputLabels }: { data: number[]; color: string; labels?: string[] }) {
  const { width } = useWindowDimensions();
  const safeData = data.length < 2 ? [...data, ...Array(2 - data.length).fill(data[0] ?? 0)] : data;
  const labels = inputLabels && inputLabels.length === safeData.length
    ? inputLabels
    : safeData.map((_, i) => String(i + 1));

  const chartWidth = IS_WEB ? Math.min(width - 320, 1100) : Math.min(width - 40, 600);

  return (
    <LineChart
      width={chartWidth}
      height={200}
      bezier
      data={{ labels, datasets: [{ data: safeData }] }}
      chartConfig={{
        backgroundGradientFrom: "#0F172A",
        backgroundGradientTo: "#0F172A",
        decimalPlaces: 0,
        color: (o = 1) => `rgba(${color}, ${o})`,
        labelColor: () => "#94A3B8",
        propsForDots: { r: "4", strokeWidth: "2", stroke: `rgba(${color}, 1)` },
        propsForBackgroundLines: { stroke: "rgba(255, 255, 255, 0.05)" },
      }}
      style={{ borderRadius: 16 }}
      withShadow={false}
    />
  );
}

function DashboardSkeleton() {
  return (
    <LinearGradient colors={["#020617", "#0F172A"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.skeletonText, { width: 200, height: 38, marginBottom: 8 }]} />
        <View style={[styles.skeletonText, { width: 150, height: 18, marginBottom: 30 }]} />
        <View style={styles.skeletonChart} />
        <View style={styles.metricRow}>
          <View style={styles.skeletonMetric} />
          <View style={styles.skeletonMetric} />
        </View>
        <View style={styles.metricRow}>
          <View style={styles.skeletonMetric} />
          <View style={styles.skeletonMetric} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

/* ─── MAIN SCREEN ──────────────────────────────────────── */

export default function DashboardScreen() {
  const { activeProfile } = useProfileStore();
  const { dashboard, isLoading, fetchDashboard } = useDashboardStore();
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    async function checkGuide() {
      const hideVal = await AsyncStorage.getItem("scantree_hide_guide");
      if (hideVal !== "true") {
        setShowGuide(true);
      }
    }
    checkGuide();
  }, []);

  const dismissGuide = async () => {
    await AsyncStorage.setItem("scantree_hide_guide", "true");
    setShowGuide(false);
  };

  function refresh() {
    if (activeProfile?.id) {
      fetchDashboard(activeProfile.id);
    }
  }

  useEffect(() => {
    refresh();
  }, [activeProfile?.id]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [activeProfile?.id])
  );

  if (!activeProfile) {
    return (
      <LinearGradient colors={["#020617", "#0F172A"]} style={styles.center}>
        <TrendingUp size={48} color="#334155" style={{ marginBottom: 16 }} />
        <AppText style={{ color: "#94A3B8", fontSize: 16, textAlign: "center" }}>
          Select or Create a Profile to Begin
        </AppText>
      </LinearGradient>
    );
  }

  if (isLoading && !dashboard) {
    return <DashboardSkeleton />;
  }

  const overview = dashboard?.overview || {};
  const healthHistory = dashboard?.health_history || [];
  const riskHistory = dashboard?.risk_progression || [];
  const recentReports = dashboard?.recent_reports || [];
  const critical = dashboard?.critical_changes || [];
  const aiSummary = dashboard?.ai_summary || [];

  const healthScores = healthHistory.map((x: any) => x.health_score || 0);
  const latestScore = overview.latest_health_score || overview.average_health_score || 0;
  const status = healthStatus(latestScore);

  return (
    <LinearGradient colors={["#020617", "#0F172A"]} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refresh}
            tintColor="#4ADE80"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* ── GREETING ── */}
        <AppText style={styles.heading}>{activeProfile.full_name}</AppText>
        <AppText style={styles.sub}>Healthcare Dashboard</AppText>

        {/* ── FIRST TIME USER GUIDE ── */}
        {showGuide && (
          <LinearGradient
            colors={["rgba(34, 197, 94, 0.08)", "rgba(37, 99, 235, 0.03)"]}
            style={styles.guideCard}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Sparkles size={18} color="#4ADE80" />
                <AppText style={{ color: "#F8FAFC", fontSize: 16, fontWeight: "800" }}>
                  Quick Start Guide 🌿
                </AppText>
              </View>
              <TouchableOpacity onPress={dismissGuide} hitSlop={10}>
                <AppText style={{ color: "#64748B", fontSize: 13, fontWeight: "700" }}>Dismiss</AppText>
              </TouchableOpacity>
            </View>
            <AppText style={{ color: "#94A3B8", fontSize: 13, lineHeight: 18, marginBottom: 16 }}>
              Welcome to ScanTrace! Follow these simple steps to analyze and track your medical lab reports:
            </AppText>
            {[
              { step: "1", title: "Upload a Lab Report", desc: "Navigate to the 'Upload' tab, choose a PDF or take a photo of your test report. Our AI will automatically extract and parse the values." },
              { step: "2", title: "Understand Biomarkers", desc: "Go to the 'Analytics' tab to view interactive trend graphs. We translate confusing medical jargon into simple terms." },
              { step: "3", title: "Share Access Securely", desc: "Want a doctor or family member to see your reports? Go to the 'Access' tab and invite them via their email." }
            ].map((item, idx) => (
              <View key={idx} style={{ flexDirection: "row", gap: 12, marginBottom: idx < 2 ? 14 : 0, alignItems: "flex-start" }}>
                <View style={styles.guideStepNumber}>
                  <AppText style={styles.guideStepNumberText}>{item.step}</AppText>
                </View>
                <View style={{ flex: 1 }}>
                  <AppText style={{ color: "#F1F5F9", fontSize: 14, fontWeight: "700" }}>{item.title}</AppText>
                  <AppText style={{ color: "#64748B", fontSize: 12, lineHeight: 16, marginTop: 2 }}>{item.desc}</AppText>
                </View>
              </View>
            ))}
          </LinearGradient>
        )}

        {/* ── HEALTH STATUS HERO CARD ── */}
        <LinearGradient
          colors={[`${status.color}12`, "rgba(255,255,255,0.02)"]}
          style={styles.heroCard}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flex: 1 }}>
              <AppText style={styles.heroLabel}>OVERALL HEALTH</AppText>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 }}>
                <AppText style={{ fontSize: 20 }}>{status.emoji}</AppText>
                <AppText style={[styles.heroStatus, { color: status.color }]}>{status.label}</AppText>
              </View>
              <AppText style={styles.heroDesc}>{status.desc}</AppText>
            </View>
            <View style={[styles.scoreBubble, { borderColor: `${status.color}40`, backgroundColor: `${status.color}15` }]}>
              <AppText style={[styles.scoreNum, { color: status.color }]}>
                {latestScore > 0 ? Math.round(latestScore) : "—"}
              </AppText>
              <AppText style={[styles.scoreOf, { color: status.color }]}>/100</AppText>
            </View>
          </View>

          {/* Profile info row */}
          <View style={styles.profileInfoRow}>
            <View style={styles.profileInfoItem}>
              <User size={13} color="#64748B" />
              <AppText style={styles.profileInfoText}>
                {activeProfile.relationship_type || "Self"}
              </AppText>
            </View>
            <View style={styles.profileInfoItem}>
              <Clock size={13} color="#64748B" />
              <AppText style={styles.profileInfoText}>
                Last: {formatDate(overview.latest_report_date)}
              </AppText>
            </View>
          </View>
        </LinearGradient>

        {/* ── QUICK ACTIONS ── */}
        <View style={styles.quickActionsRow}>
          <QuickAction
            icon={Upload}
            label="Upload Report"
            color="#4ADE80"
            onPress={() => router.push("/(tabs)/upload")}
          />
          <QuickAction
            icon={BarChart2}
            label="Analytics"
            color="#3B82F6"
            onPress={() => router.push("/(tabs)/analytics")}
          />
          <QuickAction
            icon={Heart}
            label="Profiles"
            color="#A78BFA"
            onPress={() => router.push("/(tabs)/profile")}
          />
        </View>

        {/* ── METRICS GRID ── */}
        <View style={styles.metricRow}>
          <Card
            title="Health Score"
            value={String(overview.average_health_score ?? "—")}
            subtitle="Average"
            icon={Award}
            color="#4ADE80"
          />
          <Card
            title="Reports"
            value={String(overview.total_reports ?? 0)}
            subtitle="Uploaded"
            icon={FileText}
            color="#3B82F6"
          />
        </View>

        <View style={styles.metricRow}>
          <Card
            title="Abnormal"
            value={String(overview.abnormal_biomarkers ?? 0)}
            subtitle="Biomarkers"
            icon={ShieldAlert}
            color="#F97316"
          />
          <Card
            title="Risk Alerts"
            value={String(overview.high_risk_insights ?? 0)}
            subtitle="Flagged"
            icon={Activity}
            color="#EF4444"
          />
        </View>

        {/* ── HEALTH TIMELINE ── */}
        {healthScores.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <AppText style={styles.section}>Health Score Timeline</AppText>
            <AppText style={styles.sectionDesc}>
              How your overall wellness has changed across reports
            </AppText>
            <View style={styles.chartWrapper}>
              <SafeLineChart data={healthScores} color="74, 222, 128" />
            </View>
          </View>
        )}

        {/* ── CRITICAL ALERTS ── */}
        {critical.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <AppText style={styles.section}>⚠️ Values Needing Attention</AppText>
            <AppText style={styles.sectionDesc}>
              These test results are outside healthy ranges
            </AppText>
            {critical.map((item: any, i: number) => {
              const explanation = getBiomarkerExplanation(item.name);
              const severityLabel = item.severity === "CRITICAL" ? "Urgent" : item.severity === "HIGH" ? "High" : "Elevated";
              const severityColor = item.severity === "CRITICAL" ? "#EF4444" : item.severity === "HIGH" ? "#F97316" : "#F59E0B";
              return (
                <View style={[styles.card, { borderColor: `${severityColor}30`, backgroundColor: `${severityColor}06` }]} key={item.name ?? i}>
                  <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
                    <AlertTriangle size={20} color={severityColor} style={{ marginTop: 2 }} />
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <AppText style={styles.cardTitle}>{explanation.simpleName}</AppText>
                        <View style={[styles.severityBadge, { backgroundColor: `${severityColor}20` }]}>
                          <AppText style={[styles.severityText, { color: severityColor }]}>{severityLabel}</AppText>
                        </View>
                      </View>
                      <AppText style={{ color: severityColor, fontSize: 13, fontWeight: "600" }}>
                        Your value: {item.value}
                      </AppText>
                      <AppText style={styles.cardDesc}>
                        {explanation.description}
                      </AppText>
                      <View style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", padding: 10, borderRadius: 10, marginTop: 8, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.05)" }}>
                        <AppText style={{ color: "#E2E8F0", fontSize: 12, lineHeight: 17 }}>
                          <AppText style={{ fontWeight: "700", color: "#F1F5F9" }}>Why this matters: </AppText>
                          {explanation.whatItMeans}
                        </AppText>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* ── AI SUMMARY ── */}
        {aiSummary.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <AppText style={styles.section}>🤖 AI Health Insights</AppText>
            <AppText style={styles.sectionDesc}>
              Personalized observations from your lab results
            </AppText>
            {aiSummary.map((item: any, i: number) => (
              <View style={styles.card} key={i}>
                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                  <Sparkles size={18} color="#A78BFA" />
                  <AppText style={styles.cardTitle}>{item.title}</AppText>
                </View>
                <AppText style={styles.cardDesc}>{item.description}</AppText>
              </View>
            ))}
          </View>
        )}

        {/* ── RECENT REPORTS ── */}
        {recentReports.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <AppText style={styles.section}>Recent Reports</AppText>
            {recentReports.map((report: any) => {
              const rScore = report.health_score ?? 0;
              const rStatus = healthStatus(rScore);
              return (
                <Pressable
                  key={report.id}
                  onPress={() => router.push(`/report/${report.id}`)}
                  style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                      <Calendar size={18} color="#64748B" />
                      <View>
                        <AppText style={styles.cardTitle}>
                          {report.report_name || "Lab Medical Report"}
                        </AppText>
                        <AppText style={{ color: "#64748B", fontSize: 12, marginTop: 2 }}>
                          {formatDate(report.date)}
                        </AppText>
                      </View>
                    </View>
                    <View style={[styles.reportScoreBadge, { backgroundColor: `${rStatus.color}15` }]}>
                      <AppText style={[styles.reportScoreText, { color: rStatus.color }]}>
                        {rScore > 0 ? rScore : "—"}
                      </AppText>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* ── EMPTY STATE ── */}
        {!isLoading && recentReports.length === 0 && healthScores.length === 0 && (
          <View style={styles.emptyState}>
            <FileText size={48} color="#1E293B" style={{ marginBottom: 14 }} />
            <AppText style={{ color: "#64748B", fontSize: 15, textAlign: "center" }}>
              No health data yet.{"\n"}Upload your first report to get started.
            </AppText>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/upload")}
              activeOpacity={0.8}
              style={{ marginTop: 20 }}
            >
              <LinearGradient
                colors={["#22C55E", "#16A34A"]}
                style={styles.uploadBtn}
              >
                <Upload size={16} color="#FFF" />
                <AppText style={{ color: "#FFF", fontWeight: "700", fontSize: 14 }}>Upload First Report</AppText>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </LinearGradient>
  );
}

/* ─── STYLES ───────────────────────────────────────────── */

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 140, maxWidth: IS_WEB ? 1200 : undefined, alignSelf: IS_WEB ? "center" : undefined, width: "100%" },
  heading: { fontSize: 34, fontWeight: "900", color: "#F8FAFC", letterSpacing: -0.5 },
  sub: { color: "#64748B", fontSize: 15, marginTop: 4, marginBottom: 20 },

  /* Hero */
  heroCard: {
    padding: 20, borderRadius: 24, borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)", marginBottom: 16,
  },
  heroLabel: {
    color: "#475569", fontSize: 10, fontWeight: "800",
    textTransform: "uppercase", letterSpacing: 1,
  },
  heroStatus: { fontSize: 22, fontWeight: "900" },
  heroDesc: { color: "#94A3B8", fontSize: 13, lineHeight: 18, marginTop: 6 },
  profileInfoRow: {
    flexDirection: "row", gap: 20, marginTop: 14, paddingTop: 14,
    borderTopWidth: 1, borderTopColor: "rgba(255, 255, 255, 0.05)",
  },
  profileInfoItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  profileInfoText: { color: "#64748B", fontSize: 12, fontWeight: "600" },
  scoreBubble: {
    borderWidth: 1.5, borderRadius: 18, paddingHorizontal: 16,
    paddingVertical: 12, alignItems: "center", minWidth: 72,
  },
  scoreNum: { fontSize: 30, fontWeight: "900", lineHeight: 34 },
  scoreOf: { fontSize: 11, fontWeight: "700" },

  /* Quick Actions */
  quickActionsRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  quickAction: {
    flex: 1, backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 16, padding: 14, alignItems: "center", gap: 8,
    borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.05)",
  },
  quickActionIcon: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: "center", alignItems: "center",
  },
  quickActionLabel: { color: "#94A3B8", fontSize: 11, fontWeight: "700", textAlign: "center" },

  /* Metrics */
  metricRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  metric: {
    flex: 1, padding: 18, borderRadius: 22,
    borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.06)",
  },
  metricTitle: {
    color: "#64748B", fontSize: 12, fontWeight: "700",
    letterSpacing: 0.5, textTransform: "uppercase",
  },
  metricValue: { color: "#F8FAFC", fontSize: 28, fontWeight: "900", marginTop: 6 },
  metricSub: { color: "#475569", fontSize: 11, fontWeight: "600", marginTop: 2 },
  iconContainer: { padding: 8, borderRadius: 12 },

  /* Sections */
  section: { fontSize: 20, fontWeight: "800", marginTop: 26, marginBottom: 4, color: "#F8FAFC" },
  sectionDesc: { color: "#64748B", fontSize: 13, marginBottom: 16, lineHeight: 18 },
  chartWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.02)", borderRadius: 20,
    borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.04)",
    padding: 10, alignItems: "center", overflow: "hidden",
  },

  /* Cards */
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.03)", padding: 18,
    borderRadius: 20, marginBottom: 10, borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  cardTitle: { color: "#F8FAFC", fontSize: 15, fontWeight: "700" },
  cardDesc: { color: "#94A3B8", fontSize: 13, lineHeight: 18, marginTop: 4 },
  severityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  severityText: { fontSize: 10, fontWeight: "800", textTransform: "uppercase" },

  /* Report badges */
  reportScoreBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, alignItems: "center" },
  reportScoreText: { fontSize: 16, fontWeight: "900" },

  /* Upload button */
  uploadBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 13, paddingHorizontal: 24, borderRadius: 14,
  },

  /* States */
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  emptyState: { marginTop: 60, alignItems: "center", paddingHorizontal: 20 },

  /* Skeleton */
  skeletonText: { backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: 8 },
  skeletonMetric: {
    flex: 1, height: 94, backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 22, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.05)",
  },
  skeletonChart: {
    height: 200, backgroundColor: "rgba(255, 255, 255, 0.02)", borderRadius: 20,
    borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.05)", marginBottom: 12,
  },

  /* Guide */
  guideCard: {
    padding: 20, borderRadius: 24, borderWidth: 1,
    borderColor: "rgba(74, 222, 128, 0.15)", marginBottom: 16,
  },
  guideStepNumber: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: "rgba(74, 222, 128, 0.15)",
    justifyContent: "center", alignItems: "center", marginTop: 2,
  },
  guideStepNumberText: { color: "#4ADE80", fontSize: 12, fontWeight: "800" },
});
