import { ReactNode, useState } from "react";
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
import { User, Users, Settings } from "lucide-react-native";

import Sidebar from "@/components/navigation/Sidebar";
import BottomBar from "@/components/navigation/BottomBar";
import { useTheme } from "@/hooks/useTheme";
import { useResponsive } from "@/hooks/useResponsive";

interface Props {
  children: ReactNode;
}

export default function ResponsiveLayout({
  children,
}: Props) {
  const theme = useTheme();
  const { width } = useResponsive();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { activeProfile } = useProfileStore();
  const [showMenu, setShowMenu] = useState(false);
  
  const isDesktop = Platform.OS === "web" && width >= 1024;
  const initial = activeProfile?.full_name?.charAt(0)?.toUpperCase() || "U";

  // Hide the avatar menu if we are already on sub-profile screens (like edit or create)
  const hideAvatar =
    pathname.startsWith("/profile/") ||
    pathname.startsWith("/access/");

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

      {/* FLOATING PROFILE AVATAR & DROPDOWN MENU */}
      {!hideAvatar && (
        <>
          <Pressable
            onPress={() => setShowMenu(!showMenu)}
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

          {showMenu && (
            <>
              {/* Backdrop */}
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={() => setShowMenu(false)}
              />

              {/* Dropdown Menu Card */}
              <LinearGradient
                colors={["#0f172a", "#090d16"]}
                style={[
                  styles.menuCard,
                  { top: Math.max(insets.top + 52, 64) }
                ]}
              >
                <Pressable
                  onPress={() => {
                    setShowMenu(false);
                    router.push("/profile");
                  }}
                  style={[
                    styles.menuItem,
                    pathname === "/profile" && styles.menuItemActive
                  ]}
                >
                  <User size={16} color="#818CF8" />
                  <Text style={styles.menuItemText}>Profile</Text>
                </Pressable>

                <View style={styles.menuDivider} />

                <Pressable
                  onPress={() => {
                    setShowMenu(false);
                    router.push("/access");
                  }}
                  style={[
                    styles.menuItem,
                    pathname === "/access" && styles.menuItemActive
                  ]}
                >
                  <Users size={16} color="#4ADE80" />
                  <Text style={styles.menuItemText}>Share & Access</Text>
                </Pressable>

                <View style={styles.menuDivider} />

                <Pressable
                  onPress={() => {
                    setShowMenu(false);
                    router.push("/settings");
                  }}
                  style={[
                    styles.menuItem,
                    pathname === "/settings" && styles.menuItemActive
                  ]}
                >
                  <Settings size={16} color="#3B82F6" />
                  <Text style={styles.menuItemText}>Settings</Text>
                </Pressable>
              </LinearGradient>
            </>
          )}
        </>
      )}

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
  menuCard: {
    position: "absolute",
    right: 20,
    width: 180,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    padding: 6,
    zIndex: 10000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  menuItemActive: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  menuItemText: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "600",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginHorizontal: 8,
  },
});