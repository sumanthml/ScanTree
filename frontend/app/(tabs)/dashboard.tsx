// frontend/app/(tabs)/dashboard.tsx

import { LinearGradient } from "expo-linear-gradient";
import { router, usePathname } from "expo-router";

import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
} from "react-native";

const { width } = Dimensions.get("window");

const isDesktop =
  Platform.OS === "web" && width >= 1024;

const SIDEBAR_ITEMS = [
  {
    label: "Dashboard",
    icon: "🏠",
    route: "/dashboard",
  },

  {
    label: "Reports",
    icon: "📄",
    route: "/reports",
  },

  {
    label: "Upload",
    icon: "⬆️",
    route: "/upload",
  },

  {
    label: "Notifications",
    icon: "🔔",
    route: "/notifications",
  },

  {
    label: "Profile",
    icon: "👤",
    route: "/profile",
  },

  {
    label: "Share Access",
    icon: "🔗",
    route: "/access/share",
  },

  {
    label: "Add Family",
    icon: "👨‍👩‍👧",
    route: "/access/add-family",
  },
];

const METRICS = [
  {
    title: "Health Score",
    value: "86",
    sub: "/100",
    color: "#22C55E",
  },

  {
    title: "Latest Report",
    value: "12 May",
    sub: "AI Analysis Completed",
    color: "#2563EB",
  },

  {
    title: "Total Reports",
    value: "18",
    sub: "All Time",
    color: "#7C3AED",
  },
];

const REPORTS = [
  {
    date: "12 May 2026",
    title: "Comprehensive Blood Test",
    score: "86",
  },

  {
    date: "28 Apr 2026",
    title: "Lipid Profile",
    score: "78",
  },

  {
    date: "15 Apr 2026",
    title: "Diabetes Screening",
    score: "82",
  },
];

