import { useState } from "react";

import {
  ActivityIndicator,
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

import { router } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";

import { forgotPassword } from "@/services/auth";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const isDesktop = isWeb && SCREEN_WIDTH >= 1024;

/*
=====================================
STEP ENUM
=====================================
*/

type Step = "input" | "sent";

/*
=====================================
INPUT COMPONENT
=====================================
*/

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

export default function ForgotPasswordScreen() {

  /*
  =====================================
  STATE
  =====================================
  */

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("input");
  const [errorMessage, setErrorMessage] = useState("");

  /*
  =====================================
  HANDLE SEND RESET EMAIL
  =====================================
  */

  const handleSendReset = async () => {

    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {

      setLoading(true);

      await forgotPassword({ email: email.trim() });

      setStep("sent");

    } catch (error: any) {

      console.log("FORGOT PASSWORD ERROR:", error?.response?.data || error?.message);

      const detail = error?.response?.data?.error?.message || error?.response?.data?.detail;

      let message = "Failed to send reset email. Please try again.";

      if (typeof detail === "string") {
        if (detail.includes("EMAIL_NOT_FOUND") || detail.includes("INVALID_EMAIL")) {
          message = "No account found with this email address.";
        } else if (detail.includes("TOO_MANY_ATTEMPTS")) {
          message = "Too many attempts. Please try again later.";
        } else {
          message = detail;
        }
      } else if (error?.message) {
        message = error.message;
      }

      setErrorMessage(message);

    } finally {
      setLoading(false);
    }
  };

  /*
  =====================================
  UI — STEP: INPUT
  =====================================
  */

  if (step === "sent") {
    return (
      <LinearGradient
        colors={["#020617", "#071226", "#0D1B38"]}
        style={{ flex: 1 }}
      >
        <StatusBar barStyle="light-content" backgroundColor="#020617" />

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
            paddingVertical: 48,
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: isDesktop ? 480 : 440,
              backgroundColor: "rgba(255,255,255,0.04)",
              borderRadius: 32,
              padding: isDesktop ? 40 : 28,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.07)",
              alignItems: "center",
            }}
          >

            {/* SUCCESS ICON */}
            <View
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: "rgba(34,197,94,0.15)",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 28,
              }}
            >
              <Text style={{ fontSize: 44 }}>📬</Text>
            </View>

            <Text
              style={{
                color: "#F8FAFC",
                fontSize: 28,
                fontWeight: "800",
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              Check your inbox
            </Text>

            <Text
              style={{
                color: "#64748B",
                fontSize: 15,
                textAlign: "center",
                lineHeight: 24,
                marginBottom: 8,
              }}
            >
              We sent a password reset link to
            </Text>

            <Text
              style={{
                color: "#4ADE80",
                fontSize: 16,
                fontWeight: "700",
                textAlign: "center",
                marginBottom: 32,
              }}
            >
              {email}
            </Text>

            {/* STEPS INFO */}
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                borderRadius: 20,
                padding: 20,
                width: "100%",
                marginBottom: 32,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.06)",
              }}
            >
              {[
                { icon: "📧", text: "Open the email from ScanTrace" },
                { icon: "🔗", text: "Click the reset password link" },
                { icon: "🔒", text: "Create your new password" },
                { icon: "✅", text: "Sign in with your new password" },
              ].map((step, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: index < 3 ? 14 : 0,
                  }}
                >
                  <Text style={{ fontSize: 18, marginRight: 12 }}>
                    {step.icon}
                  </Text>
                  <Text
                    style={{
                      color: "#94A3B8",
                      fontSize: 14,
                      flex: 1,
                    }}
                  >
                    {step.text}
                  </Text>
                </View>
              ))}
            </View>

            {/* RESEND */}
            <Pressable
              onPress={() => setStep("input")}
              style={{ marginBottom: 20 }}
            >
              <Text
                style={{
                  color: "#64748B",
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                Didn't receive it?{" "}
                <Text
                  style={{
                    color: "#4ADE80",
                    fontWeight: "700",
                  }}
                >
                  Try again
                </Text>
              </Text>
            </Pressable>

            {/* BACK TO LOGIN */}
            <Pressable
              onPress={() => router.replace("/(auth)/login")}
              style={({ pressed }) => ({
                overflow: "hidden",
                borderRadius: 20,
                width: "100%",
                opacity: pressed ? 0.85 : 1,
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
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "800",
                    letterSpacing: 0.5,
                  }}
                >
                  Back to Sign In
                </Text>
              </LinearGradient>
            </Pressable>

          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  /*
  =====================================
  UI — STEP: SENT
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

            {/* BACK BUTTON */}
            <Pressable
              onPress={() => router.back()}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 28,
              }}
              hitSlop={8}
            >
              <Text
                style={{
                  color: "#4ADE80",
                  fontSize: 22,
                  marginRight: 4,
                  lineHeight: 26,
                }}
              >
                ←
              </Text>
              <Text
                style={{
                  color: "#4ADE80",
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                Back to Sign In
              </Text>
            </Pressable>

            {/* HEADER */}
            <View style={{ marginBottom: 32 }}>

              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  backgroundColor: "rgba(34,197,94,0.12)",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                  borderWidth: 1,
                  borderColor: "rgba(34,197,94,0.2)",
                }}
              >
                <Text style={{ fontSize: 30 }}>🔑</Text>
              </View>

              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: isDesktop ? 34 : 28,
                  fontWeight: "800",
                  letterSpacing: -0.5,
                  marginBottom: 10,
                }}
              >
                Forgot Password?
              </Text>

              <Text
                style={{
                  color: "#64748B",
                  fontSize: 15,
                  lineHeight: 23,
                }}
              >
                No worries — enter your email and we'll send you a secure reset link.
              </Text>

            </View>

            {/* EMAIL INPUT */}
            <View style={{ marginBottom: 20 }}>
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
                Email Address
              </Text>
              <StyledInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="you@example.com"
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="send"
                onSubmitEditing={handleSendReset}
              />
            </View>

            {/* ERROR MESSAGE */}
            {errorMessage ? (
              <View
                style={{
                  backgroundColor: "rgba(239,68,68,0.1)",
                  borderRadius: 14,
                  padding: 14,
                  marginBottom: 20,
                  borderWidth: 1,
                  borderColor: "rgba(239,68,68,0.2)",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 16, marginRight: 8 }}>⚠️</Text>
                <Text
                  style={{
                    color: "#FCA5A5",
                    fontSize: 14,
                    fontWeight: "600",
                    flex: 1,
                  }}
                >
                  {errorMessage}
                </Text>
              </View>
            ) : null}

            {/* SEND BUTTON */}
            <Pressable
              onPress={handleSendReset}
              disabled={loading}
              style={({ pressed }) => ({
                overflow: "hidden",
                borderRadius: 20,
                opacity: pressed || loading ? 0.85 : 1,
                marginBottom: 20,
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
                    Send Reset Link
                  </Text>
                )}
              </LinearGradient>
            </Pressable>

            {/* FOOTER NOTE */}
            <Text
              style={{
                color: "#475569",
                fontSize: 13,
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              Didn't receive the email? Check your spam folder or{" "}
              <Text
                style={{ color: "#64748B", fontWeight: "600" }}
                onPress={handleSendReset}
              >
                try again
              </Text>
              .
            </Text>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}