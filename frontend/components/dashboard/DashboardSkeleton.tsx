import {
  View,
} from "react-native";

export default function DashboardSkeleton() {

  return (

    <View
      style={{
        flex: 1,
        padding: 24,
        gap: 20,
      }}
    >

      <View
        style={{
          height: 80,
          borderRadius: 20,
          backgroundColor: "#E2E8F0",
        }}
      />

      <View
        style={{
          flexDirection: "row",
          gap: 16,
        }}
      >

        <View
          style={{
            flex: 1,
            height: 140,
            borderRadius: 24,
            backgroundColor: "#E2E8F0",
          }}
        />

        <View
          style={{
            flex: 1,
            height: 140,
            borderRadius: 24,
            backgroundColor: "#E2E8F0",
          }}
        />

      </View>

      <View
        style={{
          height: 220,
          borderRadius: 28,
          backgroundColor: "#E2E8F0",
        }}
      />

    </View>
  );
}