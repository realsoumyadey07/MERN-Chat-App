import ConversationsComp from "@/components/ConversationsComp";
import CustomEmptyChat from "@/components/CustomEmptyChat";
import FriendRequest from "@/components/FriendRequest";
import FriendSuggestion from "@/components/FriendSuggestion";
import {
  getAllRequests,
  getAllSuggestions,
  getRequestByName,
  getSuggestionByName,
} from "@/redux/slices/user.slice";
import { AppDispatch } from "@/redux/store";
import { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function Friends() {
  const [screen, setScreen] = useState<"Requests" | "Suggestions">("Requests");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchRequest, setSearchRequest] = useState<string>("");
  const [searchSuggestion, setSearchSuggestion] = useState<string>("");
  const { requests, suggestions } = useSelector((state: any) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  // Search handling for Requests
  useEffect(() => {
    handleLoad();
  }, [searchRequest, searchSuggestion, screen, dispatch]);

  const handleLoad = () => {
    setRefreshing(true);
    if (screen === "Requests") {
      if (searchRequest.trim() === "") {
        dispatch(getAllRequests());
      } else {
        dispatch(getRequestByName(searchRequest));
      }
    } else {
      if (searchSuggestion.trim() === "") {
        dispatch(getAllSuggestions());
      } else {
        dispatch(getSuggestionByName(searchSuggestion));
      }
    }
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.inputContainer}>
        {screen === "Requests" ? (
          <TextInput
            placeholder="Search requests..."
            placeholderTextColor="gray"
            style={styles.input}
            value={searchRequest}
            onChangeText={(e) => setSearchRequest(e)}
          />
        ) : (
          <TextInput
            placeholder="Search new connections..."
            placeholderTextColor="gray"
            style={styles.input}
            value={searchSuggestion}
            onChangeText={(e) => setSearchSuggestion(e)}
            // TODO: Add search functionality for suggestions if needed
          />
        )}
      </View>

      {/* Header Tabs */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setScreen("Requests")}>
          <Text
            style={[
              styles.headerText,
              screen === "Requests" && { fontWeight: "bold" },
            ]}
          >
            Requests
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setScreen("Suggestions")}>
          <Text
            style={[
              styles.headerText,
              screen === "Suggestions" && { fontWeight: "bold" },
            ]}
          >
            Suggestions
          </Text>
        </TouchableOpacity>
      </View>

      {/* Data List */}
      {screen === "Requests" ? (
        <FlatList
          data={requests || []}
          renderItem={({ item }) => (
            <FriendRequest
              requestId={item._id}
              senderId={item?.sender?._id}
              title={item?.sender?.username}
            />
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<CustomEmptyChat title="No request found!" />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleLoad} />
          }
        />
      ) : (
        <FlatList
          data={suggestions || []}
          renderItem={({ item }) => (
            <FriendSuggestion
              userId={item._id}
              title={item.username}
              status={item.status}
            />
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<CustomEmptyChat title="No suggestion found!" />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleLoad} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    padding: 12,
  },
  headerText: {
    fontSize: 17,
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
  input: {
    flex: 1,
    fontSize: 16,
    color: "black",
  },
});
