import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Platform,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, router } from "expo-router";
import AppText from "@/components/ui/AppText";
import { useProfileStore } from "@/store/profileStore";
import { getProfileAnalytics, AnalyticsData } from "@/services/analytics";
import { getBiomarkerExplanation } from "@/utils/biomarkers";
import { useResponsive } from "@/hooks/useResponsive";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  FileText,
  Award,
  AlertTriangle,
  Lightbulb,
  BarChart2,
  Minus,
} from "lucide-react-native";

const IS_WEB = Platform.OS === "web";

// ─────────────────────────────────────────────
// Safe Line Chart — guards against < 2 points
// ─────────────────────────────────────────────
function SafeLineChart({
  rawData,
  colorRgb,
  height = 200,
  labels,
  width,
}: {
  rawData: number[];
  colorRgb: string;
  height?: number;
  labels?: string[];
  width?: number;
}) {
  const { width: windowWidth } = useWindowDimensions();
  const chartWidth = width || Math.min(windowWidth - 48, 600);

  if (!rawData || rawData.length === 0) {
    return (
      <View style={safeChartStyles.empty}>
        <BarChart2 size={24} color="#334155" />
        <AppText style={safeChartStyles.emptyText}>Not enough data yet</AppText>
      </View>
    );
  }

  // LineChart requires >= 2 data points
  const safeData = rawData.length < 2 ? [rawData[0], rawData[0]] : rawData;
  const safeLabels = labels && labels.length === safeData.length
    ? labels
    : safeData.map((_, i) => String(i + 1));

  return (
    <LineChart
      data={{ labels: safeLabels, datasets: [{ data: safeData }] }}
      width={chartWidth}
      height={height}
      bezier
      withDots={safeData.length <= 12}
      withShadow={false}
      withInnerLines
      withOuterLines={false}
      withVerticalLines={false}
      chartConfig={{
        backgroundGradientFrom: "#0B1220",
        backgroundGradientTo: "#0B1220",
        decimalPlaces: 1,
        color: (opacity = 1) => `rgba(${colorRgb}, ${opacity})`,
        labelColor: () => "#475569",
        propsForBackgroundLines: { stroke: "#1E293B", strokeDasharray: "4" },
        propsForLabels: { fontSize: 10 },
        propsForDots: {
          r: "3",
          strokeWidth: "1.5",
          stroke: `rgba(${colorRgb}, 1)`,
          fill: `rgba(${colorRgb}, 0.8)`,
        },
      }}
      style={safeChartStyles.chart}
    />
  );
}

const safeChartStyles = StyleSheet.create({
  empty: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  emptyText: {
    color: "#475569",
    fontSize: 13,
  },
  chart: {
    marginTop: 12,
    borderRadius: 16,
    alignSelf: "center",
  },
});

// ─────────────────────────────────────────────
// Metric Card
// ─────────────────────────────────────────────
function MetricCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  icon: any;
  color: string;
}) {
  return (
    <LinearGradient
      colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.01)"]}
      style={styles.metricCard}
    >
      <View style={[styles.metricIcon, { backgroundColor: `${color}18` }]}>
        <Icon size={18} color={color} />
      </View>
      <AppText style={styles.metricValue}>{value}</AppText>
      <AppText style={styles.metricLabel}>{title}</AppText>
    </LinearGradient>
  );
}

// ─────────────────────────────────────────────
// Section Card
// ─────────────────────────────────────────────
function SectionCard({
  title,
  children,
  style,
}: {
  title: string;
  children: React.ReactNode;
  style?: any;
}) {
  return (
    <LinearGradient
      colors={["rgba(255,255,255,0.04)", "rgba(255,255,255,0.01)"]}
      style={[styles.sectionCard, style]}
    >
      <AppText style={styles.sectionTitle}>{title}</AppText>
      {children}
    </LinearGradient>
  );
}

// ─────────────────────────────────────────────
// Health Status Badge
// ─────────────────────────────────────────────
function healthStatus(score: number): { label: string; color: string } {
  if (score >= 85) return { label: "Excellent", color: "#4ADE80" };
  if (score >= 70) return { label: "Good", color: "#3B82F6" };
  if (score >= 50) return { label: "Needs Attention", color: "#F59E0B" };
  if (score > 0) return { label: "Critical", color: "#EF4444" };
  return { label: "No Data", color: "#475569" };
}

