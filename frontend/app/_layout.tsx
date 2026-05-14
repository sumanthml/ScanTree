// frontend/app/_layout.tsx

import { Stack } from "expo-router";

import { StatusBar } from "expo-status-bar";

import { ThemeProvider } from "../theme/ThemeProvider";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,

          animation: "fade",

          contentStyle: {
            backgroundColor: "#F8FAFB",
          },
        }}
      >
        {/* AUTH */}
        <Stack.Screen
          name="(auth)"
        />

        {/* TABS */}
        <Stack.Screen
          name="(tabs)"
        />

        {/* REPORT */}
        <Stack.Screen
          name="report/[id]"
        />

        {/* ACCESS */}
        <Stack.Screen
          name="access/share"
        />

        <Stack.Screen
          name="access/add-family"
        />
      </Stack>
    </ThemeProvider>
  );
}