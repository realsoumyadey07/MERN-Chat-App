import UserComponent from "@/components/UserComponent";
import { getUserDetails } from "@/redux/slices/auth.slice";
import { AppDispatch } from "@/redux/store";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  ToastAndroid,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function ProfileId() {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { userDetails, isLoading, error } = useSelector((state: any) => state.auth);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadUserDetails = async () => {
    try {
      if (typeof id === "string") {
        await dispatch(getUserDetails(id)).unwrap();
      }
    } catch (err: any) {
      ToastAndroid.show("Failed to load user details", ToastAndroid.SHORT);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserDetails();
    setRefreshing(false);
  };

  useEffect(() => {
    loadUserDetails();
  }, [id]);

  if (isLoading && !userDetails) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    ToastAndroid.show(error, ToastAndroid.LONG);
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.profilePictureContainer}>
        <UserComponent letter={userDetails?.username[0]} size={150} />
      </View>

      <Text style={styles.userName}>{userDetails?.username}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Username</Text>
        <Text style={styles.sectionContent}>{userDetails?.status}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Email</Text>
        <Text style={styles.sectionContent}>{userDetails?.email}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5", // consistent with User screen
    padding: 20,
    paddingTop: 70,
    alignItems: "center",
  },
  profilePictureContainer: {
    position: "relative",
    marginBottom: 20,
  },
  userName: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 25,
    color: "#111827", // near-black
  },
  section: {
    width: "100%",
    marginBottom: 18,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB", // subtle divider
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280", // gray text
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionContent: {
    fontSize: 17,
    color: "#111827",
    fontWeight: "500",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});
