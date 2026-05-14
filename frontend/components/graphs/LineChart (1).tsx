// frontend/components/graphs/LineChart.tsx

import {
  Dimensions,
  Text,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const isDesktop = width > 900;

type LineChartProps = {
  title?: string;
  subtitle?: string;
  percentage?: string;
};

const graphData = [40, 68, 52, 92, 74, 120, 98];

export default function LineChart({
  title = "Biomarker Trend",
  subtitle = "AI-generated historical analytics",
  percentage = "+18%",
}: LineChartProps) {
  const maxValue = Math.max(...graphData);

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
          top: -60,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: 999,
          backgroundColor: "rgba(37,99,235,0.08)",
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
              "rgba(34,197,94,0.12)",
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 999,
          }}
        >
          <Text
            style={{
              color: "#22C55E",
              fontWeight: "800",
            }}
          >
            {percentage}
          </Text>
        </View>
      </View>

      {/* GRAPH AREA */}
      <View
        style={{
          marginTop: 42,
          height: 260,
          justifyContent: "flex-end",
        }}
      >
        {/* GRID */}
        {[1, 2, 3, 4].map((_, index) => (
          <View
            key={index}
            style={{
              position: "absolute",
              top: index * 60,
              width: "100%",
              height: 1,
              backgroundColor: "#E2E8F0",
            }}
          />
        ))}

        {/* LINE GRAPH */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          {graphData.map((value, index) => {
            const height =
              (value / maxValue) * 220;

            return (
              <View
                key={index}
                style={{
                  alignItems: "center",
                  flex: 1,
                }}
              >
                {/* LINE */}
                <LinearGradient
                  colors={["#22C55E", "#2563EB"]}
                  style={{
                    width: 22,
                    height,
                    borderRadius: 999,
                  }}
                />

                {/* DOT */}
                <View
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 999,
                    backgroundColor: "#2563EB",
                    marginTop: 12,
                  }}
                />
              </View>
            );
          })}
        </View>

        {/* MONTHS */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 18,
          }}
        >
          {[
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
          ].map((month) => (
            <Text
              key={month}
              style={{
                color: "#94A3B8",
                fontWeight: "700",
                flex: 1,
                textAlign: "center",
              }}
            >
              {month}
            </Text>
          ))}
        </View>
      </View>

      {/* FOOTER */}
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
            label: "Average",
            value: "86",
            color: "#22C55E",
          },
          {
            label: "Peak",
            value: "120",
            color: "#2563EB",
          },
          {
            label: "Risk",
            value: "Moderate",
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
                fontSize: 24,
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