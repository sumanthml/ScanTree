// frontend/components/ui/Card.tsx

import {
  Dimensions,
  View,
  ViewStyle,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import React from "react";

const { width } = Dimensions.get("window");

const isDesktop = width > 900;

type CardVariant =
  | "default"
  | "gradient"
  | "glass"
  | "dark";

type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  variant?: CardVariant;
};

export default function Card({
  children,
  style,
  padding,
  variant = "default",
}: CardProps) {
  const cardPadding = padding ?? (isDesktop ? 28 : 22);

  // DEFAULT WHITE CARD
  if (variant === "default") {
    return (
      <View
        style={[
          {
            backgroundColor: "#FFFFFF",
            borderRadius: 34,
            padding: cardPadding,

            borderWidth: 1,
            borderColor: "#E2E8F0",

            shadowColor: "#0F172A",
            shadowOpacity: 0.04,
            shadowRadius: 10,
            elevation: 3,

            overflow: "hidden",
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  // GLASS CARD
  if (variant === "glass") {
    return (
      <View
        style={[
          {
            backgroundColor: "rgba(255,255,255,0.70)",
            borderRadius: 34,
            padding: cardPadding,

            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.30)",

            shadowColor: "#0F172A",
            shadowOpacity: 0.06,
            shadowRadius: 14,
            elevation: 4,

            backdropFilter: "blur(12px)",

            overflow: "hidden",
          } as ViewStyle,
          style,
        ]}
      >
        {/* Glow */}
        <View
          style={{
            position: "absolute",
            top: -60,
            right: -40,
            width: 140,
            height: 140,
            borderRadius: 999,
            backgroundColor: "rgba(34,197,94,0.08)",
          }}
        />

        {children}
      </View>
    );
  }

  // DARK CARD
  if (variant === "dark") {
    return (
      <View
        style={[
          {
            backgroundColor: "#0F172A",
            borderRadius: 34,
            padding: cardPadding,

            shadowColor: "#000",
            shadowOpacity: 0.20,
            shadowRadius: 18,
            elevation: 10,

            overflow: "hidden",
          },
          style,
        ]}
      >
        {/* Glow */}
        <View
          style={{
            position: "absolute",
            top: -80,
            right: -60,
            width: 180,
            height: 180,
            borderRadius: 999,
            backgroundColor: "rgba(34,197,94,0.10)",
          }}
        />

        {children}
      </View>
    );
  }

  // GRADIENT CARD
  return (
    <LinearGradient
      colors={["#22C55E", "#2563EB"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        {
          borderRadius: 34,
          padding: cardPadding,

          shadowColor: "#2563EB",
          shadowOpacity: 0.18,
          shadowRadius: 16,
          elevation: 10,

          overflow: "hidden",
        },
        style,
      ]}
    >
      {/* Glow */}
      <View
        style={{
          position: "absolute",
          top: -80,
          right: -50,
          width: 180,
          height: 180,
          borderRadius: 999,
          backgroundColor: "rgba(255,255,255,0.12)",
        }}
      />

      {children}
    </LinearGradient>
  );
}