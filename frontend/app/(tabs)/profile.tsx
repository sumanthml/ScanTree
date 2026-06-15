import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  User,
  Mail,
  Users,
  Edit3,
  PlusCircle,
  Activity,
  CheckCircle2,
  Droplets,
  Calendar,
  Settings,
} from "lucide-react-native";
import AppText from "@/components/ui/AppText";
import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore";
import { useResponsive } from "@/hooks/useResponsive";

export default function ProfileScreen() {
  const { isMobile } = useResponsive();
  const { user } = useAuthStore();
  const {
    profiles,
    activeProfile,
    fetchProfiles,
    setActiveProfile,
    isLoading,
  } = useProfileStore();


  useEffect(() => {
    fetchProfiles();
  }, []);

  async function handleActivate(profile: any) {
    if (activeProfile?.id === profile.id) return;
    await setActiveProfile(profile);
  }



  const renderUserDetails = () => (
    <View style={{ gap: 16 }}>
      {/* USER CARD */}
      <LinearGradient
        colors={["rgba(99,102,241,0.12)", "rgba(59,130,246,0.06)"]}
        style={styles.userCard}
      >
        <LinearGradient
          colors={["rgba(99,102,241,0.35)", "rgba(59,130,246,0.25)"]}
          style={styles.avatar}
        >
          <AppText style={styles.avatarLetter}>
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </AppText>
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <AppText style={styles.userName}>{user?.name || "Account"}</AppText>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
            <Mail size={12} color="#64748B" />
            <AppText style={styles.userEmail}>{user?.email || "—"}</AppText>
          </View>
          {activeProfile && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 }}>
              <Activity size={12} color="#4ADE80" />
              <AppText style={styles.activeLabel}>
                {activeProfile.full_name}
              </AppText>
            </View>
          )}
        </View>
        {Platform.OS !== "web" && (
          <Pressable
            onPress={() => router.push("/settings")}
            style={({ pressed }) => [
              styles.settingsBtn,
              pressed && { opacity: 0.7 }
            ]}
          >
            <Settings size={20} color="#94A3B8" />
          </Pressable>
        )}
      </LinearGradient>

      {/* ACTIVE PROFILE DETAIL */}
      {activeProfile && (
        <LinearGradient
          colors={["rgba(74,222,128,0.07)", "rgba(74,222,128,0.02)"]}
          style={[styles.activeCard, { marginBottom: 0 }]}
        >
          <View style={styles.activeHeader}>
            <AppText style={styles.sectionTitle}>Active Profile</AppText>
            <Pressable
              onPress={() => router.push("/profile/edit")}
              style={({ pressed }) => [
                styles.editBtn,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Edit3 size={14} color="#4ADE80" />
              <AppText style={styles.editBtnText}>Edit</AppText>
            </Pressable>
          </View>

          <AppText style={styles.activeName}>{activeProfile.full_name}</AppText>

          <View style={styles.detailRow}>
            {activeProfile.gender && (
              <View style={styles.detailChip}>
                <User size={11} color="#64748B" />
                <AppText style={styles.detailChipText}>
                  {activeProfile.gender}
                </AppText>
              </View>
            )}
            {activeProfile.date_of_birth && (
              <View style={styles.detailChip}>
                <Calendar size={11} color="#64748B" />
                <AppText style={styles.detailChipText}>
                  Born {activeProfile.date_of_birth}
                </AppText>
              </View>
            )}
            {activeProfile.blood_group && (
              <View style={styles.detailChip}>
                <Droplets size={11} color="#EF4444" />
                <AppText style={styles.detailChipText}>
                  {activeProfile.blood_group}
                </AppText>
              </View>
            )}
            {activeProfile.relationship_type && (
              <View style={styles.detailChip}>
                <Users size={11} color="#818CF8" />
                <AppText style={styles.detailChipText}>
                  {activeProfile.relationship_type}
                </AppText>
              </View>
            )}
          </View>
        </LinearGradient>
      )}
    </View>
  );

  const renderProfilesList = () => (
    <View style={{ gap: 16 }}>
      {/* PROFILES LIST */}
      <LinearGradient
        colors={["rgba(255,255,255,0.04)", "rgba(255,255,255,0.01)"]}
        style={[styles.section, { marginBottom: 0 }]}
      >
        <View style={styles.sectionHeader}>
          <AppText style={styles.sectionTitle}>
            All Profiles ({profiles.length})
          </AppText>
          <Pressable
            onPress={() => router.push("/profile/manage")}
            style={({ pressed }) => [pressed && { opacity: 0.7 }]}
          >
            <AppText style={styles.manageLink}>Manage →</AppText>
          </Pressable>
        </View>

        {isLoading ? (
          <ActivityIndicator color="#4ADE80" style={{ marginTop: 20 }} />
        ) : profiles.length === 0 ? (
          <AppText style={styles.emptyText}>
            No profiles yet. Create one below.
          </AppText>
        ) : (
          <View style={{ gap: 10 }}>
            {profiles.map((profile) => {
              const isActive = activeProfile?.id === profile.id;
              return (
                <Pressable
                  key={profile.id}
                  onPress={() => handleActivate(profile)}
                  style={({ pressed }) => [
                    styles.profileItem,
                    isActive && styles.profileItemActive,
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  <View style={styles.profileItemLeft}>
                    <LinearGradient
                      colors={
                        isActive
                          ? ["rgba(74,222,128,0.2)", "rgba(74,222,128,0.1)"]
                          : ["rgba(255,255,255,0.06)", "rgba(255,255,255,0.02)"]
                      }
                      style={styles.profileAvatar}
                    >
                      <User size={16} color={isActive ? "#4ADE80" : "#64748B"} />
                    </LinearGradient>
                    <View>
                      <AppText
                        style={[
                          styles.profileItemName,
                          isActive ? { color: "#4ADE80" } : {},
                        ]}
                      >
                        {profile.full_name}
                      </AppText>
                      <AppText style={styles.profileItemSub}>
                        {profile.relationship_type || "Profile"}
                        {profile.blood_group ? ` · ${profile.blood_group}` : ""}
                      </AppText>
                    </View>
                  </View>
                  {isActive && (
                    <CheckCircle2 size={18} color="#4ADE80" />
                  )}
                </Pressable>
              );
            })}
          </View>
        )}
      </LinearGradient>

      {/* QUICK ACTIONS */}
      <View style={styles.quickActions}>
        <Pressable
          onPress={() => router.push("/profile/create")}
          style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.85 : 1 }]}
        >
          <LinearGradient
            colors={["rgba(74,222,128,0.1)", "rgba(74,222,128,0.04)"]}
            style={styles.actionBtn}
          >
            <PlusCircle size={18} color="#4ADE80" />
            <AppText style={[styles.actionBtnText, { color: "#4ADE80" }]}>
              Add Profile
            </AppText>
          </LinearGradient>
        </Pressable>

        <Pressable
          onPress={() => router.push("/profile/manage")}
          style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.85 : 1 }]}
        >
          <LinearGradient
            colors={["rgba(99,102,241,0.1)", "rgba(99,102,241,0.04)"]}
            style={styles.actionBtn}
          >
            <Users size={18} color="#818CF8" />
            <AppText style={[styles.actionBtnText, { color: "#818CF8" }]}>
              Manage All
            </AppText>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={["#020617", "#071226", "#0F172A"]} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {isMobile ? (
          <View style={{ gap: 16 }}>
            {renderUserDetails()}
            {renderProfilesList()}
          </View>
        ) : (
          <View style={{ flexDirection: "row", gap: 24, alignItems: "flex-start" }}>
            <View style={{ flex: 1 }}>
              {renderUserDetails()}
            </View>
            <View style={{ flex: 1 }}>
              {renderProfilesList()}
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </LinearGradient>
  );
}

