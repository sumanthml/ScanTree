import React from "react";

import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";

import {
  useTheme,
} from "@/hooks/useTheme";

import {
  RADIUS,
} from "@/constants/radius";

interface Props {

  children:
    React.ReactNode;

  style?:
    StyleProp<ViewStyle>;

  padding?: number;
}

export default function AppCard({

  children,

  style,

  padding = 20,

}: Props) {

  const theme =
    useTheme();

  return (

    <View
      style={[

        styles.card,

        {
          backgroundColor:
            theme.card,

          borderColor:
            theme.border,

          padding,
        },

        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles =
  StyleSheet.create({

    card: {

      borderWidth: 1,

      borderRadius:
        RADIUS.lg,
    },
  });