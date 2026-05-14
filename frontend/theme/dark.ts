// frontend/theme/dark.ts

const darkTheme = {
  dark: true,

  colors: {
    // PRIMARY
    primary: "#22C55E",
    secondary: "#3B82F6",
    accent: "#8B5CF6",

    // BACKGROUNDS
    background: "#020617",
    surface: "#0F172A",
    surfaceSecondary: "#111827",

    // TEXT
    text: "#F8FAFC",
    textSecondary: "#CBD5E1",
    textMuted: "#64748B",

    // STATUS
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",

    // BORDERS
    border: "rgba(255,255,255,0.08)",
    borderLight: "rgba(255,255,255,0.04)",

    // GRADIENTS
    gradientPrimary: ["#22C55E", "#2563EB"],
    gradientPurple: ["#7C3AED", "#2563EB"],
    gradientDark: ["#020617", "#111827"],

    // CARD
    card: "#0F172A",
    glass: "rgba(15,23,42,0.72)",

    // SHADOW
    shadow: "rgba(0,0,0,0.40)",

    // OVERLAYS
    overlay: "rgba(0,0,0,0.60)",

    // AI COLORS
    aiGreen: "rgba(34,197,94,0.14)",
    aiBlue: "rgba(37,99,235,0.14)",
    aiPurple: "rgba(124,58,237,0.14)",
    aiRed: "rgba(239,68,68,0.14)",
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
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 8,
      elevation: 3,
    },

    medium: {
      shadowColor: "#000",
      shadowOpacity: 0.26,
      shadowRadius: 14,
      elevation: 6,
    },

    large: {
      shadowColor: "#000",
      shadowOpacity: 0.40,
      shadowRadius: 22,
      elevation: 12,
    },
  },
};

export default darkTheme;