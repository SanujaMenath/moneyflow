import { Platform, ViewStyle } from "react-native";

export function shadow(elevation: number, color: string = "#000", opacity: number = 0.3, radius: number = elevation * 2): ViewStyle {
  if (Platform.OS === "web") {
    return {
      boxShadow: `0 ${elevation}px ${radius}px rgba(0,0,0,${opacity})`,
    } as ViewStyle;
  }
  return {
    elevation,
    shadowColor: color,
    shadowOffset: { width: 0, height: elevation / 2 },
    shadowOpacity: opacity,
    shadowRadius: radius,
  } as ViewStyle;
}
