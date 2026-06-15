import React from "react";

import {
  View,
  StyleSheet,
} from "react-native";

import AppCard
from "@/components/ui/AppCard";

import AppText
from "@/components/ui/AppText";

interface Report {

  id: string;

  report_type: string;

  hospital_name?: string;
}

interface Props {

  reports: Report[];
}

export default function RecentReportsList({

  reports,
}: Props) {

  return (

    <AppCard
      style={styles.container}
    >

      <AppText
        variant="heading"
      >
        Recent Reports
      </AppText>

      {

        reports.length === 0 ? (

          <AppText
            variant="body"
            color="#64748B"
            style={{
              marginTop: 20,
            }}
          >
            No reports available
          </AppText>

        ) : (

          <View
            style={{
              marginTop: 18,
              gap: 14,
            }}
          >

            {

              reports.map(
                (report) => (

                <View
                  key={report.id}
                >

                  <AppText
                    variant="body"
                  >
                    {
                      report.report_type
                    }
                  </AppText>

                  <AppText
                    variant="caption"
                    color="#64748B"
                  >
                    {
                      report.hospital_name ||
                      "Unknown Hospital"
                    }
                  </AppText>

                </View>
              ))
            }

          </View>
        )
      }

    </AppCard>
  );
}

const styles =
  StyleSheet.create({

    container: {

      marginTop: 24,
    },
  });