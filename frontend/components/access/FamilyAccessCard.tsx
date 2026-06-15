import React from "react";

import {
  View,
  StyleSheet,
  Pressable,
} from "react-native";

import {
  router,
} from "expo-router";

import AppCard
from "@/components/ui/AppCard";

import AppText
from "@/components/ui/AppText";

import {
  COLORS,
} from "@/constants/colors";

export default function FamilyAccessCard() {

  return (

    <AppCard>

      <View style={styles.header}>

        <View>

          <AppText
            variant="heading"
          >
            Family Access
          </AppText>

          <AppText
            variant="body"
            color={COLORS.textSecondary}
            style={{
              marginTop: 8,
            }}
          >
            Securely share medical
            records with trusted
            family members.
          </AppText>

        </View>

      </View>

      <Pressable
        style={styles.button}
        onPress={() => {

          router.push(
            "/access/add-family"
          );
        }}
      >

        <AppText
          variant="body"
          color="#FFFFFF"
        >
          Add Family Member
        </AppText>

      </Pressable>

    </AppCard>
  );
}

const styles =
  StyleSheet.create({

    header: {

      marginBottom: 24,
    },

    button: {

      backgroundColor:
        COLORS.primary,

      paddingVertical: 14,

      borderRadius: 16,

      alignItems: "center",
    },
  });