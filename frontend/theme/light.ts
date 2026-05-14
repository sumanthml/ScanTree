// frontend/theme/light.ts

const lightTheme = {
  dark: false,

  colors: {
    // PRIMARY
    primary: "#22C55E",
    secondary: "#2563EB",
    accent: "#7C3AED",

    // BACKGROUNDS
    background: "#F8FAFB",
    surface: "#FFFFFF",
    surfaceSecondary: "#F1F5F9",

    // TEXT
    text: "#0F172A",
    textSecondary: "#475569",
    textMuted: "#94A3B8",

    // STATUS
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#2563EB",

    // BORDERS
    border: "#E2E8F0",
    borderLight: "#F1F5F9",

    // GRADIENTS
    gradientPrimary: ["#22C55E", "#2563EB"],
    gradientPurple: ["#7C3AED", "#2563EB"],
    gradientDark: ["#0F172A", "#1E293B"],

    // CARD
    card: "#FFFFFF",
    glass: "rgba(255,255,255,0.72)",

    // SHADOW
    shadow: "rgba(15,23,42,0.06)",

    // OVERLAYS
    overlay: "rgba(15,23,42,0.45)",

    // AI COLORS
    aiGreen: "rgba(34,197,94,0.12)",
    aiBlue: "rgba(37,99,235,0.12)",
    aiPurple: "rgba(124,58,237,0.12)",
    aiRed: "rgba(239,68,68,0.12)",
  },

  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 22,
    xl: 28,
    xxl: 36,
  },

  radius: {
    sm: 14,
    md: 20,
    lg: 28,
    xl: 34,
    full: 999,
  },

  typography: {
    h1: 38,
    h2: 32,
    h3: 28,
    h4: 24,

    body: 16,
    small: 14,
    tiny: 12,
  },

  shadow: {
    small: {
      shadowColor: "#0F172A",
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },

    medium: {
      shadowColor: "#0F172A",
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },

    large: {
      shadowColor: "#0F172A",
      shadowOpacity: 0.14,
      shadowRadius: 20,
      elevation: 10,
    },
  },
};

export default lightTheme;