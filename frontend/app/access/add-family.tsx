import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AppText from "@/components/ui/AppText";
import { inviteMember } from "@/services/access";
import {
  ArrowLeft,
  Mail,
  Lock,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react-native";

const PERMISSION_OPTIONS = [
  { label: "Critical Reports Only", value: "Critical Reports Only" },
  { label: "Full Medical Analytics", value: "Full Medical Analytics" },
  { label: "Emergency Access", value: "Emergency Access" },
  { label: "Temporary Viewing Access", value: "Temporary Viewing Access" },
];

function PermissionChip({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, isActive && styles.chipActive]}
    >
      <AppText
        style={[
          styles.chipText,
          isActive ? { color: "#4ADE80" } : {},
        ]}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

export default function AddFamilyScreen() {
  const [email, setEmail] = useState("");
  const [permissionLevel, setPermissionLevel] = useState("Critical Reports Only");
  const [loading, setLoading] = useState(false);

  async function handleInvite() {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      Alert.alert("Required", "Please enter an email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      await inviteMember(trimmedEmail, permissionLevel);
      
      Alert.alert(
        "Invitation Sent!",
        `Successfully shared access with ${trimmedEmail}.`,
        [
          {
            text: "OK",
            onPress: () => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/(tabs)/access");
              }
            },
          },
        ]
      );
    } catch (error: any) {
      const msg = error?.response?.data?.detail || "Failed to send invitation. Please try again.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#020617", "#071226", "#0F172A"]}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* BACK BUTTON */}
          <Pressable
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/(tabs)/access");
              }
            }}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { opacity: 0.7 },
            ]}
          >
            <ArrowLeft size={20} color="#94A3B8" />
            <AppText style={styles.backText}>Back</AppText>
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
              <UserPlus size={28} color="#818CF8" />
            </LinearGradient>
            <AppText style={styles.title}>Invite Family Member</AppText>
            <AppText style={styles.subtitle}>
              Grant secure medical records viewing permissions to your family or doctors.
            </AppText>
          </View>

          {/* FORM CARD */}
          <LinearGradient
            colors={[
              "rgba(255, 255, 255, 0.05)",
              "rgba(255, 255, 255, 0.02)",
            ]}
            style={styles.card}
          >
            {/* EMAIL ADDRESS */}
            <View style={styles.fieldWrapper}>
              <AppText style={styles.fieldLabel}>Email Address *</AppText>
              <View style={styles.inputRow}>
                <Mail size={16} color="#64748B" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="family@example.com"
                  placeholderTextColor="#475569"
                  style={styles.textInput}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* PERMISSION LEVEL */}
            <View style={styles.fieldWrapper}>
              <AppText style={styles.fieldLabel}>Access Permission *</AppText>
              <View style={styles.chipRow}>
                {PERMISSION_OPTIONS.map((opt) => (
                  <PermissionChip
                    key={opt.value}
                    label={opt.label}
                    isActive={permissionLevel === opt.value}
                    onPress={() => setPermissionLevel(opt.value)}
                  />
                ))}
              </View>
            </View>
          </LinearGradient>

          {/* SECURITY WARNING */}
          <View style={styles.securityWrapper}>
            <ShieldCheck size={16} color="#64748B" />
            <AppText style={styles.securityText}>
              Invited members will receive viewing permission. You can revoke their access instantly from the connected list.
            </AppText>
          </View>

          {/* SUBMIT BUTTON */}
          <Pressable
            onPress={handleInvite}
            disabled={loading}
            style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }, { marginTop: 8 }]}
          >
            <LinearGradient
              colors={
                loading ? ["#1E293B", "#1E293B"] : ["#22C55E", "#2563EB"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.submitButton}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <CheckCircle2 size={20} color="#fff" />
                  <AppText style={styles.submitText}>Send Secure Invitation</AppText>
                </View>
              )}
            </LinearGradient>
          </Pressable>

          <View style={{ height: 60 }} />
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

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
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    padding: 24,
    gap: 20,
    marginBottom: 20,
  },
  fieldWrapper: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.07)",
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 12,
    gap: 10,
  },
  textInput: {
    flex: 1,
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "500",
    padding: 0,
    margin: 0,
  },
  chipRow: {
    gap: 8,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  chipActive: {
    borderColor: "rgba(74, 222, 128, 0.4)",
    backgroundColor: "rgba(74, 222, 128, 0.06)",
  },
  chipText: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "600",
  },
  securityWrapper: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  securityText: {
    flex: 1,
    color: "#64748B",
    fontSize: 12,
    lineHeight: 16,
  },
  submitButton: {
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});