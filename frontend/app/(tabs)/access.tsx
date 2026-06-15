import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
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
import { LinearGradient } from "expo-linear-gradient";
import Screen from "@/components/ui/Screen";
import AppText from "@/components/ui/AppText";
import { useTheme } from "@/hooks/useTheme";
import { useResponsive } from "@/hooks/useResponsive";
import {
  getConnectedMembers,
  removeMember,
  getIncomingRequests,
  acceptRequest,
  declineRequest
} from "@/services/access";
import {
  Users,
  UserPlus,
  Trash2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  Mail,
  Lock,
} from "lucide-react-native";

interface ConnectedMember {
  id: string;
  name: string;
  email: string;
  permission_level: string;
  status: string;
  created_at: string;
}

interface IncomingRequest {
  id: string;
  owner_name: string;
  owner_email: string;
  permission_level: string;
  created_at: string;
}

const IS_WEB = Platform.OS === "web";

export default function AccessScreen() {
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const [activeTab, setActiveTab] = useState<"sharing" | "requests">("sharing");
  const [members, setMembers] = useState<ConnectedMember[]>([]);
  const [requests, setRequests] = useState<IncomingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchAllData() {
    try {
      const [membersResponse, requestsResponse] = await Promise.all([
        getConnectedMembers(),
        getIncomingRequests()
      ]);
      setMembers(membersResponse.data || []);
      setRequests(requestsResponse.data || []);
    } catch (error) {
      console.log("FETCH ACCESS DATA ERROR:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchAllData();
    }, [])
  );

  async function onRefresh() {
    setRefreshing(true);
    await fetchAllData();
  }

  async function handleDelete(member: ConnectedMember) {
    const message = `Are you sure you want to revoke medical records access for ${member.name} (${member.email})?`;
    Alert.alert(
      "Revoke Access",
      message,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Revoke",
          style: "destructive",
          onPress: async () => {
            try {
              await removeMember(member.id);
              setMembers((prev) => prev.filter((m) => m.id !== member.id));
              Alert.alert("Success", "Access revoked successfully.");
            } catch (error: any) {
              const msg = error?.response?.data?.detail || "Failed to revoke access.";
              Alert.alert("Error", msg);
            }
          },
        },
      ]
    );
  }

  async function handleAccept(req: IncomingRequest) {
    try {
      await acceptRequest(req.id);
      const message = `You now have access to ${req.owner_name}'s medical records. You can switch to their profile from the Profile switch list!`;
      Alert.alert(
        "Request Accepted 🎉",
        message,
        [
          {
            text: "OK",
            onPress: () => {
              fetchAllData();
            }
          }
        ]
      );
    } catch (error: any) {
      const msg = error?.response?.data?.detail || "Failed to accept request.";
      Alert.alert("Error", msg);
    }
  }

  async function handleDecline(req: IncomingRequest) {
    const message = `Are you sure you want to decline the invitation from ${req.owner_name}?`;
    Alert.alert(
      "Decline Invitation",
      message,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Decline",
          style: "destructive",
          onPress: async () => {
            try {
              await declineRequest(req.id);
              setRequests((prev) => prev.filter((r) => r.id !== req.id));
              Alert.alert("Success", "Invitation declined.");
            } catch (error: any) {
              const msg = error?.response?.data?.detail || "Failed to decline invitation.";
              Alert.alert("Error", msg);
            }
          }
        }
      ]
    );
  }

  const renderOutgoingShares = () => (
    <View style={styles.section}>
      <AppText style={styles.sectionTitle}>Connected Family & Doctors</AppText>

      {loading && members.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color="#4ADE80" />
          <AppText style={styles.loaderText}>Loading connections…</AppText>
        </View>
      ) : members.length === 0 ? (
        <LinearGradient
          colors={["rgba(255,255,255,0.03)", "rgba(255,255,255,0.01)"]}
          style={styles.emptyCard}
        >
          <Users size={36} color="#475569" style={{ marginBottom: 10 }} />
          <AppText style={styles.emptyText}>No connected members yet</AppText>
          <AppText style={styles.emptySubText}>
            Share access with family, guardians, or doctors by sending them a secure link.
          </AppText>
        </LinearGradient>
      ) : (
        <View style={{ gap: 12 }}>
          {members.map((member) => {
            const isActive = member.status === "Active" || member.status === "Accepted" || member.status === "accepted";
            const badgeColor = isActive ? "#4ADE80" : (member.status === "Declined" || member.status === "declined" ? "#EF4444" : "#F59E0B");
            
            return (
              <LinearGradient
                key={member.id}
                colors={["rgba(255,255,255,0.04)", "rgba(255,255,255,0.01)"]}
                style={styles.memberCard}
              >
                <View style={styles.memberLeft}>
                  <View style={styles.avatar}>
                    <AppText style={styles.avatarLetter}>
                      {member.name.charAt(0).toUpperCase()}
                    </AppText>
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <AppText style={styles.memberName}>{member.name}</AppText>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: `${badgeColor}15`, borderColor: `${badgeColor}25` }
                        ]}
                      >
                        {isActive ? (
                          <CheckCircle2 size={10} color={badgeColor} />
                        ) : (
                          <Clock size={10} color={badgeColor} />
                        )}
                        <AppText style={[styles.statusText, { color: badgeColor }]}>
                          {member.status}
                        </AppText>
                      </View>
                    </View>
                    
                    <View style={styles.metaRow}>
                      <Mail size={12} color="#64748B" />
                      <AppText style={styles.metaText}>{member.email}</AppText>
                    </View>

                    <View style={styles.metaRow}>
                      <Lock size={12} color="#818CF8" />
                      <AppText style={[styles.metaText, { color: "#818CF8", fontWeight: "600" }]}>
                        {member.permission_level}
                      </AppText>
                    </View>
                  </View>
                </View>
                
                <Pressable
                  onPress={() => handleDelete(member)}
                  style={({ pressed }) => [
                    styles.deleteBtn,
                    pressed && { opacity: 0.6 }
                  ]}
                  hitSlop={8}
                >
                  <Trash2 size={16} color="#EF4444" />
                </Pressable>
              </LinearGradient>
            );
          })}
        </View>
      )}

      {/* INVITE ACTION */}
      <Pressable
        onPress={() => router.push("/access/add-family")}
        style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }, { marginTop: 20 }]}
      >
        <LinearGradient
          colors={["#22C55E", "#2563EB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.inviteButton}
        >
          <UserPlus size={18} color="#FFF" />
          <AppText style={styles.inviteButtonText}>Invite Family Member</AppText>
          <ChevronRight size={16} color="#FFF" />
        </LinearGradient>
      </Pressable>
    </View>
  );

  const renderIncomingRequests = () => (
    <View style={styles.section}>
      <AppText style={styles.sectionTitle}>Incoming Requests</AppText>

      {loading && requests.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color="#4ADE80" />
          <AppText style={styles.loaderText}>Loading requests…</AppText>
        </View>
      ) : requests.length === 0 ? (
        <LinearGradient
          colors={["rgba(255,255,255,0.03)", "rgba(255,255,255,0.01)"]}
          style={styles.emptyCard}
        >
          <Users size={36} color="#475569" style={{ marginBottom: 10 }} />
          <AppText style={styles.emptyText}>No pending requests</AppText>
          <AppText style={styles.emptySubText}>
            When someone shares their profile access with you, it will appear here.
          </AppText>
        </LinearGradient>
      ) : (
        <View style={{ gap: 12 }}>
          {requests.map((req) => (
            <LinearGradient
              key={req.id}
              colors={["rgba(255,255,255,0.04)", "rgba(255,255,255,0.01)"]}
              style={styles.memberCard}
            >
              <View style={styles.memberLeft}>
                <View style={styles.avatar}>
                  <AppText style={styles.avatarLetter}>
                    {req.owner_name.charAt(0).toUpperCase()}
                  </AppText>
                </View>
                
                <View style={{ flex: 1, marginRight: 10 }}>
                  <AppText style={styles.memberName}>{req.owner_name}</AppText>
                  
                  <View style={styles.metaRow}>
                    <Mail size={12} color="#64748B" />
                    <AppText style={styles.metaText}>{req.owner_email}</AppText>
                  </View>

                  <View style={styles.metaRow}>
                    <Lock size={12} color="#818CF8" />
                    <AppText style={[styles.metaText, { color: "#818CF8", fontWeight: "600" }]}>
                      {req.permission_level}
                    </AppText>
                  </View>
                </View>
              </View>
              
              {/* ACTION BUTTONS */}
              <View style={styles.actionRow}>
                <Pressable
                  onPress={() => handleAccept(req)}
                  style={({ pressed }) => [
                    styles.acceptBtn,
                    pressed && { opacity: 0.7 }
                  ]}
                >
                  <AppText style={styles.btnTextAccept}>Accept</AppText>
                </Pressable>
                <Pressable
                  onPress={() => handleDecline(req)}
                  style={({ pressed }) => [
                    styles.declineBtnInline,
                    pressed && { opacity: 0.7 }
                  ]}
                >
                  <AppText style={styles.btnTextDecline}>Decline</AppText>
                </Pressable>
              </View>
            </LinearGradient>
          ))}
        </View>
      )}
    </View>
  );

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
        <View style={styles.header}>
          <AppText variant="heading" style={styles.headingText}>
            Family Access
          </AppText>
          <AppText style={styles.subText}>
            Manage secure medical records access and sharing permissions.
          </AppText>
        </View>

        {/* SECURITY ACCREDITATION BANNER */}
        <LinearGradient
          colors={["rgba(124, 58, 237, 0.08)", "rgba(59, 130, 246, 0.04)"]}
          style={styles.securityBanner}
        >
          <ShieldCheck size={20} color="#818CF8" />
          <View style={{ flex: 1 }}>
            <AppText style={styles.securityTitle}>HIPAA Compliant & Secure</AppText>
            <AppText style={styles.securityDesc}>
              All access invitations use End-to-End Auth sync. Revoke permissions instantly at any time.
            </AppText>
          </View>
        </LinearGradient>

        {/* SEGMENTED TAB (Mobile Only) */}
        {isMobile && (
          <View style={styles.tabContainer}>
            <Pressable
              onPress={() => setActiveTab("sharing")}
              style={[styles.tabButton, activeTab === "sharing" ? styles.tabButtonActive : {}]}
            >
              <AppText style={[styles.tabButtonText, activeTab === "sharing" ? styles.tabButtonTextActive : {}]}>
                People You Invited
              </AppText>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab("requests")}
              style={[
                styles.tabButton,
                activeTab === "requests" ? styles.tabButtonActive : {},
                requests.length > 0 ? { flexDirection: "row", alignItems: "center", gap: 6 } : {}
              ]}
            >
              <AppText style={[styles.tabButtonText, activeTab === "requests" ? styles.tabButtonTextActive : {}]}>
                Invited You
              </AppText>
              {requests.length > 0 && (
                <View style={styles.badgeCount}>
                  <AppText style={styles.badgeCountText}>{requests.length}</AppText>
                </View>
              )}
            </Pressable>
          </View>
        )}

        {/* CONTENT */}
        {isMobile ? (
          activeTab === "sharing" ? renderOutgoingShares() : renderIncomingRequests()
        ) : (
          <View style={{ flexDirection: "row", gap: 24, alignItems: "flex-start" }}>
            <View style={{ flex: 1.2 }}>
              {renderOutgoingShares()}
            </View>
            <View style={{ flex: 1 }}>
              {renderIncomingRequests()}
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 140,
    maxWidth: IS_WEB ? 1100 : undefined,
    alignSelf: IS_WEB ? "center" : undefined,
    width: "100%",
  },
  header: {
    marginBottom: 22,
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
  securityBanner: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(129, 140, 248, 0.15)",
    marginBottom: 24,
    alignItems: "center",
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  securityDesc: {
    fontSize: 12,
    color: "#94A3B8",
    lineHeight: 16,
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  tabButtonText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "700",
  },
  tabButtonTextActive: {
    color: "#F8FAFC",
  },
  badgeCount: {
    backgroundColor: "#EF4444",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeCountText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "800",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  loaderContainer: {
    alignItems: "center",
    paddingVertical: 30,
    gap: 8,
  },
  loaderText: {
    color: "#64748B",
    fontSize: 13,
  },
  emptyCard: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 24,
    padding: 36,
    alignItems: "center",
  },
  emptyText: {
    color: "#94A3B8",
    fontSize: 15,
    fontWeight: "700",
  },
  emptySubText: {
    color: "#475569",
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  memberLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: {
    fontSize: 18,
    fontWeight: "900",
    color: "#F8FAFC",
  },
  memberName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
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
  deleteBtn: {
    padding: 10,
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 12,
  },
  inviteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    borderRadius: 22,
  },
  inviteButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "800",
    flex: 1,
    marginLeft: 8,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  acceptBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.25)",
    borderRadius: 8,
  },
  btnTextAccept: {
    color: "#4ADE80",
    fontSize: 12,
    fontWeight: "700",
  },
  declineBtnInline: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.25)",
    borderRadius: 8,
  },
  btnTextDecline: {
    color: "#FCA5A5",
    fontSize: 12,
    fontWeight: "700",
  },
});