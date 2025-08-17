import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import UserComponent from "./UserComponent";
import CustomButton from "./CustomButton";
import Ionicons from "@expo/vector-icons/Ionicons";

interface FriendRequest {
  requestId: string;
  senderId: string;
  title: string;
}

const FriendRequest = ({ requestId, senderId, title }: FriendRequest) => {
  const handleAcceptRequest = () => {};
  const handleRejectRequest = () => {};

  return (
    <View key={requestId} style={styles.requestContainer}>
      {/* Left: User Info */}
      <View style={styles.userSection}>
        <UserComponent letter={title[0] || "U"} />
        <Text style={styles.userName}>{title}</Text>
      </View>

      {/* Right: Actions */}
      <View style={styles.buttonSection}>
        <CustomButton
          title="Accept"
          textStyle={styles.acceptText}
          buttonStyle={styles.acceptBtn}
          handleSubmit={handleAcceptRequest}
        />
        <TouchableOpacity onPress={handleRejectRequest} >
          <Ionicons name="remove-circle" size={30} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({
  requestContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: "#f8f8f8"
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  buttonSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  acceptBtn: {
    backgroundColor: "#22c55e",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  rejectBtn: {
    backgroundColor: "#ef4444",
    padding: 6,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  acceptText: {
    fontSize: 14,
    fontWeight: "500",
    color: "white",
  },
});
