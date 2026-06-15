import {
  Tabs,
  router,
} from "expo-router";

import {
  useEffect,
} from "react";

import ResponsiveLayout
from "@/layouts/ResponsiveLayout";

import {
  useAuthStore,
} from "@/store/authStore";

export default function TabsLayout() {

  const {
    isAuthenticated,
  } = useAuthStore();

  useEffect(() => {

    if (!isAuthenticated) {

      router.replace(
        "/(auth)/login"
      );
    }

  }, [isAuthenticated]);

  return (

    <ResponsiveLayout>

      <Tabs

        screenOptions={{

          headerShown: false,

          tabBarStyle: {
            display: "none",
          },
        }}
      >

        <Tabs.Screen
          name="dashboard"
        />

        <Tabs.Screen
          name="reports"
        />

        <Tabs.Screen
          name="analytics"
        />

        <Tabs.Screen
          name="upload"
        />

        <Tabs.Screen
          name="notifications"
        />

        <Tabs.Screen
          name="access"
        />

        <Tabs.Screen
          name="profile"
        />

        <Tabs.Screen
          name="settings"
        />

      </Tabs>

    </ResponsiveLayout>
  );
}