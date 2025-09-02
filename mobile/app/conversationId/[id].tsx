import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getMyChatDetails, getMyMessages, resetMessages } from "@/redux/slices/chat.slice";
import { useLocalSearchParams } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import UserComponent from "@/components/UserComponent";
import { io } from "socket.io-client";

const ConversationId = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [userMessage, setUserMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { myChatDetails, messageData } = useSelector(
    (state: any) => state.chat
  );
  const { userData } = useSelector((state: any) => state.auth);

  const [socket, setSocket] = useState<any>(null);

  const messagesEndRef = useRef<FlatList>(null);

  // Setup socket
  useEffect(() => {
    const newSocket = io(process.env.EXPO_PUBLIC_BASE_URL_SOCKET as string, {
      withCredentials: true,
    });
    setSocket(newSocket);
    newSocket.on("NEW_MESSAGE", (newMessage) => {
    // Update redux store or refetch messages
    if (newMessage.chatId === id) {
      dispatch(getMyMessages(id as string)); 
    }
  });

    return () => {
      newSocket.disconnect();
      newSocket.off("NEW_MESSAGE", () => {});
    };
  }, []);

  // Fetch chat details
  useEffect(() => {
    dispatch(resetMessages())
    dispatch(getMyMessages(id as string));
    dispatch(getMyChatDetails(id as string));
  }, [dispatch, id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollToEnd({ animated: true });
    }
  }, [messageData]);

  // Send message
  const handleSendMessage = () => {
    if (!userMessage.trim()) return;
    const members = myChatDetails?.chat?.members;
    socket?.emit("NEW_MESSAGE", { chatId: id, members, message: userMessage });
    setUserMessage("");
    dispatch(getMyMessages(id as string));
  };

  if (!myChatDetails) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <TouchableOpacity onPress={() => router.back()}>
                <AntDesign name="arrowleft" size={24} color="#404040" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/profileId/[id]",
                    params: { id: myChatDetails?.otherMember?._id },
                  })
                }
              >
                <UserComponent
                  letter={
                    myChatDetails?.chat?.groupChat
                      ? myChatDetails?.chat?.name?.charAt(0).toUpperCase()
                      : myChatDetails?.otherMember?.username
                          ?.charAt(0)
                          .toUpperCase() || "U"
                  }
                />
              </TouchableOpacity>
              <Text style={styles.headerText}>
                {myChatDetails?.chat?.groupChat
                  ? myChatDetails?.chat?.name
                  : myChatDetails?.otherMember?.username}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <TouchableOpacity>
                <Feather name="video" size={24} color="#404040" />
              </TouchableOpacity>
              <TouchableOpacity>
                <MaterialIcons name="call" size={24} color="#404040" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Messages */}
          <FlatList
            ref={messagesEndRef}
            data={messageData}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageContainer,
                  item?.sender?._id === userData?._id
                    ? styles.myMessageWrapper
                    : styles.otherMessageWrapper,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    item?.sender?._id === userData?._id
                      ? styles.myMessage
                      : styles.otherMessage,
                  ]}
                >
                  {item?.content}
                </Text>
              </View>
            )}
            contentContainerStyle={styles.messageSection}
            onContentSizeChange={()=> messagesEndRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
          />

          {/* Input Section */}
          <View style={styles.textInputSection}>
            <TouchableOpacity>
              <MaterialIcons name="emoji-emotions" size={24} color="#404040" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="attach" size={24} color="#404040" />
            </TouchableOpacity>
            <TextInput
              placeholder="Type a message"
              style={styles.textInput}
              value={userMessage}
              onChangeText={(text) => setUserMessage(text)}
            />
            {userMessage ? (
              <TouchableOpacity onPress={handleSendMessage}>
                <FontAwesome name="send" size={20} color="#404040" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity>
                <FontAwesome name="microphone" size={24} color="#404040" />
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ConversationId;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#292929",
  },
  messageSection: {
    flexGrow: 1,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  textInputSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 30,
    marginBottom: Platform.OS === "ios" ? 10 : 0,
  },
  textInput: {
    flex: 1,
    marginRight: 10,
  },
  messageContainer: {
    backgroundColor: "#e5e7eb", // gray
    marginVertical: 4,
    maxWidth: "75%",
    padding: 8,
  },
  myMessageWrapper: {
    alignSelf: "flex-end",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 0,
  },
  otherMessageWrapper: {
    alignSelf: "flex-start",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 8,
  },
  myMessage: {
    color: "black",
    borderTopRightRadius: 0,
  },
  otherMessage: {
    color: "black",
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
  },
});
