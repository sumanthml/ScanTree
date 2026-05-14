import { useState } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import { router } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";

import {
  forgotPassword,
} from "@/services/auth";

export default function ForgotPasswordScreen() {

  const { width } =
    useWindowDimensions();

  const isMobile =
    width < 768;

  /*
  =====================================
  STATES
  =====================================
  */

  const [email,
    setEmail] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const [errorMessage,
    setErrorMessage] =
    useState("");

  const [successMessage,
    setSuccessMessage] =
    useState("");

  /*
  =====================================
  FORGOT PASSWORD
  =====================================
  */

  const handleForgotPassword =
    async () => {

      setErrorMessage("");

      setSuccessMessage("");

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

      try {

        setLoading(true);

        const response =
          await forgotPassword({

            email:
              email.trim(),
          });

        console.log(
          "FORGOT PASSWORD:",
          response
        );

        setLoading(false);

        setSuccessMessage(
          "Reset OTP sent successfully"
        );

        /*
        =========================
        REDIRECT RESET PASSWORD
        =========================
        */

        setTimeout(() => {

          router.push({

            pathname:
              "/reset-password",

            params: {

              email:
                email.trim(),
            },
          });

        }, 1200);

      } catch (error: any) {

        console.log(
          "FORGOT PASSWORD ERROR:",
          JSON.stringify(
            error?.response?.data,
            null,
            2
          )
        );

        setLoading(false);

        let message =
          "Request failed";

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
        justifyContent:
          "center",
        alignItems:
          "center",
        padding: 20,
      }}
    >

      <SafeAreaView
        style={{
          width: "100%",
          maxWidth: 420,
        }}
      >

        <KeyboardAvoidingView
          behavior={
            Platform.OS === "ios"
              ? "padding"
              : undefined
          }
        >

          <View
            style={{
              backgroundColor:
                "rgba(15,23,42,0.9)",

              borderRadius: 30,

              padding:
                isMobile
                  ? 24
                  : 32,

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
                    fontSize: 34,
                  }}
                >
                  🔑
                </Text>

              </View>

              <Text
                style={{
                  color:
                    "#FFFFFF",

                  fontSize: 34,

                  fontWeight:
                    "800",

                  marginTop: 20,
                }}
              >
                Forgot Password
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
                Enter your email to
                receive password reset OTP.
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

                marginTop: 34,

                paddingVertical: 18,

                paddingHorizontal: 20,

                borderRadius: 18,
              }}
            />

            {/* ERROR */}

            {errorMessage ? (

              <View
                style={{
                  marginTop: 18,

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

                    textAlign:
                      "center",

                    fontWeight:
                      "600",
                  }}
                >
                  {errorMessage}
                </Text>

              </View>

            ) : null}

            {/* SUCCESS */}

            {successMessage ? (

              <View
                style={{
                  marginTop: 18,

                  backgroundColor:
                    "rgba(34,197,94,0.12)",

                  padding: 14,

                  borderRadius: 14,
                }}
              >

                <Text
                  style={{
                    color:
                      "#4ADE80",

                    textAlign:
                      "center",

                    fontWeight:
                      "600",
                  }}
                >
                  {successMessage}
                </Text>

              </View>

            ) : null}

            {/* SEND OTP BUTTON */}

            <Pressable
              disabled={loading}
              onPress={
                handleForgotPassword
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
                    Send Reset OTP
                  </Text>
                )}

              </LinearGradient>

            </Pressable>

            {/* LOGIN LINK */}

            <Pressable
              onPress={() =>
                router.replace(
                  "/login"
                )
              }
              style={{
                marginTop: 24,

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
                Back to{" "}

                <Text
                  style={{
                    color:
                      "#4ADE80",

                    fontWeight:
                      "700",
                  }}
                >
                  Login
                </Text>

              </Text>

            </Pressable>

          </View>

        </KeyboardAvoidingView>

      </SafeAreaView>

    </LinearGradient>
  );
}