from typing import List, Dict


class InsightsService:

    HIGH_RISK = {"HIGH", "CRITICAL"}

    @staticmethod
    def generate_insights(
        overview: dict,
        critical_changes: List[dict],
        health_history: List[dict]
    ) -> List[Dict]:

        insights = []

        health_history = sorted(
            health_history,
            key=lambda x: x.get("report_date", "")
        )

        # ----------------------------
        # Health trend
        # ----------------------------
        if len(health_history) >= 2:

            latest = health_history[-1]["health_score"]
            previous = health_history[-2]["health_score"]

            delta = latest - previous

            if delta <= -10:
                insights.append({
                    "type": "HEALTH_DECLINE",
                    "severity": "HIGH",
                    "title": "Health Score Declining",
                    "description": f"Dropped by {abs(delta)} points"
                })

            elif delta >= 10:
                insights.append({
                    "type": "HEALTH_IMPROVEMENT",
                    "severity": "LOW",
                    "title": "Health Improvement",
                    "description": f"Improved by {delta} points"
                })

        # ----------------------------
        # Critical biomarkers
        # ----------------------------
        high_risk_items = [
            x for x in critical_changes
            if x.get("risk_level") in self.HIGH_RISK
        ]

        if high_risk_items:
            insights.append({
                "type": "CRITICAL_BIOMARKERS",
                "severity": "CRITICAL",
                "title": "Critical Biomarker Changes",
                "description": f"{len(high_risk_items)} abnormal biomarkers detected"
            })

        # ----------------------------
        # Overall health
        # ----------------------------
        avg = overview.get("average_health_score")

        if avg is not None:

            if avg < 60:
                insights.append({
                    "type": "LOW_HEALTH",
                    "severity": "HIGH",
                    "title": "Low Health Trend",
                    "description": "Consistently low health scores detected"
                })

            elif avg > 85:
                insights.append({
                    "type": "STABLE_HEALTH",
                    "severity": "LOW",
                    "title": "Stable Health",
                    "description": "Health indicators are stable"
                })

        if not insights:
            insights.append({
                "type": "NO_PATTERN",
                "severity": "LOW",
                "title": "No Significant Patterns",
                "description": "No major anomalies detected"
            })

        return insights