import React from "react";

import {
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";

import {
  useTheme,
} from "@/hooks/useTheme";

import {
  RADIUS,
} from "@/constants/radius";

interface Props
  extends TextInputProps {}

export default function AppInput({

  style,

  ...props

}: Props) {

  const theme =
    useTheme();

  return (

    <TextInput

      {...props}

      placeholderTextColor={
        theme.textSecondary
      }

      style={[

        styles.input,

        {

          backgroundColor:
            theme.card,

          borderColor:
            theme.border,

          color:
            theme.text,
        },

        style,
      ]}
    />
  );
}

const styles =
  StyleSheet.create({

    input: {

      height: 58,

      borderWidth: 1,

      borderRadius:
        RADIUS.lg,

      paddingHorizontal: 18,

      fontSize: 16,
    },
  });