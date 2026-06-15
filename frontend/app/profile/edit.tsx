import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Pressable,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  User,
  Calendar,
  Droplets,
  ArrowLeft,
  Save,
} from "lucide-react-native";
import AppText from "@/components/ui/AppText";
import { useProfileStore } from "@/store/profileStore";
import { updateProfile } from "@/services/profile";

/*
============================================================
CHIP SELECTOR
============================================================
*/

function ChipSelector({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.chipRow}>
      {options.map((opt) => (
        <Pressable
          key={opt.value}
          onPress={() => onChange(opt.value)}
          style={[styles.chip, value === opt.value && styles.chipActive]}
        >
          <AppText
            style={[
              styles.chipText,
              value === opt.value ? { color: "#4ADE80" } : {},
            ]}
          >
            {opt.label}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}

/*
============================================================
CONSTANTS
============================================================
*/

const GENDER_OPTIONS = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

/*
============================================================
MAIN SCREEN
============================================================
*/

export default function EditProfileScreen() {
  const { activeProfile, setActiveProfile, fetchProfiles } = useProfileStore();

  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeProfile) {
      setFullName(activeProfile.full_name || "");
      setGender((activeProfile as any).gender || "");
      setDateOfBirth((activeProfile as any).date_of_birth || "");
      setBloodGroup((activeProfile as any).blood_group || "");
    }
  }, [activeProfile]);

  async function handleUpdate() {
    if (!activeProfile) return;
    if (!fullName.trim()) {
      Alert.alert("Required", "Full name cannot be empty.");
      return;
    }

    if (dateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
      Alert.alert(
        "Invalid Date",
        "Please use YYYY-MM-DD format (e.g. 1990-06-15)."
      );
      return;
    }

    try {
      setLoading(true);

      const updated = await updateProfile(activeProfile.id, {
        full_name: fullName.trim(),
        gender: gender || undefined,
        date_of_birth: dateOfBirth || null,
        blood_group: bloodGroup.trim() || null,
      });

      await setActiveProfile(updated);
      await fetchProfiles();

      Alert.alert("Saved!", "Profile updated successfully.", [
        {
          text: "OK",
          onPress: () => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/profile/manage");
            }
          },
        },
      ]);
    } catch (error: any) {
      const msg =
        error?.response?.data?.detail ||
        "Failed to update profile. Please try again.";
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
                router.replace("/profile/manage");
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
                "rgba(59, 130, 246, 0.15)",
                "rgba(74, 222, 128, 0.1)",
              ]}
              style={styles.iconCircle}
            >
              <User size={28} color="#3B82F6" />
            </LinearGradient>
            <AppText style={styles.title}>Edit Profile</AppText>
            <AppText style={styles.subtitle}>
              Update details for {activeProfile?.full_name || "this profile"}
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
            {/* FULL NAME */}
            <View style={styles.fieldWrapper}>
              <AppText style={styles.fieldLabel}>Full Name *</AppText>
              <View style={styles.inputRow}>
                <User size={16} color="#64748B" />
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Full name"
                  placeholderTextColor="#475569"
                  style={styles.textInput}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* DATE OF BIRTH */}
            <View style={styles.fieldWrapper}>
              <AppText style={styles.fieldLabel}>Date of Birth</AppText>
              <View style={styles.inputRow}>
                <Calendar size={16} color="#64748B" />
                <TextInput
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                  placeholder="YYYY-MM-DD (e.g. 1990-06-15)"
                  placeholderTextColor="#475569"
                  style={styles.textInput}
                  keyboardType="numbers-and-punctuation"
                  maxLength={10}
                />
              </View>
            </View>

            {/* BLOOD GROUP */}
            <View style={styles.fieldWrapper}>
              <AppText style={styles.fieldLabel}>Blood Group</AppText>
              <View style={styles.inputRow}>
                <Droplets size={16} color="#64748B" />
                <TextInput
                  value={bloodGroup}
                  onChangeText={setBloodGroup}
                  placeholder="e.g. O+, A-, B+"
                  placeholderTextColor="#475569"
                  autoCapitalize="characters"
                  style={styles.textInput}
                />
              </View>
            </View>

            {/* GENDER */}
            <View style={styles.fieldWrapper}>
              <AppText style={styles.fieldLabel}>Gender</AppText>
              <ChipSelector
                options={GENDER_OPTIONS}
                value={gender}
                onChange={setGender}
              />
            </View>
          </LinearGradient>

          {/* SAVE BUTTON */}
          <Pressable
            onPress={handleUpdate}
            disabled={loading}
            style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
          >
            <LinearGradient
              colors={
                loading ? ["#1E293B", "#1E293B"] : ["#3B82F6", "#6366F1"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveButton}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Save size={20} color="#fff" />
                  <AppText style={styles.saveText}>Save Changes</AppText>
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
    borderColor: "rgba(59, 130, 246, 0.2)",
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
    marginBottom: 24,
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
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
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
  saveButton: {
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});