import React from "react";

import {
  View,
  StyleSheet,
} from "react-native";

import AppCard
from "@/components/ui/AppCard";

import AppText
from "@/components/ui/AppText";

import {
  COLORS,
} from "@/constants/colors";

export default function QRCodeShare() {

  return (

    <AppCard>

      <AppText
        variant="heading"
      >
        QR Access Sharing
      </AppText>

      <View style={styles.qrBox}>

        <AppText
          variant="caption"
          color={COLORS.textSecondary}
        >
          QR CODE PLACEHOLDER
        </AppText>

      </View>

      <AppText
        variant="body"
        color={COLORS.textSecondary}
      >
        Generate temporary QR codes
        for doctors and emergency
        access.
      </AppText>

    </AppCard>
  );
}

const styles =
  StyleSheet.create({

    qrBox: {

      height: 180,

      borderRadius: 20,

      marginVertical: 20,

      alignItems: "center",

      justifyContent: "center",

      backgroundColor:
        "#0F172A",
    },
  });