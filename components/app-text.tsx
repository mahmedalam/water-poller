import { Text, TextProps, Platform } from "react-native";

export function AppText(props: TextProps) {
  return (
    <Text
      {...props}
      style={[
        Platform.OS === "android" && {
          includeFontPadding: false,
          textAlignVertical: "center",
        },
        props.style,
      ]}
    />
  );
}
