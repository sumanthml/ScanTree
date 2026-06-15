import React from "react";

import {
  Text,
  TextProps,
  StyleSheet,
  TextStyle,
} from "react-native";

import {
  useTheme,
} from "@/hooks/useTheme";

interface Props
  extends TextProps {

  children:
    React.ReactNode;

  variant?:
    | "heading"
    | "subheading"
    | "body"
    | "caption";

  color?: string;

  center?: boolean;

  style?: TextStyle | TextStyle[];
}

export default function AppText({

  children,

  variant = "body",

  color,

  center = false,

  style,

  ...props

}: Props) {

  const theme =
    useTheme();

  return (

    <Text
      {...props}
      style={[

        styles.base,

        styles[variant],

        {

          color:
            color || theme.text,

          textAlign:
            center
              ? "center"
              : "left",
        },

        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles =
  StyleSheet.create({

    base: {},

    heading: {

      fontSize: 34,

      fontWeight: "800",

      lineHeight: 42,
    },

    subheading: {

      fontSize: 24,

      fontWeight: "700",

      lineHeight: 30,
    },

    body: {

      fontSize: 16,

      fontWeight: "500",

      lineHeight: 24,
    },

    caption: {

      fontSize: 13,

      fontWeight: "500",

      lineHeight: 18,
    },
  });