// frontend/components/layout/ScreenWrapper.tsx

import {
  Dimensions,
  ScrollView,
  StatusBar,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import React from "react";

const { width } = Dimensions.get("window");

const isDesktop = width > 900;

type ScreenWrapperProps = {
  children: React.ReactNode;
  scrollable?: boolean;
};

export default function ScreenWrapper({
  children,
  scrollable = true,
}: ScreenWrapperProps) {
  const content = (
    <View
      style={{
        flex: 1,
        position: "relative",
      }}
    >
      {/* TOP GRADIENT GLOW */}
      <View
        style={{
          position: "absolute",
          top: -120,
          right: -80,
          width: 320,
          height: 320,
          borderRadius: 999,
          backgroundColor: "rgba(37,99,235,0.10)",
        }}
      />

      {/* BOTTOM GRADIENT GLOW */}
      <View
        style={{
          position: "absolute",
          bottom: -120,
          left: -80,
          width: 280,
          height: 280,
          borderRadius: 999,
          backgroundColor: "rgba(34,197,94,0.10)",
        }}
      />

      {/* MAIN CONTENT */}
      <View
        style={{
          flex: 1,
          paddingHorizontal: isDesktop ? 30 : 18,
          paddingTop: isDesktop ? 28 : 18,
          paddingBottom: 120,
          zIndex: 2,
        }}
      >
        {children}
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={["#F8FAFB", "#EEF4FF"]}
      style={{
        flex: 1,
      }}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {scrollable ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </LinearGradient>
  );
}