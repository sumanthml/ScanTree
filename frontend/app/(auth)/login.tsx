import {
  useState,
  useRef,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  ActivityIndicator,
  Alert as RNAlert,
  Animated,
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

import { loginUser } from "@/services/auth";

import { useAuthStore } from "@/store/authStore";

import { useProfileStore } from "@/store/profileStore";

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
MAIN SCREEN
=====================================
*/

export default function LoginScreen() {

  /*
  =====================================
  STATE
  =====================================
  */

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Developer Options State
  const [tapCount, setTapCount] = useState(0);
  const [showDevOptions, setShowDevOptions] = useState(false);
  const [currentApiUrl, setCurrentApiUrl] = useState("https://scantree.onrender.com");
  const [newApiUrl, setNewApiUrl] = useState("");

  useEffect(() => {
    const loadUrl = async () => {
      const url = await AsyncStorage.getItem("backend_url");
      if (url) {
        setCurrentApiUrl(url);
        setNewApiUrl(url);
      } else {
        const defaultUrl = "https://scantree.onrender.com";
        setCurrentApiUrl(defaultUrl);
        setNewApiUrl(defaultUrl);
        await AsyncStorage.setItem("backend_url", defaultUrl);
      }
    };
    loadUrl();
  }, []);

  const handleLogoPress = () => {
    const nextCount = tapCount + 1;
    if (nextCount >= 5) {
      setTapCount(0);
      setShowDevOptions(true);
      Alert.alert("Developer Mode", "Backend URL Configuration opened.");
    } else {
      setTapCount(nextCount);
    }
  };

  const saveBackendUrl = async (url: string) => {
    let cleanUrl = url.trim();
    if (cleanUrl.endsWith("/")) {
      cleanUrl = cleanUrl.slice(0, -1);
    }
    await AsyncStorage.setItem("backend_url", cleanUrl);
    setCurrentApiUrl(cleanUrl);
    setNewApiUrl(cleanUrl);
  };

  const login = useAuthStore((state) => state.login);

  /*
  =====================================
  HANDLE LOGIN
  =====================================
  */

  const handleLogin = async () => {

    if (!email.trim() || !password.trim()) {
      Alert.alert("Validation Error", "Email and password are required.");
      return;
    }

    try {

      setLoading(true);

      const loginResponse = await loginUser({
        email: email.trim(),
        password,
      });

      const token = loginResponse.access_token;
      const user = loginResponse.user;

      if (!token) throw new Error("Access token missing");
      if (!user || !user.id) throw new Error("User data missing from login response");

      await login(token, {
        id: String(user.id),
        name: user.name || email.split("@")[0],
        email: user.email || email.trim(),
      });

      try {
        await useProfileStore.getState().fetchProfiles();
      } catch (profileError) {
        console.log("PROFILE LOAD ERROR:", profileError);
      }

      router.replace("/(tabs)/dashboard");

    } catch (error: any) {
      console.log("LOGIN ERROR:", error?.response?.data || error?.message);

      // Firebase REST API returns: { error: { message: "INVALID_LOGIN_CREDENTIALS" } }
      const firebaseCode: string =
        error?.response?.data?.error?.message ?? "";

      const friendlyMessage: Record<string, string> = {
        INVALID_LOGIN_CREDENTIALS:
          "Incorrect email or password. Please try again.",
        INVALID_PASSWORD:
          "Incorrect password. Please try again.",
        EMAIL_NOT_FOUND:
          "No account found with this email. Please register first.",
        USER_DISABLED:
          "This account has been disabled. Please contact support.",
        TOO_MANY_ATTEMPTS_TRY_LATER:
          "Too many failed attempts. Please wait a few minutes.",
        INVALID_EMAIL:
          "The email address is not valid.",
        USER_NOT_FOUND:
          "No account found with this email. Please register first.",
      };

      const message =
        friendlyMessage[firebaseCode] ||
        error?.response?.data?.detail ||
        (firebaseCode ? `Authentication error: ${firebaseCode}` : null) ||
        error?.message ||
        "Unable to login. Please try again.";

      Alert.alert("Login Failed", message);
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
              maxWidth: isDesktop ? 480 : 440,
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

            {/* BRAND HEADER */}
            <View style={{ marginBottom: 36 }}>

              {/* LOGO BADGE (TAPPING 5 TIMES OPENS DEV OPTIONS) */}
              <Pressable onPress={handleLogoPress}>
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
              </Pressable>

              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: isDesktop ? 38 : 32,
                  fontWeight: "800",
                  letterSpacing: -0.5,
                }}
              >
                Welcome back
              </Text>

              <Text
                style={{
                  color: "#64748B",
                  marginTop: 8,
                  fontSize: 15,
                  lineHeight: 22,
                }}
              >
                Sign in to your ScanTrace account
              </Text>

            </View>

            {/* DEVELOPER OPTIONS PANEL */}
            {showDevOptions && (
              <View
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.08)",
                  borderColor: "rgba(239, 68, 68, 0.25)",
                  borderWidth: 1,
                  borderRadius: 20,
                  padding: 16,
                  marginBottom: 24,
                }}
              >
                <Text style={{ color: "#EF4444", fontSize: 13, fontWeight: "800", marginBottom: 6 }}>
                  ⚙️ DEVELOPER OPTIONS
                </Text>
                <Text style={{ color: "#94A3B8", fontSize: 11, marginBottom: 12, lineHeight: 16 }}>
                  Active API Endpoint:{"\n"}{currentApiUrl}
                </Text>
                <TextInput
                  value={newApiUrl}
                  onChangeText={setNewApiUrl}
                  placeholder="https://your-backend.onrender.com"
                  placeholderTextColor="#475569"
                  autoCapitalize="none"
                  style={{
                    backgroundColor: "rgba(15,23,42,0.6)",
                    color: "white",
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.08)",
                    marginBottom: 12,
                  }}
                />
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Pressable
                    onPress={async () => {
                      if (newApiUrl.trim()) {
                        await saveBackendUrl(newApiUrl.trim());
                        Alert.alert("Success", "Backend API endpoint saved.");
                        setShowDevOptions(false);
                      }
                    }}
                    style={{
                      backgroundColor: "#22C55E",
                      borderRadius: 10,
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 12, fontWeight: "700" }}>Save</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setShowDevOptions(false)}
                    style={{
                      backgroundColor: "#475569",
                      borderRadius: 10,
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 12, fontWeight: "700" }}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            )}

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
            <View style={{ marginBottom: 12 }}>
              <InputLabel label="Password" />
              <View>
                <StyledInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  textContentType="password"
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
            </View>

            {/* FORGOT PASSWORD LINK */}
            <Pressable
              onPress={() => router.push("/(auth)/forgot-password")}
              style={{
                alignSelf: "flex-end",
                marginBottom: 28,
                paddingVertical: 4,
              }}
            >
              <Text
                style={{
                  color: "#4ADE80",
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                Forgot password?
              </Text>
            </Pressable>

            {/* LOGIN BUTTON */}
            <Pressable
              onPress={handleLogin}
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
                    Sign In
                  </Text>
                )}
              </LinearGradient>
            </Pressable>

            {/* DIVIDER */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 28,
              }}
            >
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: "rgba(255,255,255,0.07)",
                }}
              />
              <Text
                style={{
                  color: "#475569",
                  marginHorizontal: 12,
                  fontSize: 13,
                }}
              >
                Don't have an account?
              </Text>
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: "rgba(255,255,255,0.07)",
                }}
              />
            </View>

            {/* REGISTER BUTTON */}
            <Pressable
              onPress={() => router.push("/(auth)/register")}
              style={({ pressed }) => ({
                borderRadius: 20,
                borderWidth: 1.5,
                borderColor: "rgba(74,222,128,0.35)",
                paddingVertical: 16,
                alignItems: "center",
                backgroundColor: pressed
                  ? "rgba(74,222,128,0.08)"
                  : "transparent",
              })}
            >
              <Text
                style={{
                  color: "#4ADE80",
                  fontSize: 15,
                  fontWeight: "700",
                }}
              >
                Create Account
              </Text>
            </Pressable>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
