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

const biomarkers = [
  {
    name: "Glucose",
    value: "148 mg/dL",
    status: "High",
    color: "#EF4444",
  },
  {
    name: "Hemoglobin",
    value: "12.8 g/dL",
    status: "Moderate",
    color: "#F59E0B",
  },
  {
    name: "Cholesterol",
    value: "182 mg/dL",
    status: "Normal",
    color: "#22C55E",
  },
  {
    name: "Vitamin D",
    value: "36 ng/mL",
    status: "Improved",
    color: "#3B82F6",
  },
];

const aiInsights = [
  "Glucose levels show an 18% increase compared to previous records.",
  "AI predicts elevated diabetic risk if the current trend continues.",
  "Cardiovascular indicators remain stable across the last 6 months.",
  "Preventive monitoring recommended within the next 14 days.",
];

export default function ReportDetailScreen() {
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
          width: 320,
          height: 320,
          borderRadius: 999,
          backgroundColor: "rgba(59,130,246,0.10)",
        }}
      />

      <View
        style={{
          position: "absolute",
          bottom: -100,
          left: -80,
          width: 280,
          height: 280,
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
        {/* TOP HEADER */}
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
              Glucose Monitoring Report
            </Text>

            <Text
              style={{
                color: "#64748B",
                marginTop: 8,
                fontSize: 16,
              }}
            >
              AI-powered biomarker analysis and predictive insights.
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 14,
            }}
          >
            <Pressable>
              <LinearGradient
                colors={["#22C55E", "#2563EB"]}
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
                  Download PDF
                </Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              style={{
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 24,
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
                Share Report
              </Text>
            </Pressable>
          </View>
        </View>

        {/* SUMMARY CARDS */}
        <View
          style={{
            flexDirection: isDesktop ? "row" : "column",
            gap: 20,
            marginTop: 30,
          }}
        >
          {[
            {
              title: "AI Health Score",
              value: "82",
              color: "#22C55E",
            },
            {
              title: "Risk Level",
              value: "Moderate",
              color: "#F59E0B",
            },
            {
              title: "Anomaly Detection",
              value: "03",
              color: "#EF4444",
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

        {/* MAIN SECTION */}
        <View
          style={{
            flexDirection: isDesktop ? "row" : "column",
            gap: 24,
            marginTop: 32,
          }}
        >
          {/* BIOMARKERS */}
          <View
            style={{
              flex: 1.3,
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
                fontSize: 28,
                fontWeight: "800",
              }}
            >
              Biomarker Analysis
            </Text>

            <Text
              style={{
                color: "#64748B",
                marginTop: 8,
                lineHeight: 24,
              }}
            >
              AI-extracted clinical values from the uploaded report.
            </Text>

            <View
              style={{
                marginTop: 30,
                gap: 18,
              }}
            >
              {biomarkers.map((item, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: "#F8FAFC",
                    borderRadius: 24,
                    padding: 22,
                  }}
                >
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
                          fontSize: 18,
                          fontWeight: "800",
                        }}
                      >
                        {item.name}
                      </Text>

                      <Text
                        style={{
                          color: "#64748B",
                          marginTop: 8,
                        }}
                      >
                        {item.value}
                      </Text>
                    </View>

                    <View
                      style={{
                        backgroundColor: `${item.color}15`,
                        paddingHorizontal: 16,
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
                        {item.status}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* TREND GRAPH */}
            <View
              style={{
                marginTop: 36,
                backgroundColor: "#F8FAFC",
                borderRadius: 30,
                padding: 24,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#0F172A",
                    fontSize: 22,
                    fontWeight: "800",
                  }}
                >
                  Historical Trend
                </Text>

                <Text
                  style={{
                    color: "#22C55E",
                    fontWeight: "700",
                  }}
                >
                  +12%
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginTop: 40,
                  height: 220,
                }}
              >
                {[60, 80, 72, 96, 120, 150].map((item, index) => (
                  <LinearGradient
                    key={index}
                    colors={["#22C55E", "#2563EB"]}
                    style={{
                      width: 42,
                      height: item,
                      borderRadius: 999,
                    }}
                  />
                ))}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 18,
                }}
              >
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
                  .map((month) => (
                    <Text
                      key={month}
                      style={{
                        color: "#94A3B8",
                        fontWeight: "600",
                      }}
                    >
                      {month}
                    </Text>
                  ))}
              </View>
            </View>
          </View>

          {/* RIGHT PANEL */}
          <View
            style={{
              width: isDesktop ? 400 : "100%",
              gap: 24,
            }}
          >
            {/* AI INSIGHTS */}
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
                AI Insights
              </Text>

              <View
                style={{
                  marginTop: 24,
                  gap: 18,
                }}
              >
                {aiInsights.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.12)",
                      borderRadius: 20,
                      padding: 18,
                    }}
                  >
                    <Text
                      style={{
                        color: "rgba(255,255,255,0.92)",
                        lineHeight: 26,
                        fontWeight: "600",
                      }}
                    >
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            </LinearGradient>

            {/* RECOMMENDATIONS */}
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
                Recommendations
              </Text>

              <View
                style={{
                  marginTop: 24,
                  gap: 18,
                }}
              >
                {[
                  "Schedule glucose monitoring within 14 days.",
                  "Reduce sugar intake and improve hydration.",
                  "Consult physician if symptoms persist.",
                ].map((item, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: "#F8FAFC",
                      borderRadius: 22,
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

              <Pressable
                style={{
                  marginTop: 28,
                }}
              >
                <LinearGradient
                  colors={["#22C55E", "#2563EB"]}
                  style={{
                    paddingVertical: 18,
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
                    Compare Previous Reports
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}