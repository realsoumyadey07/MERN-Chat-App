import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

const Conversations = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <FontAwesome name="search" size={20} color="gray" style={styles.icon} />
        <TextInput
          placeholder="Search your chats..."
          style={styles.input}
          placeholderTextColor="gray"
        />
      </View>
      <View>
        <TouchableOpacity style={styles.chatContainer} onPress={()=> router.push("../conversationId/23874ehgd")}>
          {/* <Image source={}/> */}
          <FontAwesome name="user-circle-o" size={30} color="black" />
          <View style={styles.messageSection}>
            <Text>Name</Text>
            <Text>messages...</Text>
          </View>
          <Text>Yesterday</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Conversations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: "#f5f5f5",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "gray",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  chatContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "space-between",
    backgroundColor: "#e8e8e8",
    padding: 15,
    borderRadius: 10
  },
  messageSection: {
    width: "60%"
  }
});
