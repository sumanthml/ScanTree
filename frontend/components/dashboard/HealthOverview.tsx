import React from "react";

import GradientCard
from "@/components/ui/GradientCard";

import AppText
from "@/components/ui/AppText";

interface Props {

  score: number;
}

export default function HealthOverview({

  score,
}: Props) {

  return (

    <GradientCard
      title="Health Score"
      value={String(score)}
    >

      <AppText
        variant="caption"
        color="rgba(255,255,255,0.85)"
        style={{
          marginTop: 12,
        }}
      >
        AI-generated overall wellness score
      </AppText>

    </GradientCard>
  );
}