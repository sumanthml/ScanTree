// frontend/components/floating/FloatingInsights.tsx

import { useState } from "react";

import {
  Dimensions,
  Pressable,
  Text,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const isDesktop = width > 900;

const insights = [
  {
    title: "Glucose Spike Detected",
    value: "+18%",
    color: "#EF4444",
  },
  {
    title: "Cardiovascular Risk",
    value: "Moderate",
    color: "#F59E0B",
  },
  {
    title: "Health Stability",
    value: "Stable",
    color: "#22C55E",
  },
];

export default function FloatingInsights() {
  const [expanded, setExpanded] = useState(true);

  if (!expanded) {
    return (
      <Pressable
        onPress={() => setExpanded(true)}
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          zIndex: 999,
        }}
      >
        <LinearGradient
          colors={["#22C55E", "#2563EB"]}
          style={{
            width: 72,
            height: 72,
            borderRadius: 999,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#2563EB",
            shadowOpacity: 0.25,
            shadowRadius: 18,
            elevation: 10,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 30,
              fontWeight: "800",
            }}
          >
            AI
          </Text>
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <View
      style={{
        position: "absolute",
        bottom: 24,
        right: 24,
        width: isDesktop ? 360 : width - 32,
        zIndex: 999,
      }}
    >
      <LinearGradient
        colors={["#0F172A", "#1E293B"]}
        style={{
          borderRadius: 34,
          padding: 24,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOpacity: 0.22,
          shadowRadius: 20,
          elevation: 14,
        }}
      >
        {/* BACKGROUND GLOW */}
        <View
          style={{
            position: "absolute",
            top: -80,
            right: -60,
            width: 180,
            height: 180,
            borderRadius: 999,
            backgroundColor: "rgba(34,197,94,0.12)",
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
                color: "white",
                fontSize: 24,
                fontWeight: "800",
              }}
            >
              AI Insights
            </Text>

            <Text
              style={{
                color: "rgba(255,255,255,0.68)",
                marginTop: 6,
                lineHeight: 22,
              }}
            >
              Real-time predictive health monitoring.
            </Text>
          </View>

          <Pressable
            onPress={() => setExpanded(false)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              backgroundColor: "rgba(255,255,255,0.08)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: "800",
              }}
            >
              ×
            </Text>
          </Pressable>
        </View>

        {/* HEALTH SCORE */}
        <LinearGradient
          colors={["#22C55E", "#2563EB"]}
          style={{
            marginTop: 24,
            borderRadius: 28,
            padding: 24,
          }}
        >
          <Text
            style={{
              color: "rgba(255,255,255,0.78)",
              fontWeight: "600",
            }}
          >
            AI Health Score
          </Text>

          <Text
            style={{
              color: "white",
              fontSize: 58,
              fontWeight: "800",
              marginTop: 12,
            }}
          >
            86
          </Text>

          <Text
            style={{
              color: "rgba(255,255,255,0.88)",
              marginTop: 10,
              lineHeight: 24,
            }}
          >
            Biomarker stability remains healthy with
            moderate glucose fluctuations detected.
          </Text>
        </LinearGradient>

        {/* INSIGHTS */}
        <View
          style={{
            marginTop: 24,
            gap: 16,
          }}
        >
          {insights.map((item, index) => (
            <View
              key={index}
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                borderRadius: 22,
                padding: 18,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    paddingRight: 12,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      fontWeight: "700",
                    }}
                  >
                    {item.title}
                  </Text>

                  <Text
                    style={{
                      color: "rgba(255,255,255,0.60)",
                      marginTop: 8,
                      lineHeight: 22,
                    }}
                  >
                    AI predictive analytics generated
                    updated clinical insight.
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: `${item.color}20`,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: 999,
                  }}
                >
                  <Text
                    style={{
                      color: item.color,
                      fontWeight: "800",
                    }}
                  >
                    {item.value}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ACTIONS */}
        <View
          style={{
            flexDirection: "row",
            gap: 14,
            marginTop: 26,
          }}
        >
          <Pressable
            style={{
              flex: 1,
            }}
          >
            <LinearGradient
              colors={["#22C55E", "#2563EB"]}
              style={{
                paddingVertical: 16,
                borderRadius: 18,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "800",
                }}
              >
                Open Insights
              </Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            style={{
              flex: 1,
              backgroundColor: "rgba(255,255,255,0.08)",
              borderRadius: 18,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "700",
              }}
            >
              Dismiss
            </Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}