import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React from "react";
import UserComponent from "./UserComponent";
import CustomButton from "./CustomButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch } from "react-redux";
import { acceptRequest, getAllRequests } from "@/redux/slices/user.slice";
import { AppDispatch } from "@/redux/store";
import { getMyChats } from "@/redux/slices/chat.slice";

interface FriendRequest {
  requestId: string;
  senderId: string;
  title: string;
}

const FriendRequest = ({ requestId, senderId, title }: FriendRequest) => {
  const dispatch = useDispatch<AppDispatch>();
  const handleAcceptRequest = () => {
    Alert.alert(
      "Accept request",
      "Do you want to accept the request?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Accept",
          onPress: async () => {
            dispatch(
              acceptRequest({
                requestId,
                accept: true,
              })
            ).then(() => {
              dispatch(getAllRequests());
            });
            try {
              await dispatch(acceptRequest({requestId, accept: true})).unwrap();
              await dispatch(getAllRequests());
              await dispatch(getMyChats());
            } catch (error: any) {
              console.log(error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  const handleRejectRequest = () => {
    Alert.alert(
      "Delete request",
      "Do you want to reject the request?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Reject",
          onPress: async () => {
            try {
              const data = await dispatch(
                acceptRequest({ requestId, accept: false })
              ).unwrap();
              console.log("Accepted:", data);
              dispatch(getAllRequests());
            } catch (err) {
              console.error("Accept request failed:", err);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

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
        <TouchableOpacity onPress={handleRejectRequest}>
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
    backgroundColor: "#f8f8f8",
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
