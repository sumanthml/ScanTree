// frontend/components/ui/Badge.tsx

import {
  Text,
  View,
} from "react-native";

type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "premium";

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
  dot?: boolean;
};

export default function Badge({
  label,
  variant = "neutral",
  dot = true,
}: BadgeProps) {
  const getColors = () => {
    switch (variant) {
      case "success":
        return {
          bg: "rgba(34,197,94,0.12)",
          text: "#22C55E",
          dot: "#22C55E",
        };

      case "warning":
        return {
          bg: "rgba(245,158,11,0.12)",
          text: "#F59E0B",
          dot: "#F59E0B",
        };

      case "danger":
        return {
          bg: "rgba(239,68,68,0.12)",
          text: "#EF4444",
          dot: "#EF4444",
        };

      case "info":
        return {
          bg: "rgba(37,99,235,0.12)",
          text: "#2563EB",
          dot: "#2563EB",
        };

      case "premium":
        return {
          bg: "rgba(124,58,237,0.12)",
          text: "#7C3AED",
          dot: "#7C3AED",
        };

      default:
        return {
          bg: "#F1F5F9",
          text: "#475569",
          dot: "#64748B",
        };
    }
  };

  const colors = getColors();

  return (
    <View
      style={{
        alignSelf: "flex-start",

        flexDirection: "row",
        alignItems: "center",
        gap: 10,

        paddingHorizontal: 16,
        paddingVertical: 10,

        borderRadius: 999,

        backgroundColor: colors.bg,
      }}
    >
      {dot && (
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            backgroundColor: colors.dot,
          }}
        />
      )}

      <Text
        style={{
          color: colors.text,
          fontSize: 13,
          fontWeight: "800",
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Text>
    </View>
  );
}