import React from "react";

import {
  View,
  StyleSheet,
} from "react-native";

import AppText from "./AppText";

interface Props {

  title: string;

  subtitle?: string;
}

export default function SectionHeader({

  title,
  subtitle,

}: Props) {

  return (

    <View style={styles.container}>

      <AppText
        variant="heading"
      >
        {title}
      </AppText>

      {

        subtitle && (

          <AppText
            variant="body"
            color="#64748B"
            style={{
              marginTop: 6,
            }}
          >
            {subtitle}
          </AppText>
        )
      }

    </View>
  );
}

const styles =
  StyleSheet.create({

    container: {

      marginBottom: 24,
    },
  });