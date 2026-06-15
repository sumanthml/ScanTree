import {
  Dimensions,
  Platform,
} from "react-native";

export function useBreakpoint() {

  const width =
    Dimensions.get(
      "window"
    ).width;

  const isDesktop =

    Platform.OS === "web"

    &&

    width >= 1024;

  const isTablet =

    width >= 768;

  const isMobile =

    width < 768;

  return {

    width,

    isDesktop,

    isTablet,

    isMobile,
  };
}