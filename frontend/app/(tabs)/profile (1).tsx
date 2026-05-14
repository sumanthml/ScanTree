// frontend/app/(tabs)/profile.tsx

import {
  Dimensions,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";

import { useState } from "react";

import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const isDesktop = width > 900;

const medicalStats = [
  {
    title: "Reports Uploaded",
    value: "18",
    color: "#22C55E",
  },
  {
    title: "AI Insights",
    value: "124",
    color: "#2563EB",
  },
  {
    title: "Health Score",
    value: "86",
    color: "#7C3AED",
  },
];

const settings = [
  {
    title: "Biometric Authentication",
    description:
      "Enable Face ID / fingerprint authentication.",
  },
  {
    title: "Critical Health Alerts",
    description:
      "Receive AI anomaly and emergency notifications.",
  },
  {
    title: "Family Access Sharing",
    description:
      "Allow linked family members to access reports.",
  },
];

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);

  const [toggles, setToggles] = useState([
    true,
    true,
    false,
  ]);

  const updateToggle = (index: number) => {
    const updated = [...toggles];

    updated[index] = !updated[index];

    setToggles(updated);
  };

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
          top: -140,
          right: -100,
          width: 320,
          height: 320,
          borderRadius: 999,
          backgroundColor: "rgba(34,197,94,0.10)",
        }}
      />

      <View
        style={{
          position: "absolute",
          bottom: -120,
          left: -80,
          width: 260,
          height: 260,
          borderRadius: 999,
          backgroundColor: "rgba(59,130,246,0.10)",
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
              Profile & Settings
            </Text>

            <Text
              style={{
                color: "#64748B",
                marginTop: 8,
                fontSize: 16,
              }}
            >
              Personal health analytics and account controls.
            </Text>
          </View>

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
                Edit Profile
              </Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* USER CARD */}
        <LinearGradient
          colors={["#22C55E", "#2563EB"]}
          style={{
            marginTop: 30,
            borderRadius: 36,
            padding: 34,
          }}
        >
          <View
            style={{
              flexDirection: isDesktop ? "row" : "column",
              justifyContent: "space-between",
              gap: 28,
            }}
          >
            {/* LEFT */}
            <View
              style={{
                flexDirection: "row",
                gap: 24,
                flex: 1,
              }}
            >
              {/* AVATAR */}
              <View
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: 999,
                  backgroundColor: "rgba(255,255,255,0.18)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 42,
                    fontWeight: "800",
                  }}
                >
                  R
                </Text>
              </View>

              {/* DETAILS */}
              <View
                style={{
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 34,
                    fontWeight: "800",
                  }}
                >
                  Rahul Sharma
                </Text>

                <Text
                  style={{
                    color: "rgba(255,255,255,0.88)",
                    marginTop: 8,
                    fontSize: 16,
                  }}
                >
                  rahul.sharma@gmail.com
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    marginTop: 20,
                  }}
                >
                  <View
                    style={{
                      backgroundColor:
                        "rgba(255,255,255,0.18)",
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 999,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "800",
                      }}
                    >
                      Premium User
                    </Text>
                  </View>

                  <View
                    style={{
                      backgroundColor:
                        "rgba(255,255,255,0.18)",
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 999,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "800",
                      }}
                    >
                      AI Monitoring Active
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* RIGHT */}
            <View
              style={{
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "rgba(255,255,255,0.82)",
                  fontWeight: "600",
                }}
              >
                Last Report Upload
              </Text>

              <Text
                style={{
                  color: "white",
                  fontSize: 28,
                  fontWeight: "800",
                  marginTop: 10,
                }}
              >
                12 May 2026
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* STATS */}
        <View
          style={{
            flexDirection: isDesktop ? "row" : "column",
            gap: 20,
            marginTop: 30,
          }}
        >
          {medicalStats.map((item, index) => (
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

        {/* MAIN CONTENT */}
        <View
          style={{
            flexDirection: isDesktop ? "row" : "column",
            gap: 24,
            marginTop: 32,
          }}
        >
          {/* LEFT */}
          <View
            style={{
              flex: 1.2,
              gap: 24,
            }}
          >
            {/* ACCOUNT SETTINGS */}
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
                  fontSize: 28,
                  fontWeight: "800",
                }}
              >
                Account Settings
              </Text>

              <View
                style={{
                  marginTop: 28,
                  gap: 22,
                }}
              >
                {settings.map((item, index) => (
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
                        gap: 20,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                        }}
                      >
                        <Text
                          style={{
                            color: "#0F172A",
                            fontSize: 18,
                            fontWeight: "800",
                          }}
                        >
                          {item.title}
                        </Text>

                        <Text
                          style={{
                            color: "#64748B",
                            marginTop: 10,
                            lineHeight: 24,
                          }}
                        >
                          {item.description}
                        </Text>
                      </View>

                      <Switch
                        value={toggles[index]}
                        onValueChange={() =>
                          updateToggle(index)
                        }
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* SECURITY */}
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
                  fontSize: 28,
                  fontWeight: "800",
                }}
              >
                Security & Privacy
              </Text>

              <View
                style={{
                  marginTop: 28,
                  gap: 18,
                }}
              >
                {[
                  "Change Password",
                  "Manage Connected Devices",
                  "View Login Activity",
                  "Download Medical Data",
                ].map((item, index) => (
                  <Pressable
                    key={index}
                    style={{
                      backgroundColor: "#F8FAFC",
                      borderRadius: 22,
                      padding: 20,
                    }}
                  >
                    <Text
                      style={{
                        color: "#334155",
                        fontWeight: "700",
                        fontSize: 16,
                      }}
                    >
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          {/* RIGHT */}
          <View
            style={{
              width: isDesktop ? 400 : "100%",
              gap: 24,
            }}
          >
            {/* AI HEALTH STATUS */}
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
                AI Health Status
              </Text>

              <Text
                style={{
                  color: "rgba(255,255,255,0.88)",
                  lineHeight: 26,
                  marginTop: 16,
                }}
              >
                AI monitoring system continuously tracks
                biomarker changes and predictive anomalies.
              </Text>

              <View
                style={{
                  marginTop: 28,
                  gap: 18,
                }}
              >
                {[
                  "Health monitoring active",
                  "Predictive analytics enabled",
                  "Critical alerts configured",
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
                  Open Health Insights
                </Text>
              </Pressable>
            </LinearGradient>

            {/* APPEARANCE */}
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
                Appearance
              </Text>

              <View
                style={{
                  marginTop: 28,
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
                      Dark Mode
                    </Text>

                    <Text
                      style={{
                        color: "#64748B",
                        marginTop: 10,
                      }}
                    >
                      Switch between light and dark themes.
                    </Text>
                  </View>

                  <Switch
                    value={darkMode}
                    onValueChange={setDarkMode}
                  />
                </View>
              </View>
            </View>

            {/* LOGOUT */}
            <Pressable>
              <LinearGradient
                colors={["#EF4444", "#DC2626"]}
                style={{
                  paddingVertical: 20,
                  borderRadius: 24,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    fontWeight: "800",
                  }}
                >
                  Logout Account
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}