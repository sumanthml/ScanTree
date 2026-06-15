import React, {
  ReactNode,
} from "react";

import {
  View,
  StyleSheet,
} from "react-native";

import {
  LinearGradient,
} from "expo-linear-gradient";

import AppText
from "@/components/ui/AppText";

interface Props {

  title: string;

  value: string;

  children?: ReactNode;
}

export default function GradientCard({

  title,

  value,

  children,
}: Props) {

  return (

    <LinearGradient
      colors={[
        "#22C55E",
        "#2563EB",
      ]}
      start={{
        x: 0,
        y: 0,
      }}
      end={{
        x: 1,
        y: 1,
      }}
      style={
        styles.container
      }
    >

      <AppText
        variant="body"
        color="#FFFFFF"
      >
        {title}
      </AppText>

      <AppText
        variant="heading"
        color="#FFFFFF"
        style={{
          marginTop: 12,
        }}
      >
        {value}
      </AppText>

      {children}

    </LinearGradient>
  );
}

const styles =
  StyleSheet.create({

    container: {

      borderRadius: 24,

      padding: 24,
    },
  });