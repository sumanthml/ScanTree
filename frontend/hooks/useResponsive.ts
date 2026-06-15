import {
  useWindowDimensions,
} from "react-native";

import {
  BREAKPOINTS,
} from "@/constants/breakpoints";

export function useResponsive() {

  const {
    width,
  } = useWindowDimensions();

  return {

    width,

    isMobile:
      width < BREAKPOINTS.mobile,

    isTablet:
      width >= BREAKPOINTS.mobile &&
      width < BREAKPOINTS.desktop,

    isDesktop:
      width >= BREAKPOINTS.desktop,

    isWide:
      width >= BREAKPOINTS.wide,
  };
}