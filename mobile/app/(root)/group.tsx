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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getMyGroupByName, getMyGroups } from "@/redux/slices/chat.slice";
import ConversationsComp from "@/components/ConversationsComp";
import CustomEmptyChat from "@/components/CustomEmptyChat";

const group = () => {
  const [groupName, setGroupName] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { myGroupsData, isLoading } = useSelector((state: any) => state.chat);

  const handleLoadGroups = (): void => {
    setRefreshing(true);
    try {
      if (groupName !== "") {
        dispatch(getMyGroupByName(groupName));
      } else {
        dispatch(getMyGroups());
      }
    } catch (error: any) {
      Alert.alert(error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearch = (): void => {
    if (groupName !== "") {
      dispatch(getMyGroupByName(groupName));
    }
  };

  useEffect(() => {
    handleLoadGroups();
  }, [dispatch]);
  console.log("My group data: ", myGroupsData);
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Search your chats..."
          style={styles.input}
          placeholderTextColor="gray"
          onChangeText={(e) => {
            setGroupName(e);
            dispatch(getMyGroupByName(e));
            if (e === "") {
              dispatch(getMyGroups());
            }
          }}
        />
        <TouchableOpacity onPress={handleSearch}>
          <FontAwesome
            name="search"
            size={25}
            color="#ababab"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={myGroupsData}
        renderItem={({ item }) => <ConversationsComp {...item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleLoadGroups}
          />
        }
        ListEmptyComponent={
          <CustomEmptyChat
            title="No Group found!"
            description="Please create a group to start chatting."
          />
        }
      />
    </View>
  );
};

export default group;

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
