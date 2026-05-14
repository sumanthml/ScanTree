// frontend/app/(tabs)/upload.tsx

import { useState } from "react";

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

const processingSteps = [
  "Extracting biomarkers",
  "Reading values",
  "Comparing history",
  "Generating AI insights",
];

const recentUploads = [
  {
    file: "blood_report_may.pdf",
    status: "Processed",
    severity: "Normal",
    color: "#22C55E",
  },
  {
    file: "cbc_scan_april.jpg",
    status: "AI Reviewing",
    severity: "Moderate",
    color: "#F59E0B",
  },
  {
    file: "thyroid_report.pdf",
    status: "Critical",
    severity: "Attention",
    color: "#EF4444",
  },
];

export default function UploadScreen() {
  const [uploadState, setUploadState] = useState<
    "idle" | "uploading" | "processing" | "success"
  >("idle");

  const handleUpload = () => {
    setUploadState("uploading");

    setTimeout(() => {
      setUploadState("processing");

      setTimeout(() => {
        setUploadState("success");
      }, 3000);
    }, 2000);
  };

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
          top: -140,
          right: -80,
          width: 320,
          height: 320,
          borderRadius: 999,
          backgroundColor: "rgba(37,99,235,0.10)",
        }}
      />

      <View
        style={{
          position: "absolute",
          bottom: -100,
          left: -100,
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
        {/* HEADER */}
        <View
          style={{
            marginBottom: 30,
          }}
        >
          <Text
            style={{
              fontSize: isDesktop ? 38 : 30,
              fontWeight: "800",
              color: "#0F172A",
            }}
          >
            Upload Medical Report
          </Text>

          <Text
            style={{
              color: "#64748B",
              marginTop: 8,
              fontSize: 16,
            }}
          >
            AI-powered medical extraction and analytics pipeline.
          </Text>
        </View>

        <View
          style={{
            flexDirection: isDesktop ? "row" : "column",
            gap: 24,
          }}
        >
          {/* LEFT MAIN */}
          <View
            style={{
              flex: 1.4,
              gap: 24,
            }}
          >
            {/* MAIN UPLOAD CARD */}
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 36,
                padding: 32,
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
                Upload Report
              </Text>

              <Text
                style={{
                  color: "#64748B",
                  marginTop: 8,
                  lineHeight: 24,
                }}
              >
                Upload your blood report, diagnostic scan,
                or medical PDF for AI analysis.
              </Text>

              {/* DROPZONE */}
              <LinearGradient
                colors={["#F8FAFC", "#EFF6FF"]}
                style={{
                  marginTop: 30,
                  borderRadius: 30,
                  padding: 50,
                  borderWidth: 2,
                  borderStyle: "dashed",
                  borderColor: "#22C55E",
                  alignItems: "center",
                }}
              >
                {/* ICON */}
                <View
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 999,
                    backgroundColor: "rgba(34,197,94,0.12)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 40,
                    }}
                  >
                    ⬆
                  </Text>
                </View>

                <Text
                  style={{
                    color: "#0F172A",
                    fontSize: 24,
                    fontWeight: "800",
                    marginTop: 24,
                  }}
                >
                  Drag & Drop Report
                </Text>

                <Text
                  style={{
                    color: "#64748B",
                    marginTop: 10,
                    textAlign: "center",
                    lineHeight: 24,
                    maxWidth: 420,
                  }}
                >
                  Supports PDF, JPG, PNG and diagnostic images.
                  AI automatically extracts biomarkers and
                  generates insights.
                </Text>

                <Pressable
                  onPress={handleUpload}
                  style={{
                    marginTop: 28,
                    width: 220,
                  }}
                >
                  <LinearGradient
                    colors={["#22C55E", "#2563EB"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
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
                      Upload Report
                    </Text>
                  </LinearGradient>
                </Pressable>
              </LinearGradient>

              {/* STATUS */}
              <View
                style={{
                  marginTop: 32,
                  backgroundColor: "#F8FAFC",
                  borderRadius: 24,
                  padding: 24,
                }}
              >
                <Text
                  style={{
                    color: "#0F172A",
                    fontSize: 20,
                    fontWeight: "800",
                  }}
                >
                  Processing Status
                </Text>

                {/* IDLE */}
                {uploadState === "idle" && (
                  <Text
                    style={{
                      color: "#64748B",
                      marginTop: 18,
                    }}
                  >
                    Waiting for upload...
                  </Text>
                )}

                {/* UPLOADING */}
                {uploadState === "uploading" && (
                  <>
                    <Text
                      style={{
                        color: "#2563EB",
                        marginTop: 18,
                        fontWeight: "700",
                      }}
                    >
                      Uploading Report...
                    </Text>

                    <View
                      style={{
                        marginTop: 20,
                        height: 14,
                        backgroundColor: "#E2E8F0",
                        borderRadius: 999,
                        overflow: "hidden",
                      }}
                    >
                      <LinearGradient
                        colors={["#22C55E", "#2563EB"]}
                        style={{
                          width: "65%",
                          height: "100%",
                        }}
                      />
                    </View>
                  </>
                )}

                {/* PROCESSING */}
                {uploadState === "processing" && (
                  <>
                    <Text
                      style={{
                        color: "#0F172A",
                        marginTop: 18,
                        fontWeight: "700",
                      }}
                    >
                      AI Processing Report
                    </Text>

                    <View
                      style={{
                        marginTop: 22,
                        gap: 16,
                      }}
                    >
                      {processingSteps.map((item, index) => (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 14,
                          }}
                        >
                          <View
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: 999,
                              backgroundColor: "#22C55E",
                            }}
                          />

                          <Text
                            style={{
                              color: "#475569",
                              fontWeight: "600",
                            }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </>
                )}

                {/* SUCCESS */}
                {uploadState === "success" && (
                  <View
                    style={{
                      marginTop: 24,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 999,
                        backgroundColor: "rgba(34,197,94,0.12)",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 38,
                        }}
                      >
                        ✓
                      </Text>
                    </View>

                    <Text
                      style={{
                        color: "#22C55E",
                        fontSize: 22,
                        fontWeight: "800",
                        marginTop: 20,
                      }}
                    >
                      Analysis Complete
                    </Text>

                    <Text
                      style={{
                        color: "#64748B",
                        marginTop: 10,
                        textAlign: "center",
                        lineHeight: 24,
                      }}
                    >
                      AI successfully processed and analyzed
                      your medical report.
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* AI WORKFLOW */}
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 30,
                padding: 28,
                borderWidth: 1,
                borderColor: "#E2E8F0",
              }}
            >
              <Text
                style={{
                  color: "#0F172A",
                  fontSize: 24,
                  fontWeight: "800",
                }}
              >
                AI Workflow
              </Text>

              <View
                style={{
                  marginTop: 30,
                  gap: 22,
                }}
              >
                {[
                  "Upload Medical Report",
                  "OCR & Data Extraction",
                  "Validation & Normalization",
                  "AI Biomarker Analysis",
                  "Insight Generation",
                  "Dashboard Update",
                ].map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 18,
                    }}
                  >
                    <View
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 999,
                        backgroundColor: "#22C55E",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "800",
                        }}
                      >
                        {index + 1}
                      </Text>
                    </View>

                    <Text
                      style={{
                        color: "#334155",
                        fontWeight: "700",
                        fontSize: 15,
                      }}
                    >
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* RIGHT SIDE */}
          <View
            style={{
              width: isDesktop ? 360 : "100%",
              gap: 24,
            }}
          >
            {/* SUPPORTED FILES */}
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 30,
                padding: 26,
                borderWidth: 1,
                borderColor: "#E2E8F0",
              }}
            >
              <Text
                style={{
                  color: "#0F172A",
                  fontSize: 24,
                  fontWeight: "800",
                }}
              >
                Supported Formats
              </Text>

              <View
                style={{
                  marginTop: 24,
                  gap: 18,
                }}
              >
                {["PDF Reports", "Blood Scans", "PNG Images", "JPG Images"]
                  .map((item, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: "#F8FAFC",
                        padding: 18,
                        borderRadius: 18,
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

            {/* FLOATING INSIGHTS */}
            <LinearGradient
              colors={["#7C3AED", "#22C55E"]}
              style={{
                borderRadius: 30,
                padding: 26,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 24,
                  fontWeight: "800",
                }}
              >
                AI Insights
              </Text>

              <View
                style={{
                  marginTop: 24,
                  gap: 16,
                }}
              >
                {[
                  "Glucose increased by 18%",
                  "Hemoglobin decreased by 6%",
                  "AI detected anomaly pattern",
                ].map((item, index) => (
                  <Text
                    key={index}
                    style={{
                      color: "rgba(255,255,255,0.92)",
                      lineHeight: 24,
                      fontWeight: "600",
                    }}
                  >
                    • {item}
                  </Text>
                ))}
              </View>

              <Pressable
                style={{
                  marginTop: 26,
                  backgroundColor: "rgba(255,255,255,0.18)",
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
                  View Insights
                </Text>
              </Pressable>
            </LinearGradient>

            {/* RECENT UPLOADS */}
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 30,
                padding: 26,
                borderWidth: 1,
                borderColor: "#E2E8F0",
              }}
            >
              <Text
                style={{
                  color: "#0F172A",
                  fontSize: 24,
                  fontWeight: "800",
                }}
              >
                Recent Uploads
              </Text>

              <View
                style={{
                  marginTop: 24,
                  gap: 18,
                }}
              >
                {recentUploads.map((item, index) => (
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
                        color: "#0F172A",
                        fontWeight: "700",
                      }}
                    >
                      {item.file}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 12,
                      }}
                    >
                      <Text
                        style={{
                          color: "#64748B",
                        }}
                      >
                        {item.status}
                      </Text>

                      <Text
                        style={{
                          color: item.color,
                          fontWeight: "700",
                        }}
                      >
                        {item.severity}
                      </Text>
                    </View>
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