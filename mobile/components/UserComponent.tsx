import { Text, View } from "react-native";

export default function UserComponent({
  letter,
  focused,
  size = 35, // ✅ default size
}: {
  letter: string;
  focused?: boolean;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2, // ✅ makes it always circular
        backgroundColor: focused ? "transparent" : "#d1d1cf",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontWeight: "600", // ✅ should be string not number in RN
          color: focused ? "#fff" : "#000",
          fontSize: size * 0.5, // ✅ scale text based on size
        }}
      >
        {letter?.toUpperCase()}
      </Text>
    </View>
  );
}
