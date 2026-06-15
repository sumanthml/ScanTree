import {
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert as RNAlert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Dimensions,
  StatusBar,
} from "react-native";

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

import { router } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";

import { registerUser } from "@/services/auth";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const isDesktop = isWeb && SCREEN_WIDTH >= 1024;

/*
=====================================
SMALL COMPONENTS
=====================================
*/

function InputLabel({ label }: { label: string }) {
  return (
    <Text
      style={{
        color: "#94A3B8",
        fontSize: 13,
        fontWeight: "600",
        marginBottom: 8,
        letterSpacing: 0.3,
        textTransform: "uppercase",
      }}
    >
      {label}
    </Text>
  );
}

function StyledInput(props: React.ComponentProps<typeof TextInput>) {
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      {...props}
      onFocus={(e) => {
        setFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        props.onBlur?.(e);
      }}
      placeholderTextColor="#475569"
      style={[
        {
          backgroundColor: "rgba(15,23,42,0.7)",
          color: "#F8FAFC",
          borderRadius: 16,
          paddingHorizontal: 18,
          paddingVertical: Platform.OS === "ios" ? 18 : 16,
          fontSize: 16,
          borderWidth: 1.5,
          borderColor: focused
            ? "rgba(74,222,128,0.5)"
            : "rgba(255,255,255,0.07)",
        },
        props.style as any,
      ]}
    />
  );
}

/*
=====================================
STRENGTH METER
=====================================
*/

function PasswordStrength({ password }: { password: string }) {

  const getStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();

  const colors: Record<number, string> = {
    0: "#1E293B",
    1: "#EF4444",
    2: "#F97316",
    3: "#EAB308",
    4: "#22C55E",
  };

  const labels: Record<number, string> = {
    0: "",
    1: "Weak",
    2: "Fair",
    3: "Good",
    4: "Strong",
  };

  if (!password) return null;

  return (
    <View style={{ marginTop: 10 }}>
      <View style={{ flexDirection: "row", gap: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              backgroundColor:
                i <= strength ? colors[strength] : "rgba(255,255,255,0.1)",
            }}
          />
        ))}
      </View>
      {strength > 0 && (
        <Text
          style={{
            color: colors[strength],
            fontSize: 12,
            fontWeight: "600",
            marginTop: 6,
          }}
        >
          {labels[strength]} password
        </Text>
      )}
    </View>
  );
}

/*
=====================================
MAIN SCREEN
=====================================
*/

