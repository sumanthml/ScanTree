import React from "react";

import {
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import AppText from "./AppText";

import {
  useTheme,
} from "@/hooks/useTheme";

interface Props {

  text?: string;
}

export default function LoadingState({

  text = "Loading...",
}: Props) {

  const theme =
    useTheme();

  return (

    <View style={styles.container}>

      <ActivityIndicator
        size="large"
        color={theme.primary}
      />

      <AppText
        color={theme.textSecondary}
        style={{
          marginTop: 16,
        }}
      >
        {text}
      </AppText>

    </View>
  );
}

const styles =
  StyleSheet.create({

    container: {

      flex: 1,

      justifyContent: "center",

      alignItems: "center",

      paddingVertical: 80,
    },
  });