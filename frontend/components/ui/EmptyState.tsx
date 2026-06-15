import React from "react";

import {
  View,
  StyleSheet,
} from "react-native";

import AppText from "./AppText";

interface Props {

  title: string;

  description?: string;
}

export default function EmptyState({

  title,
  description,

}: Props) {

  return (

    <View style={styles.container}>

      <AppText
        variant="subheading"
        center
      >
        {title}
      </AppText>

      {

        description && (

          <AppText
            variant="body"
            color="#64748B"
            center
            style={{
              marginTop: 8,
            }}
          >
            {description}
          </AppText>
        )
      }

    </View>
  );
}

const styles =
  StyleSheet.create({

    container: {

      paddingVertical: 48,

      alignItems: "center",

      justifyContent: "center",
    },
  });