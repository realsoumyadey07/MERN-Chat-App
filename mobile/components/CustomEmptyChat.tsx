import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";

interface CustomEmptyChatProps {
  title: string;
  description?: string;
}

const CustomEmptyChat = ({ title, description }: CustomEmptyChatProps) => {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/no-contact.png")} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
};

export default CustomEmptyChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 50,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 15,
    opacity: 0.9,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },
});
