import { StyleSheet, View } from "react-native";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native";
import UserComponent from "./UserComponent";
import { useRouter } from "expo-router";
import { formatChatTime } from "@/utils/formatChatTime";

interface LatestMessage {
  _id: string;
  content: string;
  createdAt: Date;
}

interface ConversationProps {
  _id: string;
  name: string;
  latest_message?: LatestMessage;
  groupChat?: boolean;
  members?: string[];
}
export default function ConversationsComp(props: ConversationProps) {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.chatContainer}
      onPress={() => router.push(`/conversationId/${props._id}`)}
    >
      <UserComponent letter={props?.name?.charAt(0).toUpperCase() || "U"} />
      <View style={styles.messageSection}>
        <Text>{props.name ? props.name : "Name"}</Text>
        <Text>
          {props.latest_message?.content ? props.latest_message?.content : ""}
        </Text>
      </View>
      {props.latest_message && (
        <Text>{formatChatTime(props.latest_message?.createdAt!)}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "space-between",
    // backgroundColor: "#e8e8e8",
    padding: 15,
    borderRadius: 10,
  },
  messageSection: {
    width: "60%",
  },
});
