import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
  Linking,
  Dimensions,
  SafeAreaView
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AppText from "@/components/ui/AppText";
import API from "@/services/api";
import {
  ArrowLeft,
  Calendar,
  Building2,
  Trash2,
  Download,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  FileText,
  Brain,
  ShieldCheck
} from "lucide-react-native";

const WIDTH = Dimensions.get("window").width;

interface Biomarker {
  id: string;
  name: string;
  value: string;
  unit: string;
  severity?: string;
  reference_range?: string;
  category?: string;
  clinical_significance?: string;
}

interface AIInsight {
  id: string;
  title: string;
  description: string;
  severity: string;
  recommendation?: string;
}

interface Report {
  id: string;
  report_name: string;
  report_type: string;
  hospital_name: string;
  created_at: string;
  health_score: number;
  status: string;
  summary?: string;
  biomarkers: Biomarker[];
  ai_insights: AIInsight[];
}

function ReportDetailSkeleton() {
  return (
    <LinearGradient colors={["#020617", "#0F172A"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.skeletonText, { width: 100, height: 24, marginBottom: 24 }]} />
        <View style={[styles.skeletonText, { width: 220, height: 38, marginBottom: 8 }]} />
        <View style={[styles.skeletonText, { width: 160, height: 18, marginBottom: 30 }]} />
        <View style={styles.skeletonScoreCard} />
        <View style={styles.skeletonCard} />
        <View style={styles.skeletonCard} />
      </ScrollView>
    </LinearGradient>
  );
}

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams();
  const [report, setReport] = useState<Report | null>(null);
  const [comparison, setComparison] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      setLoading(true);
      const [reportRes, compareRes] = await Promise.all([
        API.get(`/reports/${id}`),
        API.get(`/reports/${id}/comparison`)
      ]);

      setReport(reportRes.data?.data || reportRes.data);
      
      const compData = compareRes.data?.data?.comparison || compareRes.data?.comparison || {};
      setComparison(compData);
    } catch (error) {
      console.log("REPORT DETAIL ERROR:", error);
      Alert.alert("Error", "Failed to fetch report details");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    Alert.alert(
      "Delete Report",
      "Are you sure you want to permanently delete this report?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await API.delete(`/reports/${id}`);
              router.replace("/(tabs)/reports");
            } catch (err) {
              console.log(err);
              Alert.alert("Error", "Failed to delete report.");
            }
          }
        }
      ]
    );
  }

  async function handleDownload() {
    try {
      const response = await API.get(`/reports/${id}/download`, {
        responseType: "blob"
      });
      if (response.request?.responseURL) {
        Linking.openURL(response.request.responseURL);
      } else {
        Alert.alert("Download Error", "Could not download file.");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Unable to download report file");
    }
  }

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return <ReportDetailSkeleton />;
  }

  if (!report) {
    return (
      <LinearGradient colors={["#020617", "#0F172A"]} style={styles.center}>
        <FileText size={48} color="#64748B" style={{ marginBottom: 16 }} />
        <AppText style={{ color: "#94A3B8" }}>Unable to load report</AppText>
        <Pressable
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/(tabs)/reports");
            }
          }}
          style={styles.backLink}
        >
          <AppText style={{ color: "#3B82F6", fontWeight: "700" }}>Go Back</AppText>
        </Pressable>
      </LinearGradient>
    );
  }

  const score = report.health_score;
  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  return (
    <LinearGradient colors={["#020617", "#0F172A"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* CUSTOM HEADER */}
        <View style={styles.header}>
          <Pressable onPress={() => router.replace("/(tabs)/reports")} style={styles.backButton}>
            <ArrowLeft size={20} color="#F8FAFC" />
            <AppText style={styles.backText}>Reports</AppText>
          </Pressable>
          <View style={styles.headerActions}>
            <Pressable onPress={handleDownload} style={styles.headerIconBtn}>
              <Download size={18} color="#3B82F6" />
            </Pressable>
            <Pressable onPress={handleDelete} style={styles.headerIconBtn}>
              <Trash2 size={18} color="#EF4444" />
            </Pressable>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* TITLE & META */}
          <View style={styles.titleContainer}>
            <AppText style={styles.heading}>
              {report.report_name || report.report_type || "Medical Report"}
            </AppText>
            <View style={styles.metaRow}>
              <Calendar size={14} color="#94A3B8" />
              <AppText style={styles.sub}>
                {new Date(report.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </AppText>
              {report.hospital_name && (
                <>
                  <AppText style={styles.metaDot}>•</AppText>
                  <Building2 size={14} color="#94A3B8" />
                  <AppText style={styles.sub}>{report.hospital_name}</AppText>
                </>
              )}
            </View>
          </View>

          {/* HEALTH SCORE DOCK */}
          <LinearGradient
            colors={["rgba(255, 255, 255, 0.04)", "rgba(255, 255, 255, 0.01)"]}
            style={styles.healthScoreCard}
          >
            <View style={[styles.scoreDial, { borderColor: `${scoreColor}30` }]}>
              <View style={[styles.scoreDialInner, { borderColor: scoreColor }]}>
                <AppText style={[styles.scoreNumber, { color: scoreColor }]}>
                  {score ?? "--"}
                </AppText>
                <AppText style={styles.scoreMax}>/ 100</AppText>
              </View>
            </View>
            <View style={styles.scoreTextContainer}>
              <AppText style={[styles.scoreLabel, { color: scoreColor }]}>
                {scoreLabel}
              </AppText>
              <AppText style={styles.scoreDesc}>
                Calculated based on biomarkers and clinical ranges analyzed by AI.
              </AppText>
            </View>
          </LinearGradient>

          {/* AI SUMMARY CARD */}
          <LinearGradient
            colors={["rgba(167, 139, 250, 0.05)", "rgba(167, 139, 250, 0.01)"]}
            style={[styles.card, styles.aiCard]}
          >
            <View style={styles.sectionHeader}>
              <Sparkles size={20} color="#A78BFA" />
              <AppText style={styles.sectionTitle}>AI Clinical Summary</AppText>
            </View>
            <AppText style={styles.summaryText}>
              {report.summary || report.ai_insights?.[0]?.description || "No clinical summary available."}
            </AppText>

            {report.ai_insights?.[0]?.recommendation && (
              <View style={styles.recommendationsContainer}>
                <AppText style={styles.subSectionTitle}>Key Recommendations</AppText>
                {report.ai_insights[0].recommendation.split("\n").filter(Boolean).map((rec, i) => (
                  <View key={i} style={styles.recRow}>
                    <ShieldCheck size={16} color="#A78BFA" style={styles.recIcon} />
                    <AppText style={styles.recText}>{rec.replace(/^[-\*\s\d\.\)]+/, "")}</AppText>
                  </View>
                ))}
              </View>
            )}
          </LinearGradient>

          {/* BIOMARKERS LIST */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Activity size={20} color="#3B82F6" />
              <AppText style={styles.sectionTitle}>Biomarker Details</AppText>
            </View>
            {report.biomarkers?.length ? (
              report.biomarkers.map((bio) => {
                const bioColor = getSeverityColor(bio.severity);
                return (
                  <View key={bio.id} style={styles.bioRow}>
                    <View style={{ flex: 1, paddingRight: 8 }}>
                      <AppText style={styles.bioName}>{bio.name}</AppText>
                      <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 6, marginTop: 2 }}>
                        {bio.category && (
                          <AppText style={styles.bioCategory}>{bio.category}</AppText>
                        )}
                        {bio.reference_range && (
                          <>
                            <AppText style={styles.metaDot}>•</AppText>
                            <AppText style={styles.bioRefRange}>Ref: {bio.reference_range}</AppText>
                          </>
                        )}
                      </View>
                      {bio.clinical_significance && (
                        <AppText style={styles.bioSignificance}>{bio.clinical_significance}</AppText>
                      )}
                    </View>
                    <View style={styles.bioValueContainer}>
                      <AppText style={[styles.bioValue, { color: bioColor }]}>
                        {bio.value} {bio.unit}
                      </AppText>
                      <View style={[styles.severityBadge, { backgroundColor: `${bioColor}15` }]}>
                        <AppText style={[styles.severityText, { color: bioColor }]}>
                          {bio.severity || "UNKNOWN"}
                        </AppText>
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <AppText style={styles.emptyText}>No biomarkers detected</AppText>
            )}
          </View>

          {/* TREND COMPARISONS */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Brain size={20} color="#EF4444" />
              <AppText style={styles.sectionTitle}>Trend & Comparison</AppText>
            </View>
            {Object.keys(comparison || {}).length ? (
              Object.entries(comparison || {}).map(([name, val]: any) => {
                const isImproved = val.clinical_status === "IMPROVED";
                const isWorsened = val.clinical_status === "WORSENED";
                const trendColor = isImproved ? "#4ADE80" : isWorsened ? "#EF4444" : "#94A3B8";
                const TrendIcon = val.trend === "INCREASED" ? TrendingUp : val.trend === "DECREASED" ? TrendingDown : Activity;

                return (
                  <View key={name} style={styles.compareRow}>
                    <View style={{ flex: 1 }}>
                      <AppText style={styles.compareName}>{name}</AppText>
                      <AppText style={styles.compareEvolution}>
                        {val.previous_value} {val.unit} → {val.current_value} {val.unit}
                      </AppText>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <TrendIcon size={16} color={trendColor} />
                        <AppText style={[styles.compareTrendText, { color: trendColor }]}>
                          {val.trend} ({val.change_percent > 0 ? `+${val.change_percent}` : val.change_percent}%)
                        </AppText>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: `${trendColor}15` }]}>
                        <AppText style={[styles.statusText, { color: trendColor }]}>
                          {val.clinical_status}
                        </AppText>
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <AppText style={styles.emptyText}>No previous reports found for comparison.</AppText>
            )}
          </View>

          {/* LOWER ACTIONS */}
          <View style={styles.actionContainer}>
            <Pressable onPress={handleDownload} style={styles.actionButtonBlue}>
              <Download size={18} color="#FFF" style={{ marginRight: 8 }} />
              <AppText style={styles.actionButtonText}>Download original report file</AppText>
            </Pressable>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function getScoreColor(val: number | null) {
  if (val === null) return "#64748B";
  if (val >= 80) return "#4ADE80";
  if (val >= 50) return "#F59E0B";
  return "#EF4444";
}

function getScoreLabel(val: number | null) {
  if (val === null) return "Processing Score";
  if (val >= 80) return "Excellent Condition";
  if (val >= 50) return "Moderate Deviations";
  return "Attention Required";
}

function getSeverityColor(severity?: string) {
  if (!severity) return "#94A3B8";
  const s = severity.toUpperCase();
  if (["HIGH", "CRITICAL"].includes(s)) return "#EF4444";
  if (["LOW", "BORDERLINE", "WARNING", "MODERATE"].includes(s)) return "#F59E0B";
  if (["NORMAL", "OPTIMAL"].includes(s)) return "#4ADE80";
  return "#94A3B8";
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    padding: 20,
    paddingBottom: 140,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  backLink: {
    marginTop: 16,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backText: {
    color: "#F8FAFC",
    fontWeight: "700",
    fontSize: 16,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerIconBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  titleContainer: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: "900",
    color: "#F8FAFC",
    lineHeight: 36,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  metaDot: {
    color: "#64748B",
    fontSize: 10,
  },
  sub: {
    color: "#94A3B8",
    fontSize: 13,
  },
  healthScoreCard: {
    flexDirection: "row",
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    marginBottom: 20,
    gap: 20,
  },
  scoreDial: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  scoreDialInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  scoreNumber: {
    fontSize: 26,
    fontWeight: "900",
  },
  scoreMax: {
    fontSize: 9,
    color: "#64748B",
    fontWeight: "600",
    marginTop: -2,
  },
  scoreTextContainer: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  scoreDesc: {
    color: "#94A3B8",
    fontSize: 12,
    lineHeight: 16,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    padding: 20,
    borderRadius: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  aiCard: {
    borderColor: "rgba(167, 139, 250, 0.15)",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  summaryText: {
    color: "#E2E8F0",
    fontSize: 14,
    lineHeight: 22,
  },
  recommendationsContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(167, 139, 250, 0.1)",
    paddingTop: 16,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#A78BFA",
    marginBottom: 12,
  },
  recRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 8,
  },
  recIcon: {
    marginTop: 2,
  },
  recText: {
    flex: 1,
    color: "#CBD5E1",
    fontSize: 13,
    lineHeight: 18,
  },
  bioRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.04)",
  },
  bioName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  bioCategory: {
    color: "#3B82F6",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bioRefRange: {
    color: "#64748B",
    fontSize: 11,
  },
  bioSignificance: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 6,
    lineHeight: 16,
  },
  bioValueContainer: {
    alignItems: "flex-end",
    minWidth: 110,
  },
  bioValue: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  severityText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  compareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.04)",
  },
  compareName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  compareEvolution: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 2,
  },
  compareTrendText: {
    fontSize: 12,
    fontWeight: "700",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  actionContainer: {
    marginTop: 10,
  },
  actionButtonBlue: {
    flexDirection: "row",
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  actionButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
  emptyText: {
    color: "#64748B",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 10,
  },
  skeletonText: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
  },
  skeletonScoreCard: {
    height: 130,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 20,
  },
  skeletonCard: {
    height: 180,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 20,
  },
});