// frontend/app/access/share.tsx

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

const activeShares = [
  {
    name: "Dr. Meera Sharma",
    role: "Cardiologist",
    access: "Full Report Access",
    expires: "Expires in 7 days",
    color: "#22C55E",
  },
  {
    name: "Apollo Hospitals",
    role: "Medical Institution",
    access: "Temporary Analytics Access",
    expires: "Expires in 24 hours",
    color: "#2563EB",
  },
  {
    name: "Family Member",
    role: "Emergency Access",
    access: "Critical Reports Only",
    expires: "Permanent Access",
    color: "#F59E0B",
  },
];

export default function ShareScreen() {
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
          width: 320,
          height: 320,
          borderRadius: 999,
          backgroundColor: "rgba(59,130,246,0.10)",
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
              Secure Report Sharing
            </Text>

            <Text
              style={{
                color: "#64748B",
                marginTop: 8,
                fontSize: 16,
              }}
            >
              Share medical reports securely with doctors,
              hospitals and family members.
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
                + Generate Share Link
              </Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* TOP SECTION */}
        <View
          style={{
            flexDirection: isDesktop ? "row" : "column",
            gap: 24,
            marginTop: 32,
          }}
        >
          {/* QR SHARE */}
          <View
            style={{
              flex: 1,
              backgroundColor: "#FFFFFF",
              borderRadius: 34,
              padding: 30,
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
              QR Secure Access
            </Text>

            <Text
              style={{
                color: "#64748B",
                lineHeight: 26,
                marginTop: 12,
              }}
            >
              Generate encrypted QR access for hospitals,
              doctors or emergency use.
            </Text>

            {/* QR MOCK */}
            <View
              style={{
                marginTop: 34,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 240,
                  height: 240,
                  borderRadius: 30,
                  backgroundColor: "#F8FAFC",
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                }}
              >
                <View
                  style={{
                    width: 160,
                    height: 160,
                    backgroundColor: "#0F172A",
                    borderRadius: 16,
                  }}
                />

                <Text
                  style={{
                    color: "#64748B",
                    marginTop: 20,
                    fontWeight: "700",
                  }}
                >
                  Encrypted Medical QR
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 14,
                marginTop: 30,
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
                    paddingVertical: 18,
                    borderRadius: 20,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "800",
                    }}
                  >
                    Generate QR
                  </Text>
                </LinearGradient>
              </Pressable>

              <Pressable
                style={{
                  flex: 1,
                  backgroundColor: "#F8FAFC",
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#0F172A",
                    fontWeight: "700",
                  }}
                >
                  Download
                </Text>
              </Pressable>
            </View>
          </View>

          {/* SHARE CONTROLS */}
          <View
            style={{
              width: isDesktop ? 420 : "100%",
              gap: 24,
            }}
          >
            {/* ACCESS CONTROL */}
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
                Access Controls
              </Text>

              <View
                style={{
                  marginTop: 28,
                  gap: 18,
                }}
              >
                {[
                  "Full Medical Access",
                  "Temporary Report Access",
                  "Critical Reports Only",
                  "AI Insights Only",
                ].map((item, index) => (
                  <View
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
                      }}
                    >
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* AI SECURITY */}
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
                AI Security Layer
              </Text>

              <Text
                style={{
                  color: "rgba(255,255,255,0.88)",
                  lineHeight: 26,
                  marginTop: 16,
                }}
              >
                Every shared report is encrypted and monitored
                using AI-based access tracking.
              </Text>

              <View
                style={{
                  marginTop: 28,
                  gap: 18,
                }}
              >
                {[
                  "End-to-end encrypted access",
                  "Access expiration monitoring",
                  "AI anomaly detection enabled",
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
            </LinearGradient>
          </View>
        </View>

        {/* ACTIVE SHARES */}
        <View
          style={{
            marginTop: 34,
          }}
        >
          <Text
            style={{
              color: "#0F172A",
              fontSize: 32,
              fontWeight: "800",
            }}
          >
            Active Shares
          </Text>

          <View
            style={{
              marginTop: 26,
              gap: 22,
            }}
          >
            {activeShares.map((item, index) => (
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
                    flexDirection: isDesktop
                      ? "row"
                      : "column",
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
                        gap: 14,
                      }}
                    >
                      <View
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          backgroundColor: item.color,
                        }}
                      />

                      <Text
                        style={{
                          color: "#0F172A",
                          fontSize: 24,
                          fontWeight: "800",
                        }}
                      >
                        {item.name}
                      </Text>
                    </View>

                    <Text
                      style={{
                        color: "#64748B",
                        marginTop: 14,
                        fontSize: 16,
                      }}
                    >
                      {item.role}
                    </Text>

                    <View
                      style={{
                        marginTop: 20,
                        flexDirection: "row",
                        gap: 14,
                        flexWrap: "wrap",
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "#F8FAFC",
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 999,
                        }}
                      >
                        <Text
                          style={{
                            color: "#334155",
                            fontWeight: "700",
                          }}
                        >
                          {item.access}
                        </Text>
                      </View>

                      <View
                        style={{
                          backgroundColor:
                            `${item.color}15`,
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
                          {item.expires}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* RIGHT */}
                  <View
                    style={{
                      width: isDesktop ? 240 : "100%",
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
                          Manage Access
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
                          color: "#EF4444",
                          fontWeight: "800",
                        }}
                      >
                        Revoke Access
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}