import {
  Text,
  View,
} from "react-native";

import {
  LinearGradient,
} from "expo-linear-gradient";

interface Props {

  score: number;
}

export default function HealthScoreCard({
  score,
}: Props) {

  return (

    <LinearGradient
      colors={[
        "#22C55E",
        "#2563EB",
      ]}
      style={{
        borderRadius: 30,
        padding: 28,
      }}
    >

      <Text
        style={{
          color: "white",
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 12,
        }}
      >
        Health Score
      </Text>

      <Text
        style={{
          color: "white",
          fontSize: 56,
          fontWeight: "800",
        }}
      >
        {score}
      </Text>

    </LinearGradient>
  );
}