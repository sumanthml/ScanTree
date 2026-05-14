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

const reports = [
  {
    title: "Complete Blood Count",
    date: "12 May 2026",
    hospital: "Apollo Hospitals",
    status: "Processed",
    severity: "Normal",
    color: "#22C55E",
  },
  {
    title: "Thyroid Function Test",
    date: "08 May 2026",
    hospital: "MedPlus Diagnostics",
    status: "AI Review",
    severity: "Moderate",
    color: "#F59E0B",
  },
  {
    title: "Glucose Monitoring Report",
    date: "03 May 2026",
    hospital: "Global Health Labs",
    status: "Critical Alert",
    severity: "High",
    color: "#EF4444",
  },
  {
    title: "Vitamin Deficiency Panel",
    date: "26 Apr 2026",
    hospital: "SRM Medical Center",
    status: "Processed",
    severity: "Improved",
    color: "#3B82F6",
  },
];

export default function ReportsScreen() {
  return (
    <LinearGradient
      colors={["#F8FAFB", "#EEF4FF"]}
      style={{
        flex: 1,
      }}
    >
      {/* Background Glow */}
      <View
        style={{
          position: "absolute",
          top: -120,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: 999,
          backgroundColor: "rgba(59,130,246,0.10)",
        }}
      />

      <View
        style={{
          position: "absolute",
          bottom: -100,
          left: -80,
          width: 260,
          height: 260,
          borderRadius: 999,
          backgroundColor: "rgba(34,197,94,0.10)",
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
              Medical Reports
            </Text>

            <Text
              style={{
                color: "#64748B",
                marginTop: 8,
                fontSize: 16,
              }}
            >
              AI-processed reports and clinical analytics history.
            </Text>
          </View>

          <Pressable>
            <LinearGradient
              colors={["#22C55E", "#2563EB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingHorizontal: 24,
                paddingVertical: 16,
                borderRadius: 18,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "800",
                }}
              >
                + Upload Report
              </Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* STATS */}
        <View
          style={{
            flexDirection: isDesktop ? "row" : "column",
            gap: 20,
            marginTop: 30,
          }}
        >
          {[
            {
              label: "Total Reports",
              value: "18",
              color: "#22C55E",
            },
            {
              label: "AI Insights",
              value: "124",
              color: "#2563EB",
            },
            {
              label: "Critical Alerts",
              value: "03",
              color: "#EF4444",
            },
          ].map((item, index) => (
            <View
              key={index}
              style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
                borderRadius: 28,
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
                {item.label}
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

        {/* SEARCH + FILTER */}
        <View
          style={{
            flexDirection: isDesktop ? "row" : "column",
            gap: 18,
            marginTop: 32,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#FFFFFF",
              borderRadius: 20,
              paddingHorizontal: 22,
              paddingVertical: 18,
              borderWidth: 1,
              borderColor: "#E2E8F0",
            }}
          >
            <Text
              style={{
                color: "#94A3B8",
                fontWeight: "600",
              }}
            >
              🔍 Search reports, biomarkers, hospitals...
            </Text>
          </View>

          <Pressable
            style={{
              backgroundColor: "#FFFFFF",
              paddingHorizontal: 24,
              paddingVertical: 18,
              borderRadius: 20,
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
              Filter Reports
            </Text>
          </Pressable>
        </View>

        {/* REPORTS LIST */}
        <View
          style={{
            marginTop: 32,
            gap: 22,
          }}
        >
          {reports.map((report, index) => (
            <View
              key={index}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 32,
                padding: 28,
                borderWidth: 1,
                borderColor: "#E2E8F0",
              }}
            >
              <View
                style={{
                  flexDirection: isDesktop ? "row" : "column",
                  justifyContent: "space-between",
                  gap: 20,
                }}
              >
                {/* LEFT */}
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <View
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 999,
                        backgroundColor: report.color,
                      }}
                    />

                    <Text
                      style={{
                        color: "#0F172A",
                        fontSize: 24,
                        fontWeight: "800",
                      }}
                    >
                      {report.title}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: isDesktop ? "row" : "column",
                      gap: 16,
                      marginTop: 18,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#F8FAFC",
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderRadius: 16,
                      }}
                    >
                      <Text
                        style={{
                          color: "#64748B",
                          fontWeight: "600",
                        }}
                      >
                        📅 {report.date}
                      </Text>
                    </View>

                    <View
                      style={{
                        backgroundColor: "#F8FAFC",
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderRadius: 16,
                      }}
                    >
                      <Text
                        style={{
                          color: "#64748B",
                          fontWeight: "600",
                        }}
                      >
                        🏥 {report.hospital}
                      </Text>
                    </View>
                  </View>

                  {/* AI SUMMARY */}
                  <View
                    style={{
                      marginTop: 24,
                      backgroundColor: "rgba(34,197,94,0.08)",
                      borderRadius: 22,
                      padding: 20,
                    }}
                  >
                    <Text
                      style={{
                        color: "#22C55E",
                        fontWeight: "800",
                        fontSize: 15,
                      }}
                    >
                      AI Summary
                    </Text>

                    <Text
                      style={{
                        color: "#475569",
                        marginTop: 10,
                        lineHeight: 26,
                      }}
                    >
                      AI detected moderate glucose fluctuations and
                      recommends preventive monitoring based on
                      historical biomarker trends.
                    </Text>
                  </View>
                </View>

                {/* RIGHT */}
                <View
                  style={{
                    width: isDesktop ? 280 : "100%",
                    justifyContent: "space-between",
                  }}
                >
                  {/* STATUS */}
                  <View
                    style={{
                      backgroundColor: `${report.color}15`,
                      paddingVertical: 14,
                      borderRadius: 18,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: report.color,
                        fontWeight: "800",
                        fontSize: 16,
                      }}
                    >
                      {report.status}
                    </Text>
                  </View>

                  {/* SEVERITY */}
                  <View
                    style={{
                      marginTop: 18,
                      backgroundColor: "#F8FAFC",
                      borderRadius: 20,
                      padding: 18,
                    }}
                  >
                    <Text
                      style={{
                        color: "#94A3B8",
                        fontWeight: "600",
                      }}
                    >
                      Severity Level
                    </Text>

                    <Text
                      style={{
                        color: report.color,
                        fontSize: 28,
                        fontWeight: "800",
                        marginTop: 12,
                      }}
                    >
                      {report.severity}
                    </Text>
                  </View>

                  {/* ACTIONS */}
                  <View
                    style={{
                      marginTop: 22,
                      gap: 14,
                    }}
                  >
                    <Pressable>
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
                          View Full Report
                        </Text>
                      </LinearGradient>
                    </Pressable>

                    <Pressable
                      style={{
                        backgroundColor: "#F8FAFC",
                        paddingVertical: 16,
                        borderRadius: 18,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "#0F172A",
                          fontWeight: "700",
                        }}
                      >
                        Share Report
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
