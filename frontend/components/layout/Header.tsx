// frontend/components/layout/Header.tsx

import {
  Dimensions,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const isDesktop = width > 900;

type HeaderProps = {
  title: string;
  subtitle?: string;
};

export default function Header({
  title,
  subtitle,
}: HeaderProps) {
  return (
    <View
      style={{
        width: "100%",
        marginBottom: 28,
      }}
    >
      <View
        style={{
          backgroundColor: "rgba(255,255,255,0.92)",
          borderRadius: 34,
          padding: isDesktop ? 26 : 20,
          borderWidth: 1,
          borderColor: "#E2E8F0",
          shadowColor: "#0F172A",
          shadowOpacity: 0.04,
          shadowRadius: 10,
          elevation: 3,
        }}
      >
        <View
          style={{
            flexDirection: isDesktop ? "row" : "column",
            justifyContent: "space-between",
            alignItems: isDesktop
              ? "center"
              : "flex-start",
            gap: 22,
          }}
        >
          {/* LEFT */}
          <View
            style={{
              flex: 1,
            }}
          >
            <Text
              style={{
                color: "#0F172A",
                fontSize: isDesktop ? 34 : 28,
                fontWeight: "800",
              }}
            >
              {title}
            </Text>

            {subtitle && (
              <Text
                style={{
                  color: "#64748B",
                  marginTop: 8,
                  fontSize: 15,
                  lineHeight: 24,
                }}
              >
                {subtitle}
              </Text>
            )}
          </View>

          {/* RIGHT */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
              width: isDesktop ? "auto" : "100%",
            }}
          >
            {/* SEARCH */}
            <View
              style={{
                flex: isDesktop ? 0 : 1,
                width: isDesktop ? 320 : "100%",
                backgroundColor: "#F8FAFC",
                borderRadius: 20,
                paddingHorizontal: 18,
                paddingVertical: 4,
                borderWidth: 1,
                borderColor: "#E2E8F0",
              }}
            >
              <TextInput
                placeholder="Search reports, biomarkers..."
                placeholderTextColor="#94A3B8"
                style={{
                  color: "#0F172A",
                  fontSize: 15,
                  fontWeight: "600",
                  height: 52,
                }}
              />
            </View>

            {/* NOTIFICATION */}
            <Pressable
              style={{
                width: 58,
                height: 58,
                borderRadius: 20,
                backgroundColor: "#FFFFFF",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#E2E8F0",
                position: "relative",
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                }}
              >
                🔔
              </Text>

              {/* BADGE */}
              <View
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  width: 12,
                  height: 12,
                  borderRadius: 999,
                  backgroundColor: "#EF4444",
                }}
              />
            </Pressable>

            {/* PROFILE */}
            <Pressable>
              <LinearGradient
                colors={["#22C55E", "#2563EB"]}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 22,
                }}
              >
                {/* AVATAR */}
                <View
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 999,
                    backgroundColor:
                      "rgba(255,255,255,0.18)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "800",
                      fontSize: 18,
                    }}
                  >
                    R
                  </Text>
                </View>

                {/* USER */}
                {isDesktop && (
                  <View>
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "800",
                        fontSize: 15,
                      }}
                    >
                      Rahul Sharma
                    </Text>

                    <Text
                      style={{
                        color:
                          "rgba(255,255,255,0.78)",
                        marginTop: 4,
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      Premium AI Monitoring
                    </Text>
                  </View>
                )}
              </LinearGradient>
            </Pressable>
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View
          style={{
            flexDirection: "row",
            gap: 14,
            marginTop: 24,
            flexWrap: "wrap",
          }}
        >
          {[
            "Upload Report",
            "AI Insights",
            "Critical Alerts",
            "Medical History",
          ].map((item, index) => (
            <Pressable
              key={index}
              style={{
                backgroundColor:
                  index === 0
                    ? "rgba(34,197,94,0.12)"
                    : "#F8FAFC",
                borderRadius: 999,
                paddingHorizontal: 18,
                paddingVertical: 12,
                borderWidth:
                  index === 0 ? 1 : 0,
                borderColor: "#22C55E",
              }}
            >
              <Text
                style={{
                  color:
                    index === 0
                      ? "#22C55E"
                      : "#334155",
                  fontWeight: "700",
                  fontSize: 14,
                }}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}