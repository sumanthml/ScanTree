// app/index.tsx

import { useEffect } from "react";
import {
  Dimensions,
  Image,
  Platform,
  Text,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";

import Animated, {
  Easing,
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();

  const scale = useSharedValue(0.7);
  const rotate = useSharedValue(0);
  const glow = useSharedValue(0.4);

  useEffect(() => {
    // Logo entrance
    scale.value = withTiming(1, {
      duration: 1200,
      easing: Easing.out(Easing.exp),
    });

    // Floating rotation
    rotate.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2500 }),
        withTiming(-1, { duration: 2500 })
      ),
      -1,
      true
    );

    // Glow pulse
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800 }),
        withTiming(0.5, { duration: 1800 })
      ),
      -1,
      true
    );

    const initialize = async () => {
      let token = null;

      try {
        if (Platform.OS === "web") {
          token = localStorage.getItem("access_token");
        } else {
          token = await SecureStore.getItemAsync("access_token");
        }
      } catch (error) {
        console.log("Token Error:", error);
      }

      setTimeout(() => {
        if (token) {
          router.replace("/(tabs)/dashboard");
        } else {
          router.replace("/(auth)/login");
        }
      }, 3200);
    };

    initialize();
  }, []);

  const logoStyle = useAnimatedStyle(() => {
    const rotateDeg = interpolate(
      rotate.value,
      [-1, 1],
      [-4, 4]
    );

    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotateDeg}deg` },
      ],
    };
  });

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
    transform: [{ scale: glow.value + 0.7 }],
  }));

  return (
    <LinearGradient
      colors={["#020617", "#071226", "#0F172A"]}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Main Green Glow */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: width * 0.8,
            height: width * 0.8,
            borderRadius: 999,
            backgroundColor: "rgba(22,163,74,0.18)",
          },
          glowStyle,
        ]}
      />

      {/* Blue Orb */}
      <View
        style={{
          position: "absolute",
          top: 120,
          right: -40,
          width: 180,
          height: 180,
          borderRadius: 999,
          backgroundColor: "rgba(37,99,235,0.12)",
        }}
      />

      {/* Green Orb */}
      <View
        style={{
          position: "absolute",
          bottom: 140,
          left: -60,
          width: 220,
          height: 220,
          borderRadius: 999,
          backgroundColor: "rgba(34,197,94,0.10)",
        }}
      />

      {/* Main Content */}
      <Animated.View
        entering={FadeIn.duration(1200)}
        style={[
          logoStyle,
          {
            alignItems: "center",
          },
        ]}
      >
        {/* Logo Container */}
        <View
          style={{
            width: 150,
            height: 150,
            borderRadius: 40,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.06)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.08)",
            shadowColor: "#16A34A",
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <Image
            source={require("../assets/images/logo.png")}
            style={{
              width: 90,
              height: 90,
            }}
            resizeMode="contain"
          />
        </View>

        {/* Brand */}
        <Text
          style={{
            color: "#F8FAFC",
            fontSize: 34,
            fontWeight: "800",
            marginTop: 26,
            letterSpacing: 1,
          }}
        >
          ScanTrace
        </Text>

        <Text
          style={{
            color: "#94A3B8",
            marginTop: 8,
            fontSize: 15,
            letterSpacing: 0.4,
          }}
        >
          AI-Powered Health Intelligence
        </Text>
      </Animated.View>

      {/* Footer */}
      <Text
        style={{
          position: "absolute",
          bottom: 70,
          color: "#64748B",
          fontSize: 13,
          letterSpacing: 0.6,
        }}
      >
        Secure • Intelligent • Real-Time
      </Text>
    </LinearGradient>
  );
}