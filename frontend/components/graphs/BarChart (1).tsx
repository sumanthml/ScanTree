// frontend/components/graphs/BarChart.tsx

import {
  Dimensions,
  Text,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const isDesktop = width > 900;

type BarChartProps = {
  title?: string;
  subtitle?: string;
};

const chartData = [
  {
    label: "Glucose",
    value: 88,
    color: ["#EF4444", "#DC2626"],
  },
  {
    label: "Hemoglobin",
    value: 62,
    color: ["#22C55E", "#16A34A"],
  },
  {
    label: "Cholesterol",
    value: 74,
    color: ["#2563EB", "#1D4ED8"],
  },
  {
    label: "Vitamin D",
    value: 52,
    color: ["#7C3AED", "#6D28D9"],
  },
];

export default function BarChart({
  title = "Biomarker Distribution",
  subtitle = "AI-based clinical parameter analytics",
}: BarChartProps) {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 34,
        padding: isDesktop ? 28 : 22,

        borderWidth: 1,
        borderColor: "#E2E8F0",

        overflow: "hidden",
      }}
    >
      {/* GLOW */}
      <View
        style={{
          position: "absolute",
          top: -70,
          right: -40,
          width: 180,
          height: 180,
          borderRadius: 999,
          backgroundColor: "rgba(124,58,237,0.08)",
        }}
      />

      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text
            style={{
              color: "#0F172A",
              fontSize: 24,
              fontWeight: "800",
            }}
          >
            {title}
          </Text>

          <Text
            style={{
              color: "#64748B",
              marginTop: 8,
              lineHeight: 22,
            }}
          >
            {subtitle}
          </Text>
        </View>

        <View
          style={{
            backgroundColor:
              "rgba(124,58,237,0.12)",
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 999,
          }}
        >
          <Text
            style={{
              color: "#7C3AED",
              fontWeight: "800",
            }}
          >
            LIVE AI
          </Text>
        </View>
      </View>

      {/* CHART */}
      <View
        style={{
          marginTop: 42,
        }}
      >
        {chartData.map((item, index) => (
          <View
            key={index}
            style={{
              marginBottom: 26,
            }}
          >
            {/* TOP */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  color: "#334155",
                  fontWeight: "700",
                  fontSize: 15,
                }}
              >
                {item.label}
              </Text>

              <Text
                style={{
                  color: "#0F172A",
                  fontWeight: "800",
                }}
              >
                {item.value}%
              </Text>
            </View>

            {/* TRACK */}
            <View
              style={{
                width: "100%",
                height: 18,
                backgroundColor: "#F1F5F9",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              {/* BAR */}
              <LinearGradient
                colors={
                  item.color as [string, string]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  width: `${item.value}%`,
                  height: "100%",
                  borderRadius: 999,
                }}
              />
            </View>
          </View>
        ))}
      </View>

      {/* INSIGHTS */}
      <View
        style={{
          marginTop: 18,
          gap: 16,
        }}
      >
        {[
          "Glucose levels exceed baseline thresholds.",
          "Hemoglobin remains within stable range.",
          "Vitamin D recovery trend improving steadily.",
        ].map((item, index) => (
          <View
            key={index}
            style={{
              backgroundColor: "#F8FAFC",
              borderRadius: 20,
              padding: 18,

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
                flex: 1,
                lineHeight: 22,
                fontWeight: "600",
              }}
            >
              {item}
            </Text>
          </View>
        ))}
      </View>

      {/* FOOTER METRICS */}
      <View
        style={{
          flexDirection: isDesktop
            ? "row"
            : "column",
          gap: 18,
          marginTop: 30,
        }}
      >
        {[
          {
            label: "Critical",
            value: "02",
            color: "#EF4444",
          },
          {
            label: "Stable",
            value: "08",
            color: "#22C55E",
          },
          {
            label: "Review",
            value: "03",
            color: "#F59E0B",
          },
        ].map((item, index) => (
          <View
            key={index}
            style={{
              flex: 1,
              backgroundColor: "#F8FAFC",
              borderRadius: 22,
              padding: 18,
            }}
          >
            <Text
              style={{
                color: "#64748B",
                fontWeight: "600",
              }}
            >
              {item.label}
            </Text>

            <Text
              style={{
                color: item.color,
                fontSize: 26,
                fontWeight: "800",
                marginTop: 12,
              }}
            >
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}