import { getUserDetails } from "@/redux/slices/auth.slice";
import { AppDispatch } from "@/redux/store";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function ProfileId() {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { userDetails } = useSelector((state: any) => state.auth);
  useEffect(() => {
    if (typeof id === "string") {
      dispatch(getUserDetails(id));
    }
  }, [id, dispatch]);
  if (!userDetails) {
    return <ActivityIndicator size={"large"} color="#0000ff" />; // or a loading indicator
  }
  // dummy data
  const user = {
    name: "Soumya Dey",
    about: "Realsoumyadey",
    phoneNumber: "soumyadipdey802@gmail.com",
    profilePicture: require("../../assets/images/user-logo.png"),
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profilePictureContainer}>
        <Image source={user.profilePicture} style={styles.profilePicture} />
        <TouchableOpacity style={styles.cameraIcon}>
          <Ionicons name="camera" size={24} color="#fff" />
        </TouchableOpacity>
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
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 70,
    alignItems: "center",
  },
  profilePictureContainer: {
    position: "relative",
    marginBottom: 20,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#000",
    borderRadius: 20,
    padding: 8,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    width: "100%",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#888",
    marginBottom: 5,
  },
  sectionContent: {
    fontSize: 18,
    color: "#000",
  },
  editButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
