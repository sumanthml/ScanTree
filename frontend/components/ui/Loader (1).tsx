// frontend/components/ui/Loader.tsx

import {
  ActivityIndicator,
  Dimensions,
  Text,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

type LoaderVariant =
  | "fullscreen"
  | "inline"
  | "card";

type LoaderProps = {
  title?: string;
  subtitle?: string;
  variant?: LoaderVariant;
};

export default function Loader({
  title = "AI Processing",
  subtitle = "Analyzing medical biomarkers and generating insights...",
  variant = "fullscreen",
}: LoaderProps) {
  // INLINE LOADER
  if (variant === "inline") {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
        }}
      >
        <ActivityIndicator
          size="small"
          color="#22C55E"
        />

        <Text
          style={{
            color: "#334155",
            fontWeight: "700",
          }}
        >
          {title}
        </Text>
      </View>
    );
  }

  // CARD LOADER
  if (variant === "card") {
    return (
      <LinearGradient
        colors={["#FFFFFF", "#F8FAFC"]}
        style={{
          borderRadius: 34,
          padding: 34,
          borderWidth: 1,
          borderColor: "#E2E8F0",
          alignItems: "center",
          overflow: "hidden",
        }}
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
            backgroundColor: "rgba(34,197,94,0.08)",
          }}
        />

        {/* Spinner */}
        <View
          style={{
            width: 92,
            height: 92,
            borderRadius: 999,
            backgroundColor: "rgba(34,197,94,0.10)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator
            size="large"
            color="#22C55E"
          />
        </View>

        <Text
          style={{
            color: "#0F172A",
            fontSize: 26,
            fontWeight: "800",
            marginTop: 28,
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            color: "#64748B",
            textAlign: "center",
            marginTop: 14,
            lineHeight: 26,
            maxWidth: 340,
          }}
        >
          {subtitle}
        </Text>

        {/* AI Steps */}
        <View
          style={{
            width: "100%",
            marginTop: 30,
            gap: 16,
          }}
        >
          {[
            "Extracting biomarkers",
            "Normalizing report values",
            "Generating AI insights",
          ].map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
              }}
            >
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 999,
                  backgroundColor: "#22C55E",
                }}
              />

              <Text
                style={{
                  color: "#475569",
                  fontWeight: "600",
                }}
              >
                {item}
              </Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    );
  }

  // FULLSCREEN LOADER
  return (
    <LinearGradient
      colors={["#0F172A", "#111827"]}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
      }}
    >
      {/* BACKGROUND GLOW */}
      <View
        style={{
          position: "absolute",
          top: -100,
          right: -80,
          width: 280,
          height: 280,
          borderRadius: 999,
          backgroundColor: "rgba(34,197,94,0.10)",
        }}
      />

      <View
        style={{
          position: "absolute",
          bottom: -120,
          left: -100,
          width: 260,
          height: 260,
          borderRadius: 999,
          backgroundColor: "rgba(37,99,235,0.10)",
        }}
      />

      {/* MAIN */}
      <View
        style={{
          alignItems: "center",
          width: width > 600 ? 480 : "100%",
        }}
      >
        {/* AI RING */}
        <LinearGradient
          colors={["#22C55E", "#2563EB"]}
          style={{
            width: 120,
            height: 120,
            borderRadius: 999,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 92,
              height: 92,
              borderRadius: 999,
              backgroundColor: "#0F172A",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator
              size="large"
              color="#22C55E"
            />
          </View>
        </LinearGradient>

        {/* TITLE */}
        <Text
          style={{
            color: "white",
            fontSize: 34,
            fontWeight: "800",
            marginTop: 34,
          }}
        >
          {title}
        </Text>

        {/* SUBTITLE */}
        <Text
          style={{
            color: "rgba(255,255,255,0.72)",
            textAlign: "center",
            lineHeight: 28,
            marginTop: 18,
            fontSize: 16,
          }}
        >
          {subtitle}
        </Text>

        {/* PROCESS STEPS */}
        <View
          style={{
            width: "100%",
            marginTop: 38,
            gap: 18,
          }}
        >
          {[
            "OCR Extraction Pipeline",
            "Biomarker Mapping Engine",
            "AI Predictive Analysis",
            "Clinical Insight Generation",
          ].map((item, index) => (
            <View
              key={index}
              style={{
                backgroundColor:
                  "rgba(255,255,255,0.06)",
                borderRadius: 22,
                padding: 20,

                flexDirection: "row",
                alignItems: "center",
                gap: 16,
              }}
            >
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  backgroundColor: "#22C55E",
                }}
              />

              <Text
                style={{
                  color: "white",
                  fontWeight: "700",
                  fontSize: 15,
                }}
              >
                {item}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
}