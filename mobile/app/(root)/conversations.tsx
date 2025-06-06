import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import ConversationsComp from "@/components/ConversationsComp";
import { useDispatch, useSelector } from "react-redux";
import { getMyChats } from "@/redux/slices/chat.slice";
import { AppDispatch } from "@/redux/store";

const Conversations = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { myChatsData } = useSelector((state: any) => state.chat);
  const dispatch = useDispatch<AppDispatch>();

  const handleLoadChats = (): void => {
    setRefreshing(true);
    try {
      dispatch(getMyChats());
    } catch (error: any) {
      Alert.alert(error.message);
    } finally {
      setRefreshing(false);
    }
  };
  useEffect(() => {
    handleLoadChats();
  }, [dispatch]);
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Search your chats..."
          style={styles.input}
          placeholderTextColor="gray"
        />
        <TouchableOpacity>
          <FontAwesome
            name="search"
            size={25}
            color="#ababab"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={myChatsData}
        renderItem={({ item }) => <ConversationsComp {...item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleLoadChats} />
        }
      />
    </View>
  );
};

export default Conversations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#f5f5f5",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
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
    borderRadius: 10,
  },
  messageSection: {
    width: "60%",
  },
});