// ─────────────────────────────────────────────
// Change trend icon
// ─────────────────────────────────────────────
function TrendIcon({ trend }: { trend?: string }) {
  if (!trend) return <Minus size={14} color="#475569" />;
  const up = trend.toLowerCase().includes("up") || trend.toLowerCase().includes("increas");
  const down = trend.toLowerCase().includes("down") || trend.toLowerCase().includes("decreas");
  if (up) return <TrendingUp size={14} color="#EF4444" />;
  if (down) return <TrendingDown size={14} color="#4ADE80" />;
  return <Minus size={14} color="#475569" />;
}

// ─────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────
export default function AnalyticsScreen() {
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const { isMobile, width: windowWidth } = useResponsive();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadAnalytics(isRefresh = false) {
    if (!activeProfile?.id) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const data = await getProfileAnalytics(activeProfile.id);
      setAnalytics(data);
    } catch (err: any) {
      console.log("Analytics error:", err?.response?.data || err?.message);
      setError("Could not load analytics. Pull down to retry.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, [activeProfile?.id]);

  useFocusEffect(
    useCallback(() => {
      loadAnalytics();
    }, [activeProfile?.id])
  );

  const overview = analytics?.overview ?? { total_reports: 0, average_health_score: 0, latest_health_score: 0 };
  const healthHistory = analytics?.health_history ?? [];
  const biomarkers = analytics?.dynamic_biomarkers ?? [];
  const criticalChanges = analytics?.critical_changes ?? [];
  const insights = analytics?.comparison_insights ?? [];

  const healthScores = useMemo(
    () => healthHistory.map((x) => Number(x.health_score ?? 0)),
    [healthHistory]
  );

  // ── No profile selected ──
  if (!activeProfile) {
    return (
      <LinearGradient colors={["#020617", "#0F172A"]} style={styles.centered}>
        <BarChart2 size={52} color="#1E293B" />
        <AppText style={styles.centeredTitle}>No Profile Selected</AppText>
        <AppText style={styles.centeredSub}>
          Select or create a profile to view your health analytics
        </AppText>
      </LinearGradient>
    );
  }

  // ── Loading ──
  if (loading) {
    return (
      <LinearGradient colors={["#020617", "#0F172A"]} style={styles.centered}>
        <ActivityIndicator size="large" color="#4ADE80" />
        <AppText style={{ color: "#475569", marginTop: 16, fontSize: 14 }}>
          Loading analytics…
        </AppText>
      </LinearGradient>
    );
  }

  // ── Empty State: No reports uploaded yet ──
  if (overview.total_reports === 0) {
    return (
      <LinearGradient colors={["#020617", "#0F172A"]} style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadAnalytics(true)}
              tintColor="#4ADE80"
              colors={["#4ADE80"]}
            />
          }
        >
          {/* HEADER */}
          <View style={isMobile && { paddingRight: 60 }}>
            <AppText style={styles.heading}>Analytics</AppText>
            <AppText style={styles.sub}>
              {activeProfile.full_name} · AI Healthcare Intelligence
            </AppText>
          </View>

          {/* BEAUTIFUL EMPTY STATE BOX */}
          <LinearGradient
            colors={["rgba(255,255,255,0.03)", "rgba(255,255,255,0.01)"]}
            style={styles.emptyCardContainer}
          >
            <View style={styles.emptyIconContainer}>
              <BarChart2 size={36} color="#4ADE80" />
            </View>
            <AppText style={styles.emptyTitle}>No Analytics Data Yet</AppText>
            <AppText style={styles.emptyDescription}>
              ScanTrace parses your medical reports to plot health scores, map biomarker trends, and generate clinical insights.
            </AppText>
            
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/upload")}
              style={styles.uploadCTA}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#22C55E", "#16A34A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.uploadCTAGradient}
              >
                <FileText size={16} color="#FFFFFF" />
                <AppText style={styles.uploadCTAText}>Upload First Report</AppText>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>

          {/* FEATURES OUTLINE */}
          <View style={{ marginTop: 32 }}>
            <AppText style={styles.featuresHeading}>
              What you will unlock
            </AppText>
            
            <View style={styles.featureRow}>
              <View style={styles.featureIconBox}>
                <Activity size={16} color="#3B82F6" />
              </View>
              <View style={{ flex: 1 }}>
                <AppText style={styles.featureTitle}>Biomarker Tracking</AppText>
                <AppText style={styles.featureSub}>
                  Compare test values over time with interactive line graphs.
                </AppText>
              </View>
            </View>

            <View style={styles.featureRow}>
              <View style={styles.featureIconBox}>
                <Award size={16} color="#4ADE80" />
              </View>
              <View style={{ flex: 1 }}>
                <AppText style={styles.featureTitle}>Overall Health Score</AppText>
                <AppText style={styles.featureSub}>
                  Get an algorithmically determined wellness score out of 100.
                </AppText>
              </View>
            </View>

            <View style={styles.featureRow}>
              <View style={styles.featureIconBox}>
                <Lightbulb size={16} color="#A78BFA" />
              </View>
              <View style={{ flex: 1 }}>
                <AppText style={styles.featureTitle}>AI Clinical Recommendations</AppText>
                <AppText style={styles.featureSub}>
                  Receive personalized nutritional pointers and risk insights.
                </AppText>
              </View>
            </View>
          </View>
          
          <View style={{ height: 100 }} />
        </ScrollView>
      </LinearGradient>
    );
  }

  const latestScore = overview.latest_health_score || overview.average_health_score || 0;
  const status = healthStatus(latestScore);

  const contentWidth = Platform.OS === "web" ? Math.min(windowWidth - 300, 1060) : windowWidth - 40;
  const healthTrendChartWidth = !isMobile
    ? (contentWidth * 1.5) / 2.5 - 40
    : contentWidth - 40;
  const biomarkerChartWidth = !isMobile
    ? (contentWidth - 16) / 2 - 40
    : contentWidth - 40;

  return (
    <LinearGradient colors={["#020617", "#0F172A"]} style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadAnalytics(true)}
            tintColor="#4ADE80"
            colors={["#4ADE80"]}
          />
        }
      >
        {/* ── HEADER ── */}
        <View style={isMobile && { paddingRight: 60 }}>
          <AppText style={styles.heading}>Analytics</AppText>
          <AppText style={styles.sub}>
            {activeProfile.full_name} · AI Healthcare Intelligence
          </AppText>
        </View>

        {/* ── ERROR BANNER ── */}
        {error && (
          <View style={styles.errorBanner}>
            <AlertTriangle size={16} color="#EF4444" />
            <AppText style={styles.errorText}>{error}</AppText>
          </View>
        )}

        {/* ── METRIC CARDS ── */}
        <View style={styles.metricsRow}>
          <MetricCard
            title="Reports"
            value={String(overview.total_reports)}
            icon={FileText}
            color="#3B82F6"
          />
          <MetricCard
            title="Avg Score"
            value={String(Math.round(overview.average_health_score))}
            icon={Award}
            color="#4ADE80"
          />
          <MetricCard
            title="Abnormal"
            value={String(overview.abnormal_biomarkers ?? criticalChanges.length)}
            icon={Activity}
            color="#F97316"
          />
        </View>

        {/* ── STATUS & OVERALL TREND ROW ── */}
        <View style={!isMobile ? { flexDirection: "row", gap: 16, marginBottom: 14 } : { marginBottom: 14 }}>
          {/* ── HEALTH STATUS CARD ── */}
          <LinearGradient
            colors={["rgba(255,255,255,0.04)", "rgba(255,255,255,0.01)"]}
            style={[styles.statusCard, !isMobile && { flex: 1, marginBottom: 0 }]}
          >
            <View style={{ flex: 1 }}>
              <AppText style={styles.statusLabel}>CURRENT HEALTH STATUS</AppText>
              <AppText style={[styles.statusValue, { color: status.color }]}>
                {status.label}
              </AppText>
              <AppText style={styles.statusSub}>
                Based on {overview.total_reports} report{overview.total_reports !== 1 ? "s" : ""}
              </AppText>
            </View>
            <View
              style={[
                styles.scoreBubble,
                { borderColor: `${status.color}50`, backgroundColor: `${status.color}15` },
              ]}
            >
              <AppText style={[styles.scoreNum, { color: status.color }]}>
                {Math.round(latestScore)}
              </AppText>
              <AppText style={[styles.scoreOf, { color: status.color }]}>/100</AppText>
            </View>
          </LinearGradient>

          {/* ── HEALTH SCORE TREND ── */}
          <SectionCard 
            title="Health Score Trend" 
            style={!isMobile ? { flex: 1.5, marginBottom: 0 } : {}}
          >
            {healthScores.length === 0 ? (
              <AppText style={styles.emptyText}>
                Upload reports to see your health trend over time
              </AppText>
            ) : (
              <SafeLineChart
                rawData={healthScores}
                colorRgb="70, 140, 255"
                height={200}
                width={healthTrendChartWidth}
              />
            )}
          </SectionCard>
        </View>

        {/* ── DYNAMIC BIOMARKERS ── */}
        <View style={!isMobile ? { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" } : {}}>
          {biomarkers.filter((b) => (b.history ?? []).length >= 2).map((bio, index) => {
            const history = bio.history ?? [];
            const baseline = Number(history[0]?.value ?? 0);
            const graphData = history.map((x) => Number(x.value ?? 0) - baseline);
            const bioStatus = bio.status?.toUpperCase() ?? "NORMAL";
            const isHigh = ["HIGH", "CRITICAL"].includes(bioStatus);
            const isLow = bioStatus === "LOW";
            const statusColor = isHigh ? "#EF4444" : isLow ? "#F59E0B" : "#4ADE80";
            const explanation = getBiomarkerExplanation(bio.name);

            return (
              <View key={index} style={!isMobile ? { width: "49%", marginBottom: 16 } : { width: "100%" }}>
                <SectionCard 
                  title={explanation.simpleName} 
                  style={{ marginBottom: 0, height: "100%" }}
                >
                  <View style={styles.bioHeader}>
                    <AppText style={styles.bioUnit}>
                      Medical Term: {bio.name} · Unit: {bio.unit || "—"}
                    </AppText>
                    <View
                      style={[
                        styles.bioBadge,
                        { backgroundColor: `${statusColor}18` },
                      ]}
                    >
                      <AppText style={[styles.bioBadgeText, { color: statusColor }]}>
                        {bioStatus}
                      </AppText>
                    </View>
                  </View>

                  {/* Patient Friendly Info Panel */}
                  <View style={[explainStyles.panel, { flex: 1 }]}>
                    <AppText style={explainStyles.desc}>
                      {explanation.description}
                    </AppText>
                    <AppText style={explainStyles.whatMeans}>
                      <AppText style={explainStyles.bold}>What it means: </AppText>
                      {explanation.whatItMeans}
                    </AppText>
                    {bioStatus !== "NORMAL" && (
                      <View style={explainStyles.alertBox}>
                        <AppText style={explainStyles.alertText}>
                          <AppText style={explainStyles.bold}>Why it's critical: </AppText>
                          {explanation.criticalIf}
                        </AppText>
                      </View>
                    )}
                  </View>

                  <AppText style={styles.bioNote}>
                    Showing change vs baseline ({history[0]?.date || "start"})
                  </AppText>
                  <SafeLineChart
                    rawData={graphData}
                    colorRgb={isHigh ? "239,68,68" : isLow ? "245,158,11" : "50,230,170"}
                    height={180}
                    width={biomarkerChartWidth}
                  />
                </SectionCard>
              </View>
            );
          })}
        </View>

        {/* If no biomarkers yet */}
        {biomarkers.filter((b) => (b.history ?? []).length >= 2).length === 0 && (
          <SectionCard title="Biomarker Trends">
            <AppText style={styles.emptyText}>
              Upload at least 2 reports with the same biomarkers to see trends
            </AppText>
          </SectionCard>
        )}

        {/* ── INSIGHTS & CHANGES ROW ── */}
        <View style={!isMobile ? { flexDirection: "row", gap: 16 } : {}}>
          {/* ── CRITICAL CHANGES ── */}
          <SectionCard 
            title="Significant Changes" 
            style={!isMobile ? { flex: 1, marginBottom: 0 } : {}}
          >
            {criticalChanges.length === 0 ? (
              <AppText style={styles.emptyText}>
                No significant biomarker changes detected
              </AppText>
            ) : (
              criticalChanges.map((x, i) => {
                const changeAbs = Math.abs(x.change_percent ?? 0);
                const isNeg = (x.change_percent ?? 0) < 0;
                const pct = changeAbs.toFixed(1);
                return (
                  <View key={i} style={styles.criticalRow}>
                    <View style={styles.criticalLeft}>
                      <TrendIcon trend={x.trend} />
                      <View style={{ flex: 1 }}>
                        <AppText style={styles.criticalName}>{x.name}</AppText>
                        {x.clinical_status && (
                          <AppText style={styles.criticalSub}>
                            Status: {x.clinical_status}
                          </AppText>
                        )}
                      </View>
                    </View>
                    <View style={[
                      styles.pctBadge,
                      { backgroundColor: isNeg ? "rgba(74,222,128,0.1)" : "rgba(239,68,68,0.1)" },
                    ]}>
                      <AppText style={[
                        styles.pctText,
                        { color: isNeg ? "#4ADE80" : "#EF4444" },
                      ]}>
                        {isNeg ? "▼" : "▲"} {pct}%
                      </AppText>
                    </View>
                  </View>
                );
              })
            )}
          </SectionCard>

          {/* ── AI RECOMMENDATIONS ── */}
          <SectionCard 
            title="AI Clinical Insights" 
            style={!isMobile ? { flex: 1, marginBottom: 0 } : {}}
          >
            {insights.length === 0 ? (
              <AppText style={styles.emptyText}>
                AI insights will appear after multiple reports are uploaded
              </AppText>
            ) : (
              insights.map((x, i) => (
                <View key={i} style={styles.insightRow}>
                  <Lightbulb size={14} color="#A78BFA" style={{ marginTop: 2, flexShrink: 0 }} />
                  <View style={{ flex: 1 }}>
                    {x.title && (
                      <AppText style={styles.insightTitle}>{x.title}</AppText>
                    )}
                    <AppText style={styles.insightText}>
                      {x.description ?? JSON.stringify(x)}
                    </AppText>
                  </View>
                </View>
              ))
            )}
          </SectionCard>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 28,
    gap: 12,
  },
  centeredTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#F8FAFC",
    marginTop: 8,
  },
  centeredSub: {
    fontSize: 14,
    color: "#475569",
    textAlign: "center",
    lineHeight: 20,
  },
  container: {
    padding: 20,
    paddingBottom: 140,
    maxWidth: IS_WEB ? 1100 : undefined,
    alignSelf: IS_WEB ? "center" : undefined,
    width: "100%",
  },
  heading: {
    fontSize: 34,
    fontWeight: "900",
    color: "#F8FAFC",
    letterSpacing: -0.5,
  },
  sub: {
    color: "#64748B",
    fontSize: 14,
    marginTop: 4,
    marginBottom: 20,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(239,68,68,0.08)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  errorText: {
    color: "#FCA5A5",
    fontSize: 13,
    flex: 1,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  metricCard: {
    flex: 1,
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#F8FAFC",
  },
  metricLabel: {
    fontSize: 10,
    color: "#64748B",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginTop: 4,
    textAlign: "center",
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginBottom: 14,
  },
  statusLabel: {
    color: "#475569",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  statusValue: {
    fontSize: 22,
    fontWeight: "900",
  },
  statusSub: {
    fontSize: 12,
    color: "#475569",
    marginTop: 4,
  },
  scoreBubble: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    minWidth: 72,
  },
  scoreNum: {
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 34,
  },
  scoreOf: {
    fontSize: 11,
    fontWeight: "700",
  },
  sectionCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    padding: 20,
    marginBottom: 14,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#F8FAFC",
    marginBottom: 4,
  },
  emptyText: {
    color: "#475569",
    fontSize: 13,
    marginTop: 12,
    lineHeight: 20,
  },
  bioHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  bioUnit: {
    color: "#64748B",
    fontSize: 12,
  },
  bioBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bioBadgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  bioNote: {
    color: "#334155",
    fontSize: 11,
    marginTop: 4,
    marginBottom: 4,
  },
  criticalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  criticalLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    marginRight: 12,
  },
  criticalName: {
    color: "#F8FAFC",
    fontSize: 13,
    fontWeight: "700",
  },
  criticalSub: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 2,
  },
  pctBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  pctText: {
    fontSize: 12,
    fontWeight: "800",
  },
  insightRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    alignItems: "flex-start",
  },
  insightTitle: {
    color: "#C4B5FD",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 3,
  },
  insightText: {
    color: "#94A3B8",
    fontSize: 12,
    lineHeight: 18,
  },
  // Empty State Styles
  emptyCardContainer: {
    padding: 30,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    marginTop: 8,
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(74,222,128,0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  uploadCTA: {
    borderRadius: 14,
    overflow: "hidden",
    width: "100%",
    maxWidth: 260,
  },
  uploadCTAGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
  },
  uploadCTAText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  featuresHeading: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
    marginBottom: 20,
  },
  featureIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.03)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  featureTitle: {
    color: "#F1F5F9",
    fontSize: 14,
    fontWeight: "700",
  },
  featureSub: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 3,
    lineHeight: 16,
  },
});

const explainStyles = StyleSheet.create({
  panel: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
  },
  desc: {
    color: "#94A3B8",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  whatMeans: {
    color: "#E2E8F0",
    fontSize: 13,
    lineHeight: 18,
  },
  bold: {
    fontWeight: "700",
    color: "#F1F5F9",
  },
  alertBox: {
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  alertText: {
    color: "#FCA5A5",
    fontSize: 12,
    lineHeight: 16,
  },
});