export default function RegisterScreen() {

  /*
  =====================================
  STATE
  =====================================
  */

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /*
  =====================================
  VALIDATION
  =====================================
  */

  const validate = (): string | null => {
    if (!name.trim()) return "Full name is required.";
    if (!email.trim()) return "Email address is required.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email.";
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  };

  /*
  =====================================
  HANDLE REGISTER
  =====================================
  */

  const handleRegister = async () => {

    const validationError = validate();
    if (validationError) {
      Alert.alert("Validation Error", validationError);
      return;
    }

    try {

      setLoading(true);

      await registerUser({ name: name.trim(), email: email.trim(), password });

      Alert.alert(
        "Account Created! 🎉",
        "Your account has been successfully created. Please sign in.",
        [
          {
            text: "Sign In",
            onPress: () => router.replace("/(auth)/login"),
          },
        ]
      );

    } catch (error: any) {
      console.log("REGISTER ERROR:", error?.response?.data || error?.message);

      // Backend returns { detail: "EMAIL_EXISTS" } or Firebase format
      const backendDetail: string = error?.response?.data?.detail ?? "";
      const firebaseCode: string =
        error?.response?.data?.error?.message ?? "";
      const errorCode = backendDetail || firebaseCode;

      const friendlyMessage: Record<string, string> = {
        EMAIL_EXISTS:
          "This email is already registered. Please sign in instead.",
        OPERATION_NOT_ALLOWED:
          "Email/password sign-up is not enabled. Contact support.",
        WEAK_PASSWORD:
          "Password is too weak. Use at least 6 characters with mixed case.",
        INVALID_EMAIL:
          "The email address is not valid. Please check and try again.",
        TOO_MANY_ATTEMPTS_TRY_LATER:
          "Too many attempts. Please wait a few minutes and try again.",
        USER_DISABLED:
          "This account has been disabled. Please contact support.",
      };

      const message =
        friendlyMessage[errorCode] ||
        (errorCode && !errorCode.includes("error") ? errorCode : null) ||
        error?.message ||
        "Unable to create account. Please try again.";

      Alert.alert("Registration Failed", message);
    } finally {
      setLoading(false);
    }
  };

  /*
  =====================================
  UI
  =====================================
  */

  return (
    <LinearGradient
      colors={["#020617", "#071226", "#0D1B38"]}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#020617" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
            paddingVertical: 48,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* CARD */}
          <View
            style={{
              width: "100%",
              maxWidth: isDesktop ? 500 : 440,
              backgroundColor: "rgba(255,255,255,0.04)",
              borderRadius: 32,
              padding: isDesktop ? 40 : 28,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.07)",
              shadowColor: "#000",
              shadowOpacity: 0.4,
              shadowRadius: 40,
              shadowOffset: { width: 0, height: 20 },
              elevation: 20,
            }}
          >

            {/* HEADER */}
            <View style={{ marginBottom: 32 }}>

              <LinearGradient
                colors={["#22C55E", "#2563EB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Text style={{ fontSize: 24 }}>🌿</Text>
              </LinearGradient>

              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: isDesktop ? 38 : 32,
                  fontWeight: "800",
                  letterSpacing: -0.5,
                }}
              >
                Create Account
              </Text>

              <Text
                style={{
                  color: "#64748B",
                  marginTop: 8,
                  fontSize: 15,
                  lineHeight: 22,
                }}
              >
                Join ScanTrace — AI-powered medical analytics
              </Text>

            </View>

            {/* FULL NAME */}
            <View style={{ marginBottom: 20 }}>
              <InputLabel label="Full Name" />
              <StyledInput
                value={name}
                onChangeText={setName}
                placeholder="Your full name"
                autoComplete="name"
                textContentType="name"
              />
            </View>

            {/* EMAIL */}
            <View style={{ marginBottom: 20 }}>
              <InputLabel label="Email Address" />
              <StyledInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="you@example.com"
                autoComplete="email"
                textContentType="emailAddress"
              />
            </View>

            {/* PASSWORD */}
            <View style={{ marginBottom: 20 }}>
              <InputLabel label="Password" />
              <View>
                <StyledInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  textContentType="newPassword"
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 16,
                    top: 0,
                    bottom: 0,
                    justifyContent: "center",
                    paddingHorizontal: 4,
                  }}
                >
                  <Text style={{ fontSize: 18, opacity: 0.7 }}>
                    {showPassword ? "🙈" : "👁️"}
                  </Text>
                </Pressable>
              </View>
              <PasswordStrength password={password} />
            </View>

            {/* CONFIRM PASSWORD */}
            <View style={{ marginBottom: 32 }}>
              <InputLabel label="Confirm Password" />
              <View>
                <StyledInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  textContentType="newPassword"
                />
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    right: 16,
                    top: 0,
                    bottom: 0,
                    justifyContent: "center",
                    paddingHorizontal: 4,
                  }}
                >
                  <Text style={{ fontSize: 18, opacity: 0.7 }}>
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </Text>
                </Pressable>
              </View>
              {/* Password match indicator */}
              {confirmPassword.length > 0 && (
                <Text
                  style={{
                    color:
                      password === confirmPassword ? "#22C55E" : "#EF4444",
                    fontSize: 12,
                    fontWeight: "600",
                    marginTop: 6,
                  }}
                >
                  {password === confirmPassword
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </Text>
              )}
            </View>

            {/* REGISTER BUTTON */}
            <Pressable
              onPress={handleRegister}
              disabled={loading}
              style={({ pressed }) => ({
                overflow: "hidden",
                borderRadius: 20,
                opacity: pressed || loading ? 0.85 : 1,
              })}
            >
              <LinearGradient
                colors={["#22C55E", "#2563EB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  paddingVertical: 18,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      fontWeight: "800",
                      letterSpacing: 0.5,
                    }}
                  >
                    Create Account
                  </Text>
                )}
              </LinearGradient>
            </Pressable>

            {/* LOGIN LINK */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 28,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#64748B",
                  fontSize: 15,
                }}
              >
                Already have an account?{" "}
              </Text>
              <Pressable
                onPress={() => router.replace("/(auth)/login")}
                hitSlop={8}
              >
                <Text
                  style={{
                    color: "#4ADE80",
                    fontSize: 15,
                    fontWeight: "700",
                  }}
                >
                  Sign In
                </Text>
              </Pressable>
            </View>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}