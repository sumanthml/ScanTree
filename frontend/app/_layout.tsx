import {
  Stack,
  router,
} from "expo-router";

import {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  View,
  Platform,
  LogBox,
} from "react-native";

import { registerUnauthorizedHandler } from "@/services/api";
import AlertModal from "@/components/ui/AlertModal";


// Ignore React Native Web SVG unknown event handler property warnings
if (Platform.OS === "web") {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const msg = args[0];
    if (
      msg &&
      typeof msg === "string" &&
      (msg.includes("Unknown event handler property") ||
       msg.includes("onPressIn") ||
       msg.includes("onPressOut"))
    ) {
      return;
    }
    originalConsoleError(...args);
  };
} else {
  LogBox.ignoreLogs(["Unknown event handler property"]);
}

import {
  useAuthStore,
} from "@/store/authStore";

import {
  useProfileStore,
} from "@/store/profileStore";

/*
=====================================
ROOT LAYOUT

Responsibilities:
  1. Run restoreSession() once on mount
     so AsyncStorage → Zustand state is
     populated before any screen renders.
  2. Load active profile & fetch user profiles.
  3. Show a splash/loading screen while
     that happens.
  4. Render the <Stack> navigator.

Navigation decisions (login vs dashboard)
are made by app/index.tsx, NOT here.
This prevents double-restore race conditions.
=====================================
*/

export default function RootLayout() {

  const restoreSession =
    useAuthStore(
      (state) => state.restoreSession
    );

  const [
    ready,
    setReady,
  ] = useState(false);

  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    // Register the 401 handler so expired tokens auto-navigate to login
    registerUnauthorizedHandler(async () => {
      try {
        await logout();
      } catch {}
      router.replace("/(auth)/login");
    });
  }, []);

  useEffect(() => {

    async function boot() {

      try {

        console.log("APP BOOT START");

        await restoreSession();

        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated) {
          try {
            await useProfileStore.getState().loadStoredProfile();
            await useProfileStore.getState().fetchProfiles();
          } catch (profileError) {
            console.log("PROFILE BOOT ERROR:", profileError);
          }
        }

        console.log("APP BOOT COMPLETE");

      } catch (error) {

        console.log("APP BOOT ERROR:", error);

      } finally {

        setReady(true);

      }
    }

    boot();

  }, []);

  /*
  =====================================
  SPLASH WHILE RESTORING SESSION
  =====================================
  */

  if (!ready) {

    return (

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#020617",
        }}
      >

        <ActivityIndicator
          size="large"
          color="#3B82F6"
        />

      </View>

    );
  }

  /*
  =====================================
  SHELL — index.tsx handles routing
  =====================================
  */

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <AlertModal />
    </>
  );
}