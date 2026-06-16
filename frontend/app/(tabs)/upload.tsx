import React, { useMemo, useRef, useState, useEffect } from "react";
import { router } from "expo-router";
import {
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Platform,
  Alert,
  Dimensions,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import {
  CloudUpload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  Activity,
  FileUp
} from "lucide-react-native";
import Screen from "@/components/ui/Screen";
import AppCard from "@/components/ui/AppCard";
import AppText from "@/components/ui/AppText";
import AppInput from "@/components/ui/AppInput";
import { useTheme } from "@/hooks/useTheme";
import API from "@/services/api";
import { useProfileStore } from "@/store/profileStore";
import { useResponsive } from "@/hooks/useResponsive";

interface ScanStatus {
  scan_job_id: string;
  status: string;
  progress: number;
  report_id?: string;
}

export default function UploadScreen() {
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const { profiles, activeProfile, setActiveProfile, fetchProfiles } = useProfileStore();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<ScanStatus | null>(null);

  const pollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchProfiles();
    return () => {
      if (pollingRef.current) {
        clearTimeout(pollingRef.current);
      }
    };
  }, []);

  async function pickFile() {
    if (activeProfile && (activeProfile as any).is_shared) {
      Alert.alert("Permission Denied", "You cannot upload reports to a shared profile. Access is read-only.");
      return;
    }
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/png", "image/jpeg"],
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;
      setSelectedFile(result.assets[0]);
    } catch (error) {
      console.log("PICK FILE ERROR:", error);
    }
  }

  async function uploadReport() {
    if (!activeProfile) {
      Alert.alert("Error", "No profile selected. Please select a profile first.");
      return;
    }
    if ((activeProfile as any).is_shared) {
      Alert.alert("Permission Denied", "You cannot upload reports to a shared profile. Access is read-only.");
      return;
    }
    if (!selectedFile) {
      Alert.alert("Error", "Please select a medical report file to upload.");
      return;
    }

    try {
      setLoading(true);
      setUploadStatus(null);

      const formData = new FormData();
      formData.append("profile_id", String(activeProfile.id));

      if (Platform.OS === "web") {
        const fileResponse = await fetch(selectedFile.uri);
        const blob = await fileResponse.blob();
        const webFile = new File([blob], selectedFile.name, {
          type: selectedFile.mimeType || "application/octet-stream",
        });
        formData.append("file", webFile);
      } else {
        formData.append("file", {
          uri: selectedFile.uri,
          name: selectedFile.name,
          type: selectedFile.mimeType || "application/pdf",
        } as any);
      }

      const response = await API.post<any>("/scans/upload", formData);
      const scanJobId = response.data?.data?.id || response.data?.data?.scan_job_id || response.data?.scan_job_id || null;

      if (!scanJobId) {
        throw new Error("No scan job ID returned from server.");
      }

      setStatusLoading(true);
      await pollStatus(scanJobId);
    } catch (error: any) {
      console.log("UPLOAD ERROR:", error);
      Alert.alert("Upload Failed", error?.response?.data?.detail || error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  async function pollStatus(scanJobId: string) {
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
    }

    const poll = async () => {
      try {
        const response = await API.get(`/scans/${scanJobId}/status`);
        const statusData = response.data.data;
        setUploadStatus(statusData);

        if (statusData.status === "COMPLETED" || statusData.status === "FAILED") {
          if (pollingRef.current) {
            clearTimeout(pollingRef.current);
          }
          pollingRef.current = null;
          setStatusLoading(false);
          setSelectedFile(null);
          return;
        }

        pollingRef.current = setTimeout(poll, 3000);
      } catch (error) {
        console.log("POLL ERROR:", error);
      }
    };

    poll();
  }

  const statusConfig = useMemo(() => {
    switch (uploadStatus?.status) {
      case "COMPLETED":
        return {
          icon: CheckCircle2,
          color: "#22C55E",
          text: "Report processed successfully!",
        };
      case "FAILED":
        return {
          icon: AlertCircle,
          color: "#EF4444",
          text: "AI processing failed. Please check the file format.",
        };
      default:
        return {
          icon: Loader2,
          color: "#3B82F6",
          text: `AI is extracting biomarkers... (${uploadStatus?.progress ?? 0}%)`,
        };
    }
  }, [uploadStatus]);

  const StatusIcon = statusConfig.icon;

  return (
    <Screen scrollable={false}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={[styles.header, isMobile && { paddingRight: 60 }]}>
          <AppText variant="heading" style={styles.headingText}>
            Upload Report
          </AppText>
          <AppText style={styles.subText}>
            AI biomarker extraction & analysis
          </AppText>
        </View>

        <View style={[styles.content, !isMobile && { flexDirection: "row" }]}>
          <View style={{ flex: 1.8 }}>
            <LinearGradient
              colors={["rgba(255, 255, 255, 0.04)", "rgba(255, 255, 255, 0.01)"]}
              style={styles.mainCard}
            >
              <AppText style={styles.cardHeader}>Select & Upload Document</AppText>

              <View style={{ marginTop: 20 }}>
                <AppText style={styles.inputLabel}>Active Target Profile</AppText>
                <AppInput
                  value={activeProfile ? `${activeProfile.full_name}${activeProfile.is_shared ? " (Shared - View Only)" : ""}` : ""}
                  editable={false}
                  placeholder="No active profile selected"
                  style={styles.disabledInput}
                />
              </View>

              {activeProfile && (activeProfile as any).is_shared ? (
                <View
                  style={[
                    styles.uploadBox,
                    { borderColor: "rgba(239, 68, 68, 0.2)", backgroundColor: "rgba(239, 68, 68, 0.03)" }
                  ]}
                >
                  <AlertCircle size={44} color="#EF4444" />
                  <AppText style={[styles.uploadBoxText, { color: "#FCA5A5", fontWeight: "700" }]}>
                    Uploads Disabled
                  </AppText>
                  <AppText style={{ color: "#94A3B8", fontSize: 12, marginTop: 4, textAlign: "center", paddingHorizontal: 16 }}>
                    This profile is shared with read-only access.
                  </AppText>
                </View>
              ) : (
                <Pressable
                  onPress={pickFile}
                  style={[
                    styles.uploadBox,
                    selectedFile && { borderColor: "rgba(74, 222, 128, 0.4)" }
                  ]}
                >
                  <CloudUpload size={48} color={selectedFile ? "#4ADE80" : "#3B82F6"} />
                  <AppText style={[styles.uploadBoxText, selectedFile && { color: "#4ADE80" }]}>
                    {selectedFile ? selectedFile.name : "Choose PDF, PNG, or JPG"}
                  </AppText>
                  {selectedFile && (
                    <AppText style={styles.fileSizeText}>
                      Size: {Math.round(selectedFile.size / 1024)} KB
                    </AppText>
                  )}
                </Pressable>
              )}

              <Pressable
                onPress={uploadReport}
                disabled={loading || statusLoading || (activeProfile && (activeProfile as any).is_shared)}
                style={{ marginTop: 24 }}
              >
                <LinearGradient
                  colors={loading || statusLoading || (activeProfile && (activeProfile as any).is_shared) ? ["#1E293B", "#1E293B"] : ["#22C55E", "#2563EB"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.uploadButton}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <FileUp size={20} color="#fff" />
                      <AppText style={styles.uploadButtonText}>Analyze Report</AppText>
                    </View>
                  )}
                </LinearGradient>
              </Pressable>

            </LinearGradient>
          </View>

          <View style={{ flex: 1, gap: 16 }}>
            {/* STATUS CARD */}
            <LinearGradient
              colors={["rgba(255, 255, 255, 0.04)", "rgba(255, 255, 255, 0.01)"]}
              style={styles.sideCard}
            >
              <AppText style={styles.cardHeader}>Pipeline Status</AppText>
              {uploadStatus ? (
                <View style={styles.statusPanel}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    {uploadStatus.status === "COMPLETED" || uploadStatus.status === "FAILED" ? (
                      <StatusIcon size={20} color={statusConfig.color} />
                    ) : (
                      <ActivityIndicator size="small" color={statusConfig.color} />
                    )}
                    <AppText style={[styles.statusBadgeText, { color: statusConfig.color }]}>
                      {uploadStatus.status}
                    </AppText>
                  </View>
                  <AppText style={styles.statusInfoText}>{statusConfig.text}</AppText>
                  
                  {uploadStatus.status === "COMPLETED" && uploadStatus.report_id && (
                    <Pressable
                      onPress={() => router.push(`/report/${uploadStatus.report_id}`)}
                      style={styles.viewReportBtn}
                    >
                      <AppText style={styles.viewReportBtnText}>View Extracted Report</AppText>
                    </Pressable>
                  )}
                </View>
              ) : (
                <View style={styles.statusPanelEmpty}>
                  <Activity size={24} color="#64748B" style={{ marginBottom: 8 }} />
                  <AppText style={styles.statusEmptyText}>Ready for uploads.</AppText>
                </View>
              )}
            </LinearGradient>

            {/* PROFILES SELECTION */}
            <LinearGradient
              colors={["rgba(255, 255, 255, 0.04)", "rgba(255, 255, 255, 0.01)"]}
              style={styles.sideCard}
            >
              <AppText style={styles.cardHeader}>Switch Profile</AppText>
              <ScrollView style={styles.profileList} showsVerticalScrollIndicator={false}>
                {profiles.map((profile) => {
                  const isActive = activeProfile?.id === profile.id;
                  return (
                    <Pressable
                      key={profile.id}
                      onPress={() => setActiveProfile(profile)}
                      style={[
                        styles.profileCard,
                        isActive ? { borderColor: "#4ADE80", backgroundColor: "rgba(74, 222, 128, 0.04)" } : {}
                      ]}
                    >
                      <User size={16} color={isActive ? "#4ADE80" : "#64748B"} />
                      <AppText style={[styles.profileCardText, isActive ? { color: "#4ADE80", fontWeight: "700" } : {}]}>
                        {profile.full_name}
                      </AppText>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </LinearGradient>
          </View>
        </View>
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
    marginBottom: 26,
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
  content: {
    flexDirection: "column",
    gap: 20,
  },
  mainCard: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  sideCard: {
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F8FAFC",
    marginBottom: 16,
  },
  inputLabel: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  disabledInput: {
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    borderColor: "rgba(255, 255, 255, 0.03)",
    color: "#F8FAFC",
  },
  uploadBox: {
    marginTop: 20,
    height: 200,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.01)",
  },
  uploadBoxText: {
    marginTop: 14,
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "600",
  },
  fileSizeText: {
    marginTop: 6,
    color: "#64748B",
    fontSize: 12,
  },
  uploadButton: {
    height: 58,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  statusPanel: {
    marginTop: 4,
    gap: 10,
  },
  statusPanelEmpty: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  statusEmptyText: {
    color: "#64748B",
    fontSize: 13,
  },
  statusBadgeText: {
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 0.3,
  },
  statusInfoText: {
    color: "#94A3B8",
    fontSize: 13,
    lineHeight: 18,
  },
  viewReportBtn: {
    backgroundColor: "rgba(74, 222, 128, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(74, 222, 128, 0.15)",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },
  viewReportBtnText: {
    color: "#4ADE80",
    fontSize: 13,
    fontWeight: "700",
  },
  profileList: {
    maxHeight: 180,
  },
  profileCard: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "rgba(255,255,255,0.01)",
  },
  profileCardText: {
    marginLeft: 10,
    color: "#94A3B8",
    fontSize: 14,
  },
});