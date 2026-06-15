import React from "react";

import {
  View,
  Pressable,
  StyleSheet,
} from "react-native";

import {
  router,
  usePathname,
} from "expo-router";

import {
  BlurView,
} from "expo-blur";

import {
  NAV_ITEMS,
} from "@/constants/navigation";

import {
  useTheme,
} from "@/hooks/useTheme";

import AppText
from "@/components/ui/AppText";

import {
  RADIUS,
} from "@/constants/radius";

export default function BottomBar() {

  const pathname =
    usePathname();

  const theme =
    useTheme();

  return (

    <View style={styles.wrapper}>

      <BlurView

        intensity={90}

        tint="light"

        style={[

          styles.container,

          {
            borderColor:
              theme.border,
          },
        ]}
      >

        {

          NAV_ITEMS.slice(0, 5)
          .map((item) => {

            const active =

              pathname ===
              item.route;

            return (

              <Pressable

                key={item.route}

                style={styles.item}

                onPress={() => {

                  router.push(
                    item.route as any
                  );
                }}
              >

                <View
                  style={[

                    styles.iconWrapper,

                    active && {

                      backgroundColor:
                        theme.primary,
                    },
                  ]}
                >

                 <AppText
  variant="body"
>
                    {item.icon}
                  </AppText>

                </View>

                <AppText

                  variant="caption"

                  color={
                    active
                    ? theme.primary
                    : theme.textSecondary
                  }
                >
                  {item.label}
                </AppText>

              </Pressable>
            );
          })
        }

      </BlurView>

    </View>
  );
}

const styles =
  StyleSheet.create({

    wrapper: {

      position: "absolute",

      left: 16,

      right: 16,

      bottom: 18,
    },

    container: {

      height: 84,

      borderRadius:
        RADIUS.xl,

      flexDirection: "row",

      justifyContent:
        "space-around",

      alignItems: "center",

      overflow: "hidden",

      borderWidth: 1,
    },

    item: {

      alignItems: "center",

      gap: 4,
    },

    iconWrapper: {

      width: 48,

      height: 48,

      borderRadius: 16,

      justifyContent: "center",

      alignItems: "center",
    },
  });