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

export default function AccessMemberList() {

  return (

    <AppCard>

      <AppText
        variant="heading"
      >
        Shared Members
      </AppText>

      <View style={styles.member}>

        <View>

          <AppText
            variant="body"
          >
            Rahul Sharma
          </AppText>

          <AppText
            variant="caption"
            color={COLORS.textSecondary}
          >
            Brother • Emergency Access
          </AppText>

        </View>

      </View>

    </AppCard>
  );
}

const styles =
  StyleSheet.create({

    member: {

      marginTop: 20,

      padding: 16,

      borderRadius: 16,

      backgroundColor:
        "#0F172A",
    },
  });