export default function DashboardScreen() {
  const pathname = usePathname();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F8FAFC",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: "row",
            padding: 18,
            gap: 18,
          }}
        >
          {/* SIDEBAR */}
          {isDesktop && (
            <View
              style={{
                width: 240,

                backgroundColor: "#FFFFFF",

                borderRadius: 26,

                borderWidth: 1,
                borderColor: "#E2E8F0",

                padding: 18,

                minHeight: "100%",
              }}
            >
              {/* LOGO */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,

                  marginBottom: 28,
                }}
              >
                <LinearGradient
                  colors={[
                    "#22C55E",
                    "#2563EB",
                  ]}
                  style={{
                    width: 48,
                    height: 48,

                    borderRadius: 14,

                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                    }}
                  >
                    ❤️
                  </Text>
                </LinearGradient>

                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "800",
                    color: "#0F172A",
                  }}
                >
                  ScanTrace
                </Text>
              </View>

              {/* NAV */}
              <View
                style={{
                  gap: 8,
                }}
              >
                {SIDEBAR_ITEMS.map(
                  (item, index) => {
                    const active =
                      pathname === item.route;

                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() =>
                          router.push(
                            item.route as any
                          )
                        }
                        style={{
                          height: 52,

                          borderRadius: 16,

                          flexDirection: "row",

                          alignItems: "center",

                          gap: 12,

                          paddingHorizontal: 16,

                          backgroundColor:
                            active
                              ? "#22C55E"
                              : "transparent",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 18,
                          }}
                        >
                          {item.icon}
                        </Text>

                        <Text
                          style={{
                            fontSize: 15,

                            fontWeight: "700",

                            color: active
                              ? "#FFFFFF"
                              : "#64748B",
                          }}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                )}
              </View>

              {/* SUPPORT */}
              <View
                style={{
                  marginTop: 34,

                  backgroundColor: "#F8FAFC",

                  borderRadius: 22,

                  padding: 18,

                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "800",
                    color: "#0F172A",
                  }}
                >
                  Need Help?
                </Text>

                <Text
                  style={{
                    marginTop: 8,

                    color: "#64748B",

                    lineHeight: 22,

                    fontSize: 14,
                  }}
                >
                  AI support is available 24/7.
                </Text>

                <TouchableOpacity
                  style={{
                    marginTop: 16,

                    height: 46,

                    borderRadius: 14,

                    backgroundColor:
                      "#22C55E",

                    justifyContent:
                      "center",

                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",

                      fontWeight: "700",

                      fontSize: 14,
                    }}
                  >
                    Contact Support
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* MAIN */}
          <View
            style={{
              flex: 1,
            }}
          >
            {/* TOPBAR */}
            <View
              style={{
                flexDirection: "row",

                justifyContent:
                  "space-between",

                alignItems: "center",

                marginBottom: 20,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 24,

                    fontWeight: "800",

                    color: "#0F172A",
                  }}
                >
                  Good Morning, Rahul
                </Text>

                <Text
                  style={{
                    marginTop: 6,

                    fontSize: 14,

                    color: "#64748B",
                  }}
                >
                  AI-powered health analytics
                  overview
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 46,
                    height: 46,

                    borderRadius: 14,

                    backgroundColor:
                      "#FFFFFF",

                    justifyContent:
                      "center",

                    alignItems: "center",

                    borderWidth: 1,
                    borderColor: "#E2E8F0",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                    }}
                  >
                    🔔
                  </Text>
                </TouchableOpacity>

                <LinearGradient
                  colors={[
                    "#22C55E",
                    "#2563EB",
                  ]}
                  style={{
                    width: 50,
                    height: 50,

                    borderRadius: 16,

                    justifyContent:
                      "center",

                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",

                      fontWeight: "800",

                      fontSize: 18,
                    }}
                  >
                    R
                  </Text>
                </LinearGradient>
              </View>
            </View>

            {/* METRIC GRID */}
            <View
              style={{
                flexDirection: "row",
                gap: 16,

                marginBottom: 16,
              }}
            >
              {METRICS.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flex: 1,

                    backgroundColor:
                      "#FFFFFF",

                    borderRadius: 24,

                    padding: 24,

                    borderWidth: 1,
                    borderColor: "#E2E8F0",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,

                      color: "#64748B",

                      fontWeight: "700",
                    }}
                  >
                    {item.title}
                  </Text>

                  <Text
                    style={{
                      marginTop: 18,

                      fontSize: 42,

                      fontWeight: "900",

                      color: "#0F172A",
                    }}
                  >
                    {item.value}
                  </Text>

                  <Text
                    style={{
                      marginTop: 8,

                      color: "#94A3B8",

                      fontSize: 15,
                    }}
                  >
                    {item.sub}
                  </Text>
                </View>
              ))}

              {/* INSIGHT CARD */}
              <LinearGradient
                colors={[
                  "#7C3AED",
                  "#2563EB",
                ]}
                style={{
                  width: 280,

                  borderRadius: 24,

                  padding: 24,
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",

                    fontSize: 22,

                    fontWeight: "900",

                    marginBottom: 18,
                  }}
                >
                  Key Changes
                </Text>

                {[
                  "Glucose ↑ 18%",
                  "Hemoglobin ↓ 6%",
                  "Cholesterol ↔",
                ].map((item, index) => (
                  <Text
                    key={index}
                    style={{
                      color: "#FFFFFF",

                      fontSize: 15,

                      marginBottom: 14,

                      fontWeight: "700",
                    }}
                  >
                    • {item}
                  </Text>
                ))}

                <TouchableOpacity
                  style={{
                    marginTop: 16,

                    height: 50,

                    borderRadius: 14,

                    backgroundColor:
                      "#FFFFFF",

                    justifyContent:
                      "center",

                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#2563EB",

                      fontWeight: "800",

                      fontSize: 15,
                    }}
                  >
                    View Full Report
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>

            {/* LOWER GRID */}
            <View
              style={{
                flexDirection: "row",
                gap: 16,
              }}
            >
              {/* TREND */}
              <View
                style={{
                  flex: 1,

                  backgroundColor:
                    "#FFFFFF",

                  borderRadius: 28,

                  padding: 24,

                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                }}
              >
                <Text
                  style={{
                    fontSize: 22,

                    fontWeight: "900",

                    color: "#0F172A",
                  }}
                >
                  Health Trend
                </Text>

                <View
                  style={{
                    flexDirection: "row",

                    alignItems: "flex-end",

                    justifyContent:
                      "space-between",

                    height: 260,

                    marginTop: 26,
                  }}
                >
                  {[30, 42, 38, 55, 65, 78].map(
                    (height, index) => (
                      <View
                        key={index}
                        style={{
                          alignItems: "center",
                        }}
                      >
                        <LinearGradient
                          colors={[
                            "#2563EB",
                            "#22C55E",
                          ]}
                          style={{
                            width: 42,

                            height:
                              height * 2,

                            borderRadius: 22,
                          }}
                        />

                        <Text
                          style={{
                            marginTop: 10,

                            color: "#94A3B8",

                            fontSize: 13,

                            fontWeight: "700",
                          }}
                        >
                          {
                            [
                              "Jan",
                              "Feb",
                              "Mar",
                              "Apr",
                              "May",
                              "Jun",
                            ][index]
                          }
                        </Text>
                      </View>
                    )
                  )}
                </View>
              </View>

              {/* REPORTS */}
              <View
                style={{
                  width: 390,

                  backgroundColor:
                    "#FFFFFF",

                  borderRadius: 28,

                  padding: 24,

                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                }}
              >
                <Text
                  style={{
                    fontSize: 22,

                    fontWeight: "900",

                    color: "#0F172A",

                    marginBottom: 20,
                  }}
                >
                  Recent Reports
                </Text>

                <View
                  style={{
                    gap: 14,
                  }}
                >
                  {REPORTS.map(
                    (report, index) => (
                      <TouchableOpacity
                        key={index}
                        style={{
                          backgroundColor:
                            "#F8FAFC",

                          borderRadius: 18,

                          padding: 18,

                          borderWidth: 1,
                          borderColor:
                            "#E2E8F0",
                        }}
                      >
                        <Text
                          style={{
                            color: "#94A3B8",

                            fontSize: 13,

                            marginBottom: 8,
                          }}
                        >
                          {report.date}
                        </Text>

                        <Text
                          style={{
                            fontSize: 18,

                            fontWeight: "800",

                            color: "#0F172A",
                          }}
                        >
                          {report.title}
                        </Text>

                        <View
                          style={{
                            marginTop: 14,

                            alignSelf:
                              "flex-start",

                            backgroundColor:
                              "#DCFCE7",

                            paddingHorizontal: 12,

                            paddingVertical: 6,

                            borderRadius: 999,
                          }}
                        >
                          <Text
                            style={{
                              color: "#22C55E",

                              fontWeight:
                                "800",

                              fontSize: 13,
                            }}
                          >
                            Score {report.score}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}