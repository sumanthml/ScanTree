import {
  Text,
  View,
} from "react-native";

interface Props {

  totalReports: number;

  abnormalBiomarkers: number;

  highRiskInsights: number;
}

export default function StatsGrid({

  totalReports,

  abnormalBiomarkers,

  highRiskInsights,

}: Props) {

  const stats = [

    {
      label: "Reports",
      value: totalReports,
      color: "#2563EB",
    },

    {
      label: "Abnormal",
      value: abnormalBiomarkers,
      color: "#EF4444",
    },

    {
      label: "High Risk",
      value: highRiskInsights,
      color: "#F59E0B",
    },
  ];

  return (

    <View
      style={{
        flexDirection: "row",
        gap: 16,
      }}
    >

      {
        stats.map((item) => (

          <View
            key={item.label}
            style={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: 24,
              padding: 20,
            }}
          >

            <Text
              style={{
                color: "#64748B",
                marginBottom: 10,
              }}
            >
              {item.label}
            </Text>

            <Text
              style={{
                fontSize: 34,
                fontWeight: "800",
                color: item.color,
              }}
            >
              {item.value}
            </Text>

          </View>
        ))
      }

    </View>
  );
}