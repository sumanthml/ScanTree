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

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import { LinearGradient } from "expo-linear-gradient";

import {
  resetPassword,
} from "@/services/auth";

export default function ResetPasswordScreen() {

  const { width } =
    useWindowDimensions();

  const isMobile =
    width < 768;

  /*
  =====================================
  ROUTE PARAMS
  =====================================
  */

  const params =
    useLocalSearchParams();

  const email =
    String(
      params.email || ""
    );

  /*
  =====================================
  STATES
  =====================================
  */

  const [otpCode,
    setOtpCode] =
    useState("");

  const [newPassword,
    setNewPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
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
  RESET PASSWORD
  =====================================
  */

  const handleResetPassword =
    async () => {

      setErrorMessage("");

      setSuccessMessage("");

      /*
      =========================
      VALIDATIONS
      =========================
      */

      if (!otpCode.trim()) {

        setErrorMessage(
          "OTP code is required"
        );

        return;
      }

      if (!newPassword.trim()) {

        setErrorMessage(
          "New password is required"
        );

        return;
      }

      if (
        newPassword.length < 6
      ) {

        setErrorMessage(
          "Password must be at least 6 characters"
        );

        return;
      }

      if (
        newPassword !==
        confirmPassword
      ) {

        setErrorMessage(
          "Passwords do not match"
        );

        return;
      }

      try {

        setLoading(true);

        const response =
          await resetPassword({

            email,

            otp_code:
              otpCode,

            new_password:
              newPassword,
          });

        console.log(
          "RESET SUCCESS:",
          response
        );

        setLoading(false);

        setSuccessMessage(
          "Password reset successful"
        );

        /*
        =========================
        REDIRECT LOGIN
        =========================
        */

        setTimeout(() => {

          router.replace(
            "/login"
          );

        }, 1200);

      } catch (error: any) {

        console.log(
          "RESET ERROR:",
          JSON.stringify(
            error?.response?.data,
            null,
            2
          )
        );

        setLoading(false);

        let message =
          "Password reset failed";

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
                  🔒
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
                Reset Password
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
                Enter OTP and create
                your new password.
              </Text>

            </View>

            {/* OTP */}

            <TextInput
              value={otpCode}
              onChangeText={
                setOtpCode
              }
              placeholder="Enter OTP"
              placeholderTextColor="#64748B"
              keyboardType="number-pad"
              maxLength={6}
              style={{
                backgroundColor:
                  "rgba(2,6,23,0.92)",

                color:
                  "#FFFFFF",

                marginTop: 34,

                paddingVertical: 18,

                paddingHorizontal: 20,

                borderRadius: 18,

                letterSpacing: 6,

                textAlign:
                  "center",
              }}
            />

            {/* NEW PASSWORD */}

            <TextInput
              value={newPassword}
              onChangeText={
                setNewPassword
              }
              placeholder="New Password"
              placeholderTextColor="#64748B"
              secureTextEntry
              style={{
                backgroundColor:
                  "rgba(2,6,23,0.92)",

                color:
                  "#FFFFFF",

                marginTop: 18,

                paddingVertical: 18,

                paddingHorizontal: 20,

                borderRadius: 18,
              }}
            />

            {/* CONFIRM PASSWORD */}

            <TextInput
              value={confirmPassword}
              onChangeText={
                setConfirmPassword
              }
              placeholder="Confirm Password"
              placeholderTextColor="#64748B"
              secureTextEntry
              style={{
                backgroundColor:
                  "rgba(2,6,23,0.92)",

                color:
                  "#FFFFFF",

                marginTop: 18,

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

            {/* BUTTON */}

            <Pressable
              disabled={loading}
              onPress={
                handleResetPassword
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
                    Reset Password
                  </Text>
                )}

              </LinearGradient>

            </Pressable>

          </View>

        </KeyboardAvoidingView>

      </SafeAreaView>

    </LinearGradient>
  );
}