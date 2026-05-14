// frontend/app/(tabs)/notifications.tsx

import {
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const isDesktop = width > 900;

const notifications = [
  {
    type: "critical",
    title: "Critical Glucose Alert",
    description:
      "AI detected abnormal glucose fluctuations from your latest report.",
    time: "2 mins ago",
    color: "#EF4444",
  },
  {
    type: "report",
    title: "Report Processed Successfully",
    description:
      "Your Complete Blood Count report has finished AI analysis.",
    time: "18 mins ago",
    color: "#22C55E",
  },
  {
    type: "family",
    title: "Family Access Added",
    description:
      "Dr. Meera Sharma was granted temporary access to your report.",
    time: "1 hour ago",
    color: "#3B82F6",
  },
  {
    type: "insight",
    title: "New AI Recommendation",
    description:
      "AI suggests preventive monitoring within the next 14 days.",
    time: "3 hours ago",
    color: "#7C3AED",
  },
];

const quickActions = [
  "Critical Alerts",
  "AI Insights",
  "Shared Reports",
  "Health Changes",
];

export default function NotificationsScreen() {
  return (
    <LinearGradient
      colors={["#F8FAFB", "#EEF4FF"]}
      style={{
        flex: 1,
      }}
    >
      {/* BACKGROUND GLOW */}
      <View
        style={{
          position: "absolute",
          top: -120,
          right: -80,
          width: 300,
          height: 300,
          borderRadius: 999,
          backgroundColor: "rgba(239,68,68,0.08)",
        }}
      />

      <View
        style={{
          position: "absolute",
          bottom: -100,
          left: -100,
          width: 260,
          height: 260,
          borderRadius: 999,
          backgroundColor: "rgba(34,197,94,0.08)",
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: isDesktop ? 30 : 18,
          paddingBottom: 120,
        }}
      >
        {/* HEADER */}
        <View
          style={{
            flexDirection: isDesktop ? "row" : "column",
            justifyContent: "space-between",
            alignItems: isDesktop ? "center" : "flex-start",
            gap: 20,
          }}
        >
          <View>
            <Text
              style={{
                color: "#0F172A",
                fontSize: isDesktop ? 38 : 30,
                fontWeight: "800",
              }}
            >
              Notifications & Alerts
            </Text>

            <Text
              style={{
                color: "#64748B",
                marginTop: 8,
                fontSize: 16,
              }}
            >
              AI-generated medical alerts and system activity.
            </Text>
          </View>

          <Pressable
            style={{
              backgroundColor: "#FFFFFF",
              paddingHorizontal: 22,
              paddingVertical: 16,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: "#E2E8F0",
            }}
          >
            <Text
              style={{
                color: "#0F172A",
                fontWeight: "700",
              }}
            >
              Mark All as Read
            </Text>
          </Pressable>
        </View>

        {/* OVERVIEW CARDS */}
        <View
          style={{
            flexDirection: isDesktop ? "row" : "column",
            gap: 20,
            marginTop: 32,
          }}
        >
          {[
            {
              title: "Unread Alerts",
              value: "12",
              color: "#EF4444",
            },
            {
              title: "AI Recommendations",
              value: "08",
              color: "#7C3AED",
            },
            {
              title: "Processed Reports",
              value: "18",
              color: "#22C55E",
            },
          ].map((item, index) => (
            <View
              key={index}
              style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
                borderRadius: 30,
                padding: 24,
                borderWidth: 1,
                borderColor: "#E2E8F0",
              }}
            >
              <Text
                style={{
                  color: "#64748B",
                  fontWeight: "600",
                }}
              >
                {item.title}
              </Text>

              <Text
                style={{
                  color: item.color,
                  fontSize: 42,
                  fontWeight: "800",
                  marginTop: 18,
                }}
              >
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        {/* QUICK FILTERS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            marginTop: 30,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 14,
            }}
          >
            {quickActions.map((item, index) => (
              <Pressable
                key={index}
                style={{
                  backgroundColor:
                    index === 0 ? "#22C55E" : "#FFFFFF",
                  paddingHorizontal: 22,
                  paddingVertical: 14,
                  borderRadius: 999,
                  borderWidth:
                    index === 0 ? 0 : 1,
                  borderColor: "#E2E8F0",
                }}
              >
                <Text
                  style={{
                    color:
                      index === 0
                        ? "white"
                        : "#0F172A",
                    fontWeight: "700",
                  }}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* MAIN CONTENT */}
        <View
          style={{
            flexDirection: isDesktop ? "row" : "column",
            gap: 24,
            marginTop: 34,
          }}
        >
          {/* LEFT TIMELINE */}
          <View
            style={{
              flex: 1.3,
              gap: 22,
            }}
          >
            {notifications.map((item, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 32,
                  padding: 26,
                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 20,
                  }}
                >
                  {/* LEFT */}
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 18,
                      flex: 1,
                    }}
                  >
                    <View
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 999,
                        backgroundColor: item.color,
                        marginTop: 8,
                      }}
                    />

                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <Text
                        style={{
                          color: "#0F172A",
                          fontSize: 22,
                          fontWeight: "800",
                        }}
                      >
                        {item.title}
                      </Text>

                      <Text
                        style={{
                          color: "#64748B",
                          lineHeight: 26,
                          marginTop: 12,
                        }}
                      >
                        {item.description}
                      </Text>

                      <View
                        style={{
                          flexDirection: "row",
                          gap: 12,
                          marginTop: 18,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: `${item.color}15`,
                            paddingHorizontal: 14,
                            paddingVertical: 8,
                            borderRadius: 999,
                          }}
                        >
                          <Text
                            style={{
                              color: item.color,
                              fontWeight: "800",
                            }}
                          >
                            {item.type.toUpperCase()}
                          </Text>
                        </View>

                        <View
                          style={{
                            backgroundColor: "#F8FAFC",
                            paddingHorizontal: 14,
                            paddingVertical: 8,
                            borderRadius: 999,
                          }}
                        >
                          <Text
                            style={{
                              color: "#64748B",
                              fontWeight: "700",
                            }}
                          >
                            {item.time}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* RIGHT */}
                  <Pressable
                    style={{
                      alignSelf: "flex-start",
                    }}
                  >
                    <LinearGradient
                      colors={["#22C55E", "#2563EB"]}
                      style={{
                        paddingHorizontal: 18,
                        paddingVertical: 14,
                        borderRadius: 16,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "800",
                        }}
                      >
                        Open
                      </Text>
                    </LinearGradient>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>

          {/* RIGHT PANEL */}
          <View
            style={{
              width: isDesktop ? 380 : "100%",
              gap: 24,
            }}
          >
            {/* AI HEALTH MONITOR */}
            <LinearGradient
              colors={["#7C3AED", "#22C55E"]}
              style={{
                borderRadius: 34,
                padding: 28,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 28,
                  fontWeight: "800",
                }}
              >
                AI Health Monitor
              </Text>

              <Text
                style={{
                  color: "rgba(255,255,255,0.88)",
                  lineHeight: 26,
                  marginTop: 16,
                }}
              >
                Continuous AI monitoring detected elevated
                biomarker activity requiring preventive attention.
              </Text>

              <View
                style={{
                  marginTop: 28,
                  gap: 18,
                }}
              >
                {[
                  "Glucose fluctuation detected",
                  "Predictive diabetic risk increased",
                  "Lifestyle recommendation generated",
                ].map((item, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor:
                        "rgba(255,255,255,0.12)",
                      borderRadius: 18,
                      padding: 18,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        lineHeight: 24,
                        fontWeight: "600",
                      }}
                    >
                      • {item}
                    </Text>
                  </View>
                ))}
              </View>

              <Pressable
                style={{
                  marginTop: 28,
                  backgroundColor:
                    "rgba(255,255,255,0.18)",
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
                  Open AI Insights
                </Text>
              </Pressable>
            </LinearGradient>

            {/* RECENT SYSTEM ACTIVITY */}
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 34,
                padding: 28,
                borderWidth: 1,
                borderColor: "#E2E8F0",
              }}
            >
              <Text
                style={{
                  color: "#0F172A",
                  fontSize: 26,
                  fontWeight: "800",
                }}
              >
                System Activity
              </Text>

              <View
                style={{
                  marginTop: 26,
                  gap: 18,
                }}
              >
                {[
                  "AI finished processing CBC report",
                  "New family access granted",
                  "Medical report shared securely",
                  "Health trend updated",
                ].map((item, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: "#F8FAFC",
                      borderRadius: 20,
                      padding: 18,
                    }}
                  >
                    <Text
                      style={{
                        color: "#334155",
                        lineHeight: 24,
                        fontWeight: "600",
                      }}
                    >
                      • {item}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}