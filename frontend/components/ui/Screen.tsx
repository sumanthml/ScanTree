import React from "react";
import {
  ScrollView,
  StyleSheet,
  ViewStyle,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { useResponsive } from "@/hooks/useResponsive";
import { LAYOUT } from "@/constants/layout";

interface Props {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
}

export default function Screen({
  children,
  scrollable = true,
  style,
}: Props) {
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    {
      backgroundColor: theme.background,
      paddingTop: isMobile ? insets.top : 0,
    },
    style,
  ];

  if (scrollable) {
    return (
      <View style={containerStyle}>
        <ScrollView
          contentContainerStyle={{
            padding: isMobile ? LAYOUT.mobilePadding : LAYOUT.screenPadding,
          }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      {children}
    </View>
  );
}

const styles =
  StyleSheet.create({

    container: {

      flex: 1,
    },
  });