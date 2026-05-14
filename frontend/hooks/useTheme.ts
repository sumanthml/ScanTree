// frontend/hooks/useTheme.ts

import { useAppTheme } from "../theme/ThemeProvider";

export default function useTheme() {
  const { theme, isDark, toggleTheme } =
    useAppTheme();

  return {
    theme,
    isDark,
    toggleTheme,

    colors: theme.colors,
    spacing: theme.spacing,
    radius: theme.radius,
    typography: theme.typography,
    shadow: theme.shadow,
  };
}