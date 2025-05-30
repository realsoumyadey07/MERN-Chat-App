import { Text, View } from "react-native";

export default function UserComponent({
  letter,
  focused,
}: {
  letter: String;
  focused?: boolean;
}) {
  return (
    <View
      style={{
        width: 35,
        height: 35,
        borderRadius: 50,
        backgroundColor: focused ? "transparent" : "#d1d1cf",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontWeight: 600,
          color: focused ? "#fff" : "#000",
          fontSize: 18,
        }}
      >
        {letter.toUpperCase()}
      </Text>
    </View>
  );
}
