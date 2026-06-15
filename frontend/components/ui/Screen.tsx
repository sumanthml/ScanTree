import React from "react";

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from "react-native";

import {
  useTheme,
} from "@/hooks/useTheme";

import {
  useResponsive,
} from "@/hooks/useResponsive";

import {
  LAYOUT,
} from "@/constants/layout";

interface Props {

  children:
    React.ReactNode;

  scrollable?: boolean;

  style?: ViewStyle;
}

export default function Screen({

  children,

  scrollable = true,

  style,

}: Props) {

  const theme =
    useTheme();

  const {
    isMobile,
  } = useResponsive();

  if (scrollable) {

    return (

      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor:
              theme.background,
          },
        ]}
      >

        <ScrollView
          contentContainerStyle={{

            padding:
              isMobile
                ? LAYOUT.mobilePadding
                : LAYOUT.screenPadding,
          }}

          showsVerticalScrollIndicator={
            false
          }
        >
          {children}
        </ScrollView>

      </SafeAreaView>
    );
  }

  return (

    <SafeAreaView
      style={[

        styles.container,

        {
          backgroundColor:
            theme.background,
        },

        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({

    container: {

      flex: 1,
    },
  });