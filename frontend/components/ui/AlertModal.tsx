import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAlertStore } from "@/store/alertStore";
import AppText from "./AppText";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function AlertModal() {
  const { visible, title, message, buttons, hideAlert } = useAlertStore();

  if (!visible) return null;

  const handlePress = (onPress?: () => void) => {
    hideAlert();
    if (onPress) {
      // Small timeout to let modal close animation finish smoothly
      setTimeout(() => {
        onPress();
      }, 100);
    }
  };

  // If no buttons are provided, default to an "OK" button
  const displayButtons =
    buttons && buttons.length > 0
      ? buttons
      : [{ text: "OK", style: "default" as const }];

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={hideAlert}
    >
      <View style={styles.overlay}>
        {/* Backdrop dismiss for non-destructive alerts */}
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
          onPress={hideAlert}
        />

        {/* Modal Card */}
        <LinearGradient
          colors={["#0B1329", "#080E1E"]}
          style={styles.card}
        >
          <View style={styles.cardContent}>
            {title ? <AppText style={styles.title}>{title}</AppText> : null}
            {message ? <AppText style={styles.message}>{message}</AppText> : null}
          </View>

          {/* Buttons Layout */}
          <View
            style={[
              styles.buttonContainer,
              displayButtons.length > 2 ? styles.buttonContainerVertical : styles.buttonContainerHorizontal,
            ]}
          >
            {displayButtons.map((btn, index) => {
              const isDestructive = btn.style === "destructive";
              const isCancel = btn.style === "cancel";

              let btnBg = "rgba(255, 255, 255, 0.04)";
              let btnTextColor = "#F8FAFC";
              let btnBorderColor = "rgba(255, 255, 255, 0.06)";

              if (isDestructive) {
                btnBg = "rgba(239, 68, 68, 0.12)";
                btnTextColor = "#F87171";
                btnBorderColor = "rgba(239, 68, 68, 0.25)";
              } else if (isCancel) {
                btnBg = "transparent";
                btnTextColor = "#94A3B8";
                btnBorderColor = "rgba(255, 255, 255, 0.04)";
              } else {
                // Default / Primary button
                btnBg = "rgba(74, 222, 128, 0.12)";
                btnTextColor = "#4ADE80";
                btnBorderColor = "rgba(74, 222, 128, 0.25)";
              }

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    {
                      backgroundColor: btnBg,
                      borderColor: btnBorderColor,
                      flex: displayButtons.length > 2 ? undefined : 1,
                    },
                  ]}
                  onPress={() => handlePress(btn.onPress)}
                  activeOpacity={0.8}
                >
                  <AppText
                    style={[
                      styles.buttonText,
                      { color: btnTextColor, fontWeight: isCancel ? "500" : "700" },
                    ]}
                  >
                    {btn.text}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(2, 6, 23, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    ...Platform.select({
      web: {
        backdropFilter: "blur(12px)",
      },
    }),
  },
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 10,
  },
  cardContent: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#F8FAFC",
    textAlign: "center",
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 22,
  },
  buttonContainer: {
    gap: 10,
  },
  buttonContainerHorizontal: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonContainerVertical: {
    flexDirection: "column",
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 14,
  },
});
