import {
  StyleSheet,
  View,
} from "react-native";

import MetricCard from "@/components/ui/MetricCard";

import {
  SPACING,
} from "@/constants/spacing";

import {
  COLORS,
} from "@/constants/colors";

interface Props {

  reports: number;

  abnormal: number;

  highRisk: number;
}

export default function DashboardMetrics({

  reports,
  abnormal,
  highRisk,

}: Props) {

  return (

    <View
      style={
        styles.container
      }
    >

      <MetricCard
        label="Reports"
        value={String(
          reports
        )}
        valueColor={
          COLORS.primary
        }
      />

      <MetricCard
        label="Abnormal"
        value={String(
          abnormal
        )}
        valueColor={
          COLORS.danger
        }
      />

      <MetricCard
        label="High Risk"
        value={String(
          highRisk
        )}
        valueColor={
          COLORS.warning
        }
      />

    </View>
  );
}

const styles =
  StyleSheet.create({

    container: {

      flexDirection: "row",

      gap:
        SPACING.md,
    },
  });