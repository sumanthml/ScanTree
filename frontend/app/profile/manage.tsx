import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  User,
  UserPlus,
  Edit3,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  Users,
  ChevronRight,
  Star,
} from "lucide-react-native";
import AppText from "@/components/ui/AppText";
import { useProfileStore } from "@/store/profileStore";
import { deleteProfile } from "@/services/profile";

/*
============================================================
PROFILE CARD
============================================================
*/

function ProfileCard({
  profile,
  isActive,
  onActivate,
  onEdit,
  onDelete,
  isPrimary,
}: {
  profile: any;
  isActive: boolean;
  onActivate: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isPrimary: boolean;
}) {
  return (
    <Pressable
      onPress={onActivate}
      style={({ pressed }) => [
        styles.profileCard,
        isActive && styles.profileCardActive,
        pressed && { opacity: 0.9 },
      ]}
    >
      <LinearGradient
        colors={
          isActive
            ? ["rgba(74, 222, 128, 0.08)", "rgba(34, 197, 94, 0.04)"]
            : ["rgba(255,255,255,0.03)", "rgba(255,255,255,0.01)"]
        }
        style={styles.profileCardInner}
      >
        {/* LEFT: Avatar + Info */}
        <View style={styles.profileLeft}>
          <LinearGradient
            colors={
              isActive
                ? ["rgba(74, 222, 128, 0.2)", "rgba(59, 130, 246, 0.15)"]
                : ["rgba(255,255,255,0.06)", "rgba(255,255,255,0.02)"]
            }
            style={styles.avatar}
          >
            <User size={20} color={isActive ? "#4ADE80" : "#64748B"} />
          </LinearGradient>

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <AppText
                style={[
                  styles.profileName,
                  isActive ? { color: "#4ADE80" } : {},
                ]}
              >
                {profile.full_name}
              </AppText>
              {isPrimary && (
                <View style={styles.primaryBadge}>
                  <Star size={10} color="#F59E0B" />
                  <AppText style={styles.primaryBadgeText}>Primary</AppText>
                </View>
              )}
            </View>

            <AppText style={styles.profileMeta}>
              {[
                profile.date_of_birth && `Born ${profile.date_of_birth.substring(0, 4)}`,
                profile.gender,
                profile.blood_group,
              ]
                .filter(Boolean)
                .join(" · ") || "No details added"}
            </AppText>

            {profile.relationship_type && (
              <AppText style={styles.profileRelationship}>
                {profile.relationship_type.charAt(0).toUpperCase() +
                  profile.relationship_type.slice(1)}
              </AppText>
            )}
          </View>
        </View>

        {/* RIGHT: Active + Actions */}
        <View style={styles.profileRight}>
          {isActive && (
            <CheckCircle2 size={18} color="#4ADE80" style={{ marginBottom: 10 }} />
          )}
          {!profile.is_shared && (
            <Pressable
              onPress={onEdit}
              hitSlop={8}
              style={({ pressed }) => [
                styles.iconBtn,
                pressed && { opacity: 0.6 },
              ]}
            >
              <Edit3 size={15} color="#64748B" />
            </Pressable>
          )}
          {!isPrimary && !profile.is_shared && (
            <Pressable
              onPress={onDelete}
              hitSlop={8}
              style={({ pressed }) => [
                styles.iconBtn,
                pressed && { opacity: 0.6 },
              ]}
            >
              <Trash2 size={15} color="#EF4444" />
            </Pressable>
          )}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

/*
============================================================
MAIN SCREEN
============================================================
*/

export default function ManageProfilesScreen() {
  const {
    profiles,
    activeProfile,
    setActiveProfile,
    fetchProfiles,
    isLoading,
  } = useProfileStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function handleActivate(profile: any) {
    if (activeProfile?.id === profile.id) return;
    await setActiveProfile(profile);
    Alert.alert(
      "Active Profile Switched",
      `Now viewing data for ${profile.full_name}.`
    );
  }

  function handleEdit(profile: any) {
    setActiveProfile(profile);
    router.push("/profile/edit");
  }

  async function handleDelete(profile: any) {
    Alert.alert(
      "Delete Profile",
      `Are you sure you want to delete "${profile.full_name}"? All their reports will also be removed.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingId(profile.id);
              await deleteProfile(profile.id);
              await fetchProfiles();

              // If we deleted the active profile, switch to first
              if (activeProfile?.id === profile.id && profiles.length > 0) {
                const next = profiles.find((p) => p.id !== profile.id);
                if (next) await setActiveProfile(next);
              }
            } catch (error: any) {
              const msg =
                error?.response?.data?.detail ||
                "Failed to delete profile.";
              Alert.alert("Error", msg);
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#020617", "#071226", "#0F172A"]}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          {/* BACK BUTTON */}
          <Pressable
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/settings");
              }
            }}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { opacity: 0.7 },
            ]}
          >
            <ArrowLeft size={20} color="#94A3B8" />
            <AppText style={styles.backText}>Settings</AppText>
          </Pressable>

          {/* HEADER */}
          <View style={styles.header}>
            <LinearGradient
              colors={[
                "rgba(99, 102, 241, 0.15)",
                "rgba(59, 130, 246, 0.1)",
              ]}
              style={styles.iconCircle}
            >
              <Users size={28} color="#818CF8" />
            </LinearGradient>
            <AppText style={styles.title}>Manage Profiles</AppText>
            <AppText style={styles.subtitle}>
              Switch between profiles or add family members
            </AppText>
          </View>

          {/* LOADING */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4ADE80" />
              <AppText style={styles.loadingText}>Loading profiles…</AppText>
            </View>
          )}

          {/* PROFILES LIST */}
          {!isLoading && (
            <View style={styles.list}>
              {profiles.length === 0 ? (
                <LinearGradient
                  colors={[
                    "rgba(255,255,255,0.04)",
                    "rgba(255,255,255,0.01)",
                  ]}
                  style={styles.emptyCard}
                >
                  <User size={40} color="#334155" />
                  <AppText style={styles.emptyText}>No profiles found</AppText>
                  <AppText style={styles.emptySubText}>
                    Create your first health profile below
                  </AppText>
                </LinearGradient>
              ) : (
                profiles.map((profile) => {
                  const isPrimary =
                    (profile as any).relationship_type?.toLowerCase() ===
                    "self";
                  const isActive = activeProfile?.id === profile.id;
                  const isDeleting = deletingId === profile.id;

                  return isDeleting ? (
                    <View key={profile.id} style={styles.deletingCard}>
                      <ActivityIndicator size="small" color="#EF4444" />
                      <AppText style={styles.deletingText}>Deleting…</AppText>
                    </View>
                  ) : (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      isActive={isActive}
                      isPrimary={isPrimary}
                      onActivate={() => handleActivate(profile)}
                      onEdit={() => handleEdit(profile)}
                      onDelete={() => handleDelete(profile)}
                    />
                  );
                })
              )}
            </View>
          )}

          {/* ADD PROFILE BUTTON */}
          <Pressable
            onPress={() => router.push("/profile/create")}
            style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
          >
            <LinearGradient
              colors={["rgba(99,102,241,0.12)", "rgba(59,130,246,0.08)"]}
              style={styles.addButton}
            >
              <UserPlus size={20} color="#818CF8" />
              <AppText style={styles.addButtonText}>Add Family Member</AppText>
              <ChevronRight size={18} color="#818CF8" />
            </LinearGradient>
          </Pressable>

          <View style={{ height: 80 }} />
        </ScrollView>
      </LinearGradient>
    </>
  );
}

/*
============================================================
STYLES
============================================================
*/

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: Platform.OS === "android" ? 50 : 60,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 28,
  },
  backText: {
    color: "#94A3B8",
    fontSize: 15,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.2)",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#F8FAFC",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "#64748B",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    color: "#64748B",
    fontSize: 14,
  },
  list: {
    gap: 12,
    marginBottom: 20,
  },
  profileCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
  },
  profileCardActive: {
    borderColor: "rgba(74, 222, 128, 0.3)",
  },
  profileCardInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  profileLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  profileMeta: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 3,
  },
  profileRelationship: {
    fontSize: 11,
    color: "#475569",
    marginTop: 2,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  primaryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.2)",
  },
  primaryBadgeText: {
    fontSize: 10,
    color: "#F59E0B",
    fontWeight: "700",
  },
  profileRight: {
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.04)",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 40,
    alignItems: "center",
    gap: 10,
  },
  emptyText: {
    color: "#64748B",
    fontSize: 15,
    fontWeight: "700",
  },
  emptySubText: {
    color: "#475569",
    fontSize: 13,
    textAlign: "center",
  },
  deletingCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.15)",
    backgroundColor: "rgba(239, 68, 68, 0.04)",
  },
  deletingText: {
    color: "#EF4444",
    fontSize: 14,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.2)",
  },
  addButtonText: {
    flex: 1,
    color: "#818CF8",
    fontSize: 15,
    fontWeight: "700",
  },
});
