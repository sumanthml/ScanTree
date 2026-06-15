import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Screen from "@/components/ui/Screen";
import AppText from "@/components/ui/AppText";
import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore";
import { forgotPassword } from "@/services/auth";
import { useAlertStore } from "@/store/alertStore";
import {
  Lock,
  ChevronRight,
  Users,
  Mail,
  Activity,
  Edit3,
  LogOut,
} from "lucide-react-native";

/*
============================================================
ALERT SHADOW WRAPPER
============================================================
*/
const Alert = {
  alert: (
    title: string,
    message?: string,
    buttons?: { text: string; onPress?: () => void; style?: "default" | "cancel" | "destructive" }[]
  ) => {
    useAlertStore.getState().showAlert(title, message, buttons);
  },
};

/*
============================================================
TYPES & SUBCOMPONENTS
============================================================
*/
interface RowProps {
  icon: any;
  title: string;
  subtitle: string;
  onPress?: () => void;
  danger?: boolean;
  accent?: boolean;
}

function SettingsRow({
  icon: Icon,
  title,
  subtitle,
  onPress,
  danger,
  accent,
}: RowProps) {
  const iconColor = danger ? "#EF4444" : accent ? "#818CF8" : "#94A3B8";
  const titleColor = danger ? "#F87171" : "#F8FAFC";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.rowPressable, pressed && { opacity: 0.7 }]}
    >
      <View style={styles.settingRow}>
        <View style={styles.settingLeft}>
          <View
            style={[
              styles.iconBox,
              danger && { backgroundColor: "rgba(239, 68, 68, 0.06)" },
              accent && { backgroundColor: "rgba(99, 102, 241, 0.08)" },
            ]}
          >
            <Icon size={18} color={iconColor} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={[styles.rowTitle, { color: titleColor }]}>{title}</AppText>
            <AppText style={styles.rowSubtitle}>{subtitle}</AppText>
          </View>
        </View>
        <ChevronRight size={18} color={danger ? "#EF444466" : "#64748B"} />
      </View>
    </Pressable>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <LinearGradient
      colors={["rgba(255, 255, 255, 0.04)", "rgba(255, 255, 255, 0.01)"]}
      style={styles.section}
    >
      <AppText style={styles.sectionTitle}>{title}</AppText>
      <View>{children}</View>
    </LinearGradient>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

/*
============================================================
MAIN SCREEN
============================================================
*/
export default function SettingsScreen() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const { activeProfile } = useProfileStore();
  const [sendingReset, setSendingReset] = useState(false);

  async function handleChangePassword() {
    if (!user?.email) {
      Alert.alert(
        "No Email",
        "Could not find your account email. Please log out and log in again."
      );
      return;
    }

    Alert.alert(
      "Change Password",
      `A password reset link will be sent to:\n\n${user.email}\n\nPlease check your inbox.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Link",
          onPress: async () => {
            try {
              setSendingReset(true);
              await forgotPassword({ email: user.email });
              Alert.alert(
                "✓ Email Sent",
                `Password reset instructions sent to ${user.email}.`
              );
            } catch (error: any) {
              const msg =
                error?.response?.data?.error?.message ||
                "Failed to send reset email. Try again.";
              Alert.alert("Error", msg);
            } finally {
              setSendingReset(false);
            }
          },
        },
      ]
    );
  }

  function handleLogout() {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of ScanTrace?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  }

  if (sendingReset) {
    return (
      <Screen>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#818CF8" />
          <AppText style={{ color: "#94A3B8", marginTop: 12 }}>
            Sending reset email…
          </AppText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <AppText variant="heading" style={styles.headingText}>
            Settings
          </AppText>
          <AppText style={styles.subText}>
            Account settings &amp; profile details
          </AppText>
        </View>

        {/* USER INFO CARD */}
        {user && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/profile/manage")}
          >
            <LinearGradient
              colors={["rgba(99, 102, 241, 0.1)", "rgba(59, 130, 246, 0.05)"]}
              style={styles.userCard}
            >
              {/* Avatar */}
              <LinearGradient
                colors={["rgba(99,102,241,0.35)", "rgba(59,130,246,0.2)"]}
                style={styles.userAvatar}
              >
                <AppText style={styles.userAvatarLetter}>
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </AppText>
              </LinearGradient>

              <View style={{ flex: 1 }}>
                <AppText style={styles.userName}>{user.name || "Account"}</AppText>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                  <Mail size={12} color="#64748B" />
                  <AppText style={styles.userEmail}>{user.email}</AppText>
                </View>
                {activeProfile && (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4 }}>
                    <Activity size={12} color="#4ADE80" />
                    <AppText style={styles.activeProfileText}>
                      Active: {activeProfile.full_name}
                    </AppText>
                  </View>
                )}
              </View>
              <ChevronRight size={18} color="#64748B" />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* ACCOUNT SECTION */}
        <Section title="Account Settings">
          <SettingsRow
            icon={Users}
            title="Profile Management"
            subtitle="Switch profiles, add family members"
            accent
            onPress={() => router.push("/profile/manage")}
          />
          <Divider />
          <SettingsRow
            icon={Edit3}
            title="Edit Profile"
            subtitle="Update name, age, and health info"
            onPress={() => router.push("/profile/edit")}
          />
          <Divider />
          <SettingsRow
            icon={Lock}
            title="Change Password"
            subtitle={`Send reset link to ${user?.email || "your email"}`}
            onPress={handleChangePassword}
          />
        </Section>

        {/* LOGOUT BUTTON */}
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [styles.logoutButton, pressed && { opacity: 0.8 }]}
        >
          <LinearGradient
            colors={["rgba(239, 68, 68, 0.12)", "rgba(239, 68, 68, 0.05)"]}
            style={styles.logoutGradient}
          >
            <LogOut size={18} color="#F87171" />
            <AppText style={styles.logoutText}>Sign Out of ScanTrace</AppText>
          </LinearGradient>
        </Pressable>

        <View style={{ height: 120 }} />
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.2)",
    padding: 18,
    marginBottom: 20,
  },
  userAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  userAvatarLetter: {
    fontSize: 22,
    fontWeight: "900",
    color: "#F8FAFC",
  },
  userName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  userEmail: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  activeProfileText: {
    fontSize: 12,
    color: "#4ADE80",
    fontWeight: "600",
  },
  section: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    padding: 22,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748B",
    marginBottom: 18,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    marginVertical: 14,
  },
  rowPressable: {
    marginVertical: 2,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
    gap: 14,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#F8FAFC",
  },
  rowSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 3,
    lineHeight: 16,
  },
  logoutButton: {
    marginTop: 8,
    borderRadius: 22,
    overflow: "hidden",
  },
  logoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
    borderRadius: 22,
  },
  logoutText: {
    color: "#F87171",
    fontWeight: "800",
    fontSize: 15,
  },
});