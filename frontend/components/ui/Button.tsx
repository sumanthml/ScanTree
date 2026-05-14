// frontend/components/ui/Button.tsx

import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  icon?: string;
  fullWidth?: boolean;
};

export default function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  icon,
  fullWidth = true,
}: ButtonProps) {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isGhost = variant === "ghost";
  const isDanger = variant === "danger";

  const getContainerStyle = () => {
    if (isGhost) {
      return {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#CBD5E1",
      };
    }

    if (isSecondary) {
      return {
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
      };
    }

    return {};
  };

  const getTextColor = () => {
    if (isPrimary) return "white";

    if (isDanger) return "white";

    return "#0F172A";
  };

  const renderContent = () => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
      }}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {icon && (
            <Text
              style={{
                fontSize: 16,
              }}
            >
              {icon}
            </Text>
          )}

          <Text
            style={{
              color: getTextColor(),
              fontSize: 16,
              fontWeight: "800",
            }}
          >
            {title}
          </Text>
        </>
      )}
    </View>
  );

  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={{
        width: fullWidth ? "100%" : "auto",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {isPrimary ? (
        <LinearGradient
          colors={["#22C55E", "#2563EB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            paddingVertical: 18,
            paddingHorizontal: 24,
            borderRadius: 22,
            alignItems: "center",
            justifyContent: "center",

            shadowColor: "#2563EB",
            shadowOpacity: 0.18,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          {renderContent()}
        </LinearGradient>
      ) : isDanger ? (
        <LinearGradient
          colors={["#EF4444", "#DC2626"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            paddingVertical: 18,
            paddingHorizontal: 24,
            borderRadius: 22,
            alignItems: "center",
            justifyContent: "center",

            shadowColor: "#EF4444",
            shadowOpacity: 0.18,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          {renderContent()}
        </LinearGradient>
      ) : (
        <View
          style={{
            paddingVertical: 18,
            paddingHorizontal: 24,
            borderRadius: 22,
            alignItems: "center",
            justifyContent: "center",

            ...getContainerStyle(),
          }}
        >
          {renderContent()}
        </View>
      )}
    </Pressable>
  );
}