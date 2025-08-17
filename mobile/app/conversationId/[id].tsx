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
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getMyChatDetails } from "@/redux/slices/chat.slice";
import { useLocalSearchParams } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import UserComponent from "@/components/UserComponent";

const ConversationId = () => {
  // Get the dynamic route parameter
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [userMessage, setUserMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { myChatDetails } = useSelector((state: any) => state.chat);
  useEffect(() => {
    if (typeof id === "string") {
      dispatch(getMyChatDetails(id));
    } else if (Array.isArray(id) && id.length > 0) {
      dispatch(getMyChatDetails(id[0]));
    }
  }, [dispatch, id]);

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
          <View style={styles.header}>
            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <TouchableOpacity onPress={() => router.back()}>
                <AntDesign name="arrowleft" size={24} color="black" />
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
                <Feather name="video" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity>
                <MaterialIcons name="call" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.messageSection}
          >
            
          </ScrollView>

          <View style={styles.textInputSection}>
            <TouchableOpacity>
              <MaterialIcons name="emoji-emotions" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="attach" size={24} color="black" />
            </TouchableOpacity>
            <TextInput
              placeholder="Type a message"
              style={styles.textInput}
              value={userMessage}
              onChangeText={(text) => setUserMessage(text)}
            />
            <TouchableOpacity>
              {userMessage ? (
                <TouchableOpacity>
                  <FontAwesome name="send" size={20} color="black" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity>
                  <FontAwesome name="microphone" size={24} color="black" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
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
  },
  messageSection: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  textInputSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "space-between",
    padding: 10,
    // backgroundColor: "#e3e3e3",
    borderRadius: 30,
    marginBottom: Platform.OS === "ios" ? 10 : 0,
  },
  textInput: {
    flex: 1,
    marginRight: 10,
  },
});
