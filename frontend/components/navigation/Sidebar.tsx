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
  NAV_ITEMS,
} from "@/constants/navigation";

import {
  useTheme,
} from "@/hooks/useTheme";

import AppText
from "@/components/ui/AppText";

import {
  LAYOUT,
} from "@/constants/layout";

export default function Sidebar() {

  const pathname =
    usePathname();

  const theme =
    useTheme();

  return (

    <View
      style={[

        styles.sidebar,

        {
          backgroundColor:
            theme.sidebar,
        },
      ]}
    >

      <View
        style={styles.logo}
      >

        <AppText
          variant="subheading"
          color="white"
        >
          ScanTrace
        </AppText>

      </View>

      <View
        style={styles.menu}
      >

        {

          NAV_ITEMS.map((item) => {

            const active =

              pathname ===
              item.route;

            return (

              <Pressable

                key={item.route}

                style={[

                  styles.link,

                  active && {

                    backgroundColor:
                      "rgba(255,255,255,0.08)",
                  },
                ]}

                onPress={() => {

                  router.push(
                    item.route as any
                  );
                }}
              >

                <AppText
                  variant="body"
                >
                  {item.icon}
                </AppText>

                <AppText
                  variant="body"
                  color="white"
                >
                  {item.label}
                </AppText>

              </Pressable>
            );
          })
        }

      </View>

    </View>
  );
}

const styles =
  StyleSheet.create({

    sidebar: {

      width:
        LAYOUT.sidebarWidth,

      padding: 24,
    },

    logo: {

      marginBottom: 40,
    },

    menu: {

      gap: 10,
    },

    link: {

      flexDirection: "row",

      alignItems: "center",

      gap: 14,

      padding: 14,

      borderRadius: 18,
    },
  });