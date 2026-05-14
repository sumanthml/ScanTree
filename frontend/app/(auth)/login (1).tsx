import { useState } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import { router } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";

import {
  loginUser,
} from "@/services/auth";

import {
  useAuthStore,
} from "@/store/authStore";

export default function LoginScreen() {

  const { width } =
    useWindowDimensions();

  const isMobile =
    width < 768;

  const isDesktop =
    width >= 1200;

  /*
  =====================================
  STATES
  =====================================
  */

  const [email, setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const [errorMessage,
    setErrorMessage] =
    useState("");
  const { login } =
  useAuthStore();
  /*
  =====================================
  LOGIN HANDLER
  =====================================
  */

  const handleLogin =
    async () => {

      setErrorMessage("");

      /*
      =========================
      VALIDATIONS
      =========================
      */

      if (!email.trim()) {

        setErrorMessage(
          "Email is required"
        );

        return;
      }

      if (!password.trim()) {

        setErrorMessage(
          "Password is required"
        );

        return;
      }

      try {

        setLoading(true);

        const response =
          await loginUser({

            email:
              email.trim(),

            password,
          });

        console.log(
          "LOGIN SUCCESS:",
          response
        );

        setLoading(false);

       /*
=================================
STORE SESSION
=================================
*/

await login(

  response.access_token,

  response.user
);

/*
=================================
REDIRECT DASHBOARD
=================================
*/

router.replace(
  "/(tabs)/dashboard"
);
      } catch (error: any) {

        console.log(
          "LOGIN ERROR:",
          JSON.stringify(
            error?.response?.data,
            null,
            2
          )
        );

        setLoading(false);

        let message =
          "Login failed";

        const detail =
          error?.response?.data?.detail;

        /*
        =========================
        STRING ERROR
        =========================
        */

        if (
          typeof detail ===
          "string"
        ) {

          message =
            detail;
        }

        /*
        =========================
        VALIDATION ARRAY
        =========================
        */

        else if (
          Array.isArray(
            detail
          )
        ) {

          message =
            detail?.[0]?.msg ||
            "Validation failed";
        }

        /*
        =========================
        OBJECT ERROR
        =========================
        */

        else if (
          typeof detail ===
            "object" &&
          detail !== null
        ) {

          message =
            detail?.msg ||
            JSON.stringify(
              detail
            );
        }

        /*
        =========================
        NETWORK ERROR
        =========================
        */

        else if (
          error?.request
        ) {

          message =
            "Unable to connect to backend";
        }

        /*
        =========================
        AXIOS ERROR
        =========================
        */

        else if (
          error?.message
        ) {

          message =
            error.message;
        }

        setErrorMessage(
          String(message)
        );
      }
    };

  return (

    <LinearGradient
      colors={[
        "#020617",
        "#071226",
        "#0F172A",
      ]}
      style={{
        flex: 1,
      }}
    >

      {/* BACKGROUND */}

      <View
        style={{
          position: "absolute",
          top: -120,
          left: -120,
          width: 320,
          height: 320,
          borderRadius: 999,
          backgroundColor:
            "rgba(34,197,94,0.12)",
        }}
      />

      <View
        style={{
          position: "absolute",
          bottom: -140,
          right: -140,
          width: 340,
          height: 340,
          borderRadius: 999,
          backgroundColor:
            "rgba(59,130,246,0.12)",
        }}
      />

      <SafeAreaView
        style={{
          flex: 1,
        }}
      >

        <KeyboardAvoidingView
          behavior={
            Platform.OS ===
            "ios"
              ? "padding"
              : undefined
          }
          style={{
            flex: 1,
          }}
        >

          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent:
                "center",
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={
              false
            }
          >

            <View
              style={{
                flexDirection:
                  isDesktop
                    ? "row"
                    : "column",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                gap: 40,

                paddingHorizontal:
                  isMobile
                    ? 20
                    : 60,

                paddingVertical: 40,
              }}
            >

              {/* LEFT PANEL */}

              {isDesktop && (

                <View
                  style={{
                    flex: 1,
                    maxWidth: 620,
                  }}
                >

                  <View
                    style={{
                      backgroundColor:
                        "rgba(34,197,94,0.12)",

                      paddingHorizontal: 16,

                      paddingVertical: 8,

                      borderRadius: 999,

                      alignSelf:
                        "flex-start",
                    }}
                  >

                    <Text
                      style={{
                        color:
                          "#4ADE80",

                        fontWeight:
                          "700",

                        letterSpacing: 1,
                      }}
                    >
                      SCANTRACE AI
                    </Text>

                  </View>

                  <Text
                    style={{
                      color:
                        "#F8FAFC",

                      fontSize: 58,

                      fontWeight:
                        "800",

                      lineHeight: 72,

                      marginTop: 26,
                    }}
                  >
                    Welcome
                    {"\n"}
                    Back
                  </Text>

                  <Text
                    style={{
                      color:
                        "#94A3B8",

                      marginTop: 24,

                      fontSize: 20,

                      lineHeight: 36,

                      maxWidth: 620,
                    }}
                  >
                    Access your healthcare
                    analytics dashboard,
                    reports, biomarkers,
                    and AI medical insights.
                  </Text>

                </View>
              )}

              {/* RIGHT PANEL */}

              <View
                style={{
                  width: "100%",

                  maxWidth: 460,

                  backgroundColor:
                    "rgba(15,23,42,0.82)",

                  borderRadius: 32,

                  padding:
                    isMobile
                      ? 28
                      : 38,

                  borderWidth: 1,

                  borderColor:
                    "rgba(255,255,255,0.06)",
                }}
              >

                {/* HEADER */}

                <View
                  style={{
                    alignItems:
                      "center",

                    marginBottom: 34,
                  }}
                >

                  <View
                    style={{
                      width: 82,
                      height: 82,

                      borderRadius: 999,

                      justifyContent:
                        "center",

                      alignItems:
                        "center",

                      backgroundColor:
                        "rgba(34,197,94,0.12)",
                    }}
                  >

                    <Text
                      style={{
                        fontSize: 36,
                      }}
                    >
                      🔐
                    </Text>

                  </View>

                  <Text
                    style={{
                      color:
                        "#F8FAFC",

                      fontSize: 42,

                      fontWeight:
                        "800",

                      marginTop: 22,
                    }}
                  >
                    Login
                  </Text>

                  <Text
                    style={{
                      color:
                        "#94A3B8",

                      marginTop: 12,

                      textAlign:
                        "center",

                      lineHeight: 24,
                    }}
                  >
                    Login to your
                    ScanTrace account.
                  </Text>

                </View>

                {/* EMAIL */}

                <TextInput
                  value={email}
                  onChangeText={
                    setEmail
                  }
                  placeholder="Email Address"
                  placeholderTextColor="#64748B"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{
                    backgroundColor:
                      "rgba(2,6,23,0.92)",

                    color:
                      "#FFFFFF",

                    paddingHorizontal: 20,

                    paddingVertical: 18,

                    borderRadius: 18,

                    marginBottom: 18,
                  }}
                />

                {/* PASSWORD */}

                <TextInput
                  value={password}
                  onChangeText={
                    setPassword
                  }
                  placeholder="Password"
                  placeholderTextColor="#64748B"
                  secureTextEntry
                  style={{
                    backgroundColor:
                      "rgba(2,6,23,0.92)",

                    color:
                      "#FFFFFF",

                    paddingHorizontal: 20,

                    paddingVertical: 18,

                    borderRadius: 18,
                  }}
                />

                {/* FORGOT PASSWORD */}

                <Pressable
                  onPress={() =>
                    router.push(
                      "/forgot-password"
                    )
                  }
                  style={{
                    marginTop: 16,

                    alignSelf:
                      "flex-end",
                  }}
                >

                  <Text
                    style={{
                      color:
                        "#4ADE80",

                      fontWeight:
                        "600",
                    }}
                  >
                    Forgot Password?
                  </Text>

                </Pressable>

                {/* ERROR */}

                {errorMessage ? (

                  <View
                    style={{
                      marginTop: 20,

                      backgroundColor:
                        "rgba(239,68,68,0.12)",

                      padding: 14,

                      borderRadius: 14,
                    }}
                  >

                    <Text
                      style={{
                        color:
                          "#FCA5A5",

                        fontWeight:
                          "600",
                      }}
                    >
                      {errorMessage}
                    </Text>

                  </View>

                ) : null}

                {/* LOGIN BUTTON */}

                <Pressable
                  disabled={loading}
                  onPress={
                    handleLogin
                  }
                  style={{
                    marginTop: 30,

                    opacity:
                      loading
                        ? 0.7
                        : 1,
                  }}
                >

                  <LinearGradient
                    colors={[
                      "#5EC65B",
                      "#2F6FE4",
                    ]}
                    start={{
                      x: 0,
                      y: 0,
                    }}
                    end={{
                      x: 1,
                      y: 0,
                    }}
                    style={{
                      paddingVertical: 18,

                      borderRadius: 18,

                      alignItems:
                        "center",
                    }}
                  >

                    {loading ? (

                      <ActivityIndicator
                        color="#FFFFFF"
                      />

                    ) : (

                      <Text
                        style={{
                          color:
                            "#FFFFFF",

                          fontWeight:
                            "800",

                          fontSize: 16,
                        }}
                      >
                        Login
                      </Text>
                    )}

                  </LinearGradient>

                </Pressable>

                {/* REGISTER LINK */}

                <Pressable
                  onPress={() =>
                    router.push(
                      "/register"
                    )
                  }
                  style={{
                    marginTop: 28,

                    alignItems:
                      "center",
                  }}
                >

                  <Text
                    style={{
                      color:
                        "#94A3B8",
                    }}
                  >
                    Don’t have an account?{" "}

                    <Text
                      style={{
                        color:
                          "#4ADE80",

                        fontWeight:
                          "700",
                      }}
                    >
                      Register
                    </Text>

                  </Text>

                </Pressable>

              </View>

            </View>

          </ScrollView>

        </KeyboardAvoidingView>

      </SafeAreaView>

    </LinearGradient>
  );
}