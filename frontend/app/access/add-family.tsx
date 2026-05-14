// frontend/app/access/add-family.tsx

import {
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const isDesktop = width > 900;

const familyMembers = [
  {
    name: "Anita Sharma",
    relation: "Mother",
    access: "Critical Reports",
    status: "Active",
    color: "#22C55E",
  },
  {
    name: "Dr. Raj Sharma",
    relation: "Family Doctor",
    access: "Full Analytics",
    status: "Verified",
    color: "#2563EB",
  },
  {
    name: "Karthik Sharma",
    relation: "Brother",
    access: "Emergency Access",
    status: "Pending",
    color: "#F59E0B",
  },
];

export default function AddFamilyScreen() {
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
              Family & Emergency Access
            </Text>

            <Text
              style={{
                color: "#64748B",
                marginTop: 8,
                fontSize: 16,
              }}
            >
              Securely manage medical access for trusted
              family members and healthcare professionals.
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
                + Invite Member
              </Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* MAIN SECTION */}
        <View
          style={{
            flexDirection: isDesktop ? "row" : "column",
            gap: 24,
            marginTop: 32,
          }}
        >
          {/* LEFT SIDE */}
          <View
            style={{
              flex: 1.2,
              gap: 24,
            }}
          >
            {/* INVITE CARD */}
            <View
              style={{
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
                Invite Family Member
              </Text>

              <Text
                style={{
                  color: "#64748B",
                  lineHeight: 26,
                  marginTop: 12,
                }}
              >
                Add trusted contacts with customizable
                medical access permissions.
              </Text>

              {/* FORM */}
              <View
                style={{
                  marginTop: 30,
                  gap: 20,
                }}
              >
                {[
                  "Full Name",
                  "Email Address",
                  "Relationship",
                ].map((item, index) => (
                  <View key={index}>
                    <Text
                      style={{
                        color: "#334155",
                        fontWeight: "700",
                        marginBottom: 10,
                      }}
                    >
                      {item}
                    </Text>

                    <TextInput
                      placeholder={`Enter ${item}`}
                      placeholderTextColor="#94A3B8"
                      style={{
                        backgroundColor: "#F8FAFC",
                        borderRadius: 20,
                        paddingHorizontal: 20,
                        paddingVertical: 18,
                        borderWidth: 1,
                        borderColor: "#E2E8F0",
                        color: "#0F172A",
                        fontSize: 16,
                      }}
                    />
                  </View>
                ))}
              </View>

              {/* ACCESS TYPES */}
              <View
                style={{
                  marginTop: 30,
                }}
              >
                <Text
                  style={{
                    color: "#334155",
                    fontWeight: "700",
                    marginBottom: 18,
                  }}
                >
                  Access Permission
                </Text>

                <View
                  style={{
                    gap: 14,
                  }}
                >
                  {[
                    "Critical Reports Only",
                    "Full Medical Analytics",
                    "Emergency Access",
                    "Temporary Viewing Access",
                  ].map((item, index) => (
                    <Pressable
                      key={index}
                      style={{
                        backgroundColor:
                          index === 0
                            ? "rgba(34,197,94,0.12)"
                            : "#F8FAFC",
                        borderRadius: 18,
                        padding: 18,
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
                        }}
                      >
                        {item}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* BUTTON */}
              <Pressable
                style={{
                  marginTop: 32,
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
                      fontSize: 16,
                    }}
                  >
                    Send Secure Invitation
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>

            {/* SECURITY */}
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
                AI Security Monitoring
              </Text>

              <Text
                style={{
                  color: "rgba(255,255,255,0.88)",
                  lineHeight: 26,
                  marginTop: 16,
                }}
              >
                AI continuously monitors access activity and
                detects abnormal sharing behavior.
              </Text>

              <View
                style={{
                  marginTop: 28,
                  gap: 18,
                }}
              >
                {[
                  "Encrypted medical access",
                  "AI anomaly detection active",
                  "Access expiration tracking",
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

          {/* RIGHT SIDE */}
          <View
            style={{
              width: isDesktop ? 420 : "100%",
              gap: 24,
            }}
          >
            {/* ACTIVE MEMBERS */}
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
                Connected Members
              </Text>

              <View
                style={{
                  marginTop: 28,
                  gap: 20,
                }}
              >
                {familyMembers.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: "#F8FAFC",
                      borderRadius: 26,
                      padding: 22,
                    }}
                  >
                    {/* TOP */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 14,
                          alignItems: "center",
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
                            fontSize: 20,
                            fontWeight: "800",
                          }}
                        >
                          {item.name}
                        </Text>
                      </View>

                      <View
                        style={{
                          backgroundColor:
                            `${item.color}15`,
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
                          {item.status}
                        </Text>
                      </View>
                    </View>

                    {/* DETAILS */}
                    <View
                      style={{
                        marginTop: 18,
                        gap: 12,
                      }}
                    >
                      <Text
                        style={{
                          color: "#64748B",
                          fontWeight: "600",
                        }}
                      >
                        👤 {item.relation}
                      </Text>

                      <Text
                        style={{
                          color: "#334155",
                          fontWeight: "700",
                        }}
                      >
                        🔐 {item.access}
                      </Text>
                    </View>

                    {/* ACTIONS */}
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 14,
                        marginTop: 22,
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
                            paddingVertical: 14,
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
                            Manage
                          </Text>
                        </LinearGradient>
                      </Pressable>

                      <Pressable
                        style={{
                          flex: 1,
                          backgroundColor: "#FFFFFF",
                          borderRadius: 18,
                          justifyContent: "center",
                          alignItems: "center",
                          borderWidth: 1,
                          borderColor: "#E2E8F0",
                        }}
                      >
                        <Text
                          style={{
                            color: "#EF4444",
                            fontWeight: "800",
                          }}
                        >
                          Remove
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* ACCESS OVERVIEW */}
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
                Access Overview
              </Text>

              <View
                style={{
                  marginTop: 28,
                  gap: 18,
                }}
              >
                {[
                  "3 Active Family Connections",
                  "2 Verified Medical Professionals",
                  "1 Pending Invitation",
                  "AI Monitoring Enabled",
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