/*
============================================================
STYLES
============================================================
*/

const IS_WEB = Platform.OS === "web";

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: Platform.OS === "android" ? 50 : 60,
    maxWidth: IS_WEB ? 1100 : undefined,
    alignSelf: IS_WEB ? "center" : undefined,
    width: "100%",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(99,102,241,0.2)",
    padding: 20,
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: {
    fontSize: 24,
    fontWeight: "900",
    color: "#F8FAFC",
  },
  userName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  userEmail: {
    fontSize: 12,
    color: "#64748B",
  },
  activeLabel: {
    fontSize: 12,
    color: "#4ADE80",
    fontWeight: "600",
  },
  activeCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(74,222,128,0.2)",
    padding: 20,
    marginBottom: 16,
  },
  activeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(74,222,128,0.08)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(74,222,128,0.15)",
  },
  editBtnText: {
    color: "#4ADE80",
    fontSize: 12,
    fontWeight: "700",
  },
  activeName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#F8FAFC",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  detailChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  detailChipText: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "600",
  },
  section: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  manageLink: {
    fontSize: 13,
    color: "#818CF8",
    fontWeight: "700",
  },
  emptyText: {
    color: "#475569",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  profileItemActive: {
    borderColor: "rgba(74,222,128,0.3)",
    backgroundColor: "rgba(74,222,128,0.04)",
  },
  profileItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  profileAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  profileItemName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  profileItemSub: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
  logoutBtn: {
    borderRadius: 20,
    overflow: "hidden",
  },
  logoutInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
    borderRadius: 20,
  },
  logoutText: {
    color: "#F87171",
    fontWeight: "800",
    fontSize: 15,
  },
  settingsBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
});