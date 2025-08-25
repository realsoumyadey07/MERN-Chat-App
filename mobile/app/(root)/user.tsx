import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  ToastAndroid,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, logout } from "@/redux/slices/auth.slice";
import { AppDispatch } from "@/redux/store";
import { router } from "expo-router";
import UserComponent from "@/components/UserComponent";

const User = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { userData, error, isLoading } = useSelector(
    (state: any) => state.auth
  );

  const loadUserData = async () => {
    try {
      await dispatch(getUserData()).unwrap();
    } catch (err: any) {
      ToastAndroid.show("Failed to load user data", ToastAndroid.SHORT);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadUserData();
  }, []);

  if (!userData) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return ToastAndroid.show(error, ToastAndroid.LONG);
  }

  console.log("userData in user screen: ", userData);
  const handleSignOut = () => {
    try {
      Alert.alert(
        "Sign out",
        "Are you sure you want to sign out?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Sign Out",
            onPress: async () => {
              try {
                console.log("Sign Out Pressed");
                await dispatch(logout()).unwrap();
                ToastAndroid.show(
                  "User successfully logged out!",
                  ToastAndroid.SHORT
                );
                router.push("/(auth)/login");
              } catch (err: any) {
                ToastAndroid.show("Logout failed!", ToastAndroid.SHORT);
                console.error(err);
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error: any) {
      console.log(error);
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };
  return (
    <>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.profilePictureContainer}>
            <UserComponent letter={userData?.username[0]} size={150} />
            <TouchableOpacity style={styles.cameraIcon}>
              <Ionicons name="camera" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{userData?.username}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Username</Text>
            <Text style={styles.sectionContent}>{userData?.status}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Email</Text>
            <Text style={styles.sectionContent}>{userData?.email}</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleSignOut}>
            <Text style={styles.editButtonText}>Sign out</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5", // light gray for clean background
    padding: 20,
    paddingTop: 70,
    alignItems: "center",
  },
  profilePictureContainer: {
    position: "relative",
    marginBottom: 20,
  },
  profilePicture: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: "#E5E7EB", // subtle border around profile
  },
  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#5091fa",
    borderRadius: 20,
    padding: 6,
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
  editButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 30,
    elevation: 3,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // match screen bg
  },
});
