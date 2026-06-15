import { ReactNode } from "react";
import {
  View,
  Platform,
  Dimensions,
  Pressable,
  Text,
  StyleSheet,
} from "react-native";
import { usePathname, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useProfileStore } from "@/store/profileStore";
import { LinearGradient } from "expo-linear-gradient";

import Sidebar from "@/components/navigation/Sidebar";
import BottomBar from "@/components/navigation/BottomBar";
import { useTheme } from "@/hooks/useTheme";
import { useResponsive } from "@/hooks/useResponsive";

interface Props {
  children: ReactNode;
}

function ProfileAvatar() {
  const { activeProfile } = useProfileStore();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  // ONLY render on native mobile app (iOS / Android)
  if (Platform.OS === "web") {
    return null;
  }

  // Hide the avatar if we are already on settings, profile, or access screens
  if (
    pathname === "/settings" ||
    pathname === "/profile" ||
    pathname.startsWith("/profile/") ||
    pathname === "/access" ||
    pathname.startsWith("/access/")
  ) {
    return null;
  }

  const initial = activeProfile?.full_name?.charAt(0)?.toUpperCase() || "U";

  return (
    <Pressable
      onPress={() => router.push("/settings")}
      style={[
        styles.avatarContainer,
        { top: Math.max(insets.top + 8, 20) }
      ]}
    >
      <LinearGradient
        colors={["rgba(99, 102, 241, 0.95)", "rgba(59, 130, 246, 0.95)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.avatarGradient}
      >
        <Text style={styles.avatarText}>{initial}</Text>
      </LinearGradient>
    </Pressable>
  );
}

export default function ResponsiveLayout({
  children,
}: Props) {
  const theme = useTheme();
  const { width } = useResponsive();
  
  const isDesktop = Platform.OS === "web" && width >= 1024;

  /*
  =====================================
  DESKTOP
  =====================================
  */

  if (isDesktop) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          backgroundColor:
            theme.background,
        }}
      >
        <Sidebar />
        <View
          style={{
            flex: 1,
            backgroundColor:
              theme.background,
          }}
        >
          {children}
        </View>
      </View>
    );
  }

  /*
  =====================================
  MOBILE
  =====================================
  */

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          theme.background,
      }}
    >
      {/* SCREEN */}
      <View
        style={{
          flex: 1,
          paddingBottom: 110,
          backgroundColor:
            theme.background,
        }}
      >
        {children}
      </View>

      {/* FLOATING PROFILE AVATAR */}
      <ProfileAvatar />

      {/* BOTTOM BAR */}
      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    position: "absolute",
    right: 20,
    zIndex: 9999,
  },
  avatarGradient: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
});