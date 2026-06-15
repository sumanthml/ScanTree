import { useEffect } from "react";

import {
  ActivityIndicator,
  View,
} from "react-native";

import {
  router,
} from "expo-router";

import {
  LinearGradient,
} from "expo-linear-gradient";

import {
  useAuthStore,
} from "@/store/authStore";

import {
  useProfileStore,
} from "@/store/profileStore";

/*
=====================================
INDEX — App entry point

_layout.tsx already called restoreSession()
and waited for it before rendering this screen.
So useAuthStore().isAuthenticated is already
correct by the time we get here.

We just read the state and route.
=====================================
*/

export default function IndexScreen() {

  useEffect(() => {

    const initializeApp =
      async () => {

        try {

          /*
          =========================
          READ RESTORED STATE
          (already hydrated by _layout.tsx)
          =========================
          */

          const {
            isAuthenticated,
          } = useAuthStore.getState();

          /*
          =========================
          AUTHENTICATED → load profiles
          then go to dashboard
          =========================
          */

          if (isAuthenticated) {

            try {

              await useProfileStore
                .getState()
                .loadStoredProfile();

              await useProfileStore
                .getState()
                .fetchProfiles();

            } catch (profileError) {

              console.log(
                "PROFILE LOAD ERROR:",
                profileError
              );

              // Don't block navigation on profile error
            }

            router.replace(
              "/(tabs)/dashboard"
            );

            return;
          }

          /*
          =========================
          GUEST → go to login
          =========================
          */

          router.replace(
            "/(auth)/login"
          );

        } catch (error) {

          console.log(
            "APP INIT ERROR:",
            error
          );

          router.replace(
            "/(auth)/login"
          );
        }
      };

    initializeApp();

  }, []);

  /*
  =====================================
  SPLASH SCREEN (shown briefly)
  =====================================
  */

  return (

    <LinearGradient
      colors={[
        "#020617",
        "#071226",
        "#0F172A",
      ]}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >

      <View
        style={{
          alignItems: "center",
        }}
      >

        <ActivityIndicator
          size="large"
          color="#4ADE80"
        />

      </View>

    </LinearGradient>
  );
}