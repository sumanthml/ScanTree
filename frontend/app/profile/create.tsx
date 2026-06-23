import React, { useState } from "react";
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
  CheckCircle2,
  Users,
} from "lucide-react-native";
import AppText from "@/components/ui/AppText";
import { useProfileStore } from "@/store/profileStore";
import { createProfile } from "@/services/profile";

/*
============================================================
CHIP SELECTOR (Gender / Relationship)
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
MAIN SCREEN
============================================================
*/

const GENDER_OPTIONS = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

const RELATIONSHIP_OPTIONS = [
  { label: "Self", value: "Self" },
  { label: "Spouse", value: "Spouse" },
  { label: "Child", value: "Child" },
  { label: "Parent", value: "Parent" },
  { label: "Sibling", value: "Sibling" },
  { label: "Other", value: "Other" },
];

export default function CreateProfileScreen() {
  const { setActiveProfile, fetchProfiles } = useProfileStore();

  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(""); // YYYY-MM-DD
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [relationship, setRelationship] = useState("Self");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!fullName.trim()) {
      Alert.alert("Required", "Please enter a full name for this profile.");
      return;
    }

    // Validate date format if provided
    if (dateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
      Alert.alert(
        "Invalid Date",
        "Please enter date of birth in YYYY-MM-DD format (e.g. 1990-06-15)."
      );
      return;
    }

    try {
      setLoading(true);

      const profile = await createProfile({
        full_name: fullName.trim(),
        gender: gender || undefined,
        date_of_birth: dateOfBirth || null,
        blood_group: bloodGroup.trim() || null,
        relationship_type: relationship,
      });

      await setActiveProfile(profile);
      await fetchProfiles();

      Alert.alert(
        "Profile Created!",
        `${fullName.trim()} has been added successfully.`,
        [
          {
            text: "Go to Dashboard",
            onPress: () => router.replace("/(tabs)/dashboard"),
          },
        ]
      );
    } catch (error: any) {
      const msg =
        error?.response?.data?.detail ||
        "Failed to create profile. Please try again.";
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
                "rgba(74, 222, 128, 0.15)",
                "rgba(59, 130, 246, 0.1)",
              ]}
              style={styles.iconCircle}
            >
              <User size={28} color="#4ADE80" />
            </LinearGradient>
            <AppText style={styles.title}>Create Profile</AppText>
            <AppText style={styles.subtitle}>
              Add a new health profile for yourself or a family member
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
                  placeholder="e.g. Arjun Sharma"
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

            {/* RELATIONSHIP */}
            <View style={styles.fieldWrapper}>
              <AppText style={styles.fieldLabel}>Relationship</AppText>
              <ChipSelector
                options={RELATIONSHIP_OPTIONS}
                value={relationship}
                onChange={setRelationship}
              />
            </View>
          </LinearGradient>

          {/* SUBMIT BUTTON */}
          <Pressable
            onPress={handleCreate}
            disabled={loading}
            style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
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
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <CheckCircle2 size={20} color="#fff" />
                  <AppText style={styles.submitText}>Create Profile</AppText>
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
    borderColor: "rgba(74, 222, 128, 0.2)",
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
