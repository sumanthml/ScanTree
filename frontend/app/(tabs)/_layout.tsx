import { Tabs } from "expo-router";

import {
  Dimensions,
  Platform,
  Text,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const isDesktop =
  Platform.OS === "web" && width >= 1024;

function TabIcon({
  icon,
  focused,
}: {
  icon: string;
  focused: boolean;
}) {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {focused ? (
        <LinearGradient
          colors={["#22C55E", "#2563EB"]}
          style={{
            width: 54,
            height: 54,
            borderRadius: 18,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 22,
            }}
          >
            {icon}
          </Text>
        </LinearGradient>
      ) : (
        <View
          style={{
            width: 54,
            height: 54,
            borderRadius: 18,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 21,
              opacity: 0.5,
            }}
          >
            {icon}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarShowLabel: false,

        // HIDE MOBILE TAB BAR ON DESKTOP
        tabBarStyle: isDesktop
          ? {
              display: "none",
            }
          : {
              position: "absolute",

              left: 16,
              right: 16,
              bottom: 16,

              height: 86,

              borderRadius: 30,

              backgroundColor:
                "rgba(255,255,255,0.92)",

              borderTopWidth: 0,

              elevation: 0,

              shadowColor: "#0F172A",
              shadowOpacity: 0.08,
              shadowRadius: 20,

              paddingHorizontal: 12,
              paddingTop: 12,
            },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon="🏠"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon="📄"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="upload"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon="⬆️"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon="🔔"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon="👤"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}