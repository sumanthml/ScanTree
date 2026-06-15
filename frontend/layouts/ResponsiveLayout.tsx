import {
  ReactNode,
} from "react";

import {
  View,
  Platform,
  Dimensions,
} from "react-native";

import Sidebar
from "@/components/navigation/Sidebar";

import BottomBar
from "@/components/navigation/BottomBar";

import {
  useTheme,
} from "@/hooks/useTheme";

import { useResponsive } from "@/hooks/useResponsive";

interface Props {
  children: ReactNode;
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

      {/* BOTTOM BAR */}

      <BottomBar />

    </View>
  );
}