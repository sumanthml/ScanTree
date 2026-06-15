import {
  StyleSheet,
  View,
} from "react-native";

import AppText from "./AppText";

import {
  COLORS,
} from "@/constants/colors";

import {
  SPACING,
} from "@/constants/spacing";

import {
  RADIUS,
} from "@/constants/radius";

interface Props {

  label: string;

  value: string;

  valueColor?: string;
}

export default function MetricCard({

  label,
  value,
  valueColor = COLORS.primary,

}: Props) {

  return (

    <View
      style={
        styles.card
      }
    >

      <AppText
        style={
          styles.label
        }
      >
        {label}
      </AppText>

      <AppText
        style={[

          styles.value,

          {
            color:
              valueColor,
          },
        ]}
      >
        {value}
      </AppText>

    </View>
  );
}

const styles =
  StyleSheet.create({

    card: {

      flex: 1,

      backgroundColor:
        COLORS.card,

      borderRadius:
        RADIUS.lg,

      padding:
        SPACING.lg,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      gap:
        SPACING.sm,
    },

    label: {

      fontSize: 14,

      color:
        COLORS.background,

      fontWeight: "500",
    },

    value: {

      fontSize: 36,

      fontWeight: "800",
    },
  });