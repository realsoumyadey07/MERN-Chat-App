import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import UserComponent from "./UserComponent";
import AntDesign from "@expo/vector-icons/AntDesign";

interface FriendSuggestion {
  userId: string;
  title: string;
  status: string;
}

const FriendSuggestion = ({ userId, title, status }: FriendSuggestion) => {
  return (
    <View style={styles.container} key={userId}>
      <View style={styles.leftSection}>
        <UserComponent letter={title?.charAt(0).toUpperCase() || "U"} />
        <View style={styles.textSection}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.status}>{status}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.iconButton}>
        <AntDesign name="adduser" size={22} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default FriendSuggestion;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f8f8f8",
    marginBottom: 10,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  textSection: {
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  status: {
    fontSize: 12,
    color: "gray",
  },
  iconButton: {
    backgroundColor: "#22c55e",
    padding: 8,
    borderRadius: 8,
  },
});
