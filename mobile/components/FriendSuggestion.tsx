import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import React from "react";
import UserComponent from "./UserComponent";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useDispatch } from "react-redux";
import { getAllSuggestions, sendRequest } from "@/redux/slices/user.slice";
import { AppDispatch } from "@/redux/store";

interface FriendSuggestion {
  userId: string;
  title: string;
  status: string;
}

const FriendSuggestion = ({ userId, title, status }: FriendSuggestion) => {
  const dispatch = useDispatch<AppDispatch>();
  const handleSendRequest = () => {
    Alert.alert("Send request", "Do you want to send friend request?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel pressed!"),
        style: "cancel",
      },
      {
        text: "Send",
        onPress: async () => {
          try {
            await dispatch(sendRequest(userId)).unwrap();
            dispatch(getAllSuggestions());
          } catch (err) {
            console.error(err);
          }
        },
      },
    ]);
  };
  return (
    <View style={styles.container} key={userId}>
      <View style={styles.leftSection}>
        <UserComponent letter={title?.charAt(0).toUpperCase() || "U"} />
        <View style={styles.textSection}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.status}>{status}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.iconButton} onPress={handleSendRequest}>
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
