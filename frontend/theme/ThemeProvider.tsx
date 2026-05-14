// frontend/theme/ThemeProvider.tsx

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import darkTheme from "./dark";
import lightTheme from "./light";

type ThemeType = typeof lightTheme;

type ThemeContextType = {
  theme: ThemeType;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext =
  createContext<ThemeContextType | null>(null);

type ProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({
  children,
}: ProviderProps) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const theme = useMemo(
    () => (isDark ? darkTheme : lightTheme),
    [isDark]
  );

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useAppTheme must be used inside ThemeProvider"
    );
  }

  return context;
}