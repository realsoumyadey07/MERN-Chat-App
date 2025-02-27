import React from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
  } from "react-native";
  import { FontAwesome5, Ionicons } from "@expo/vector-icons";

const user = () => {
    const user = {
        name: "Soumya Dey",
        about: "Realsoumyadey",
        phoneNumber: "soumyadipdey802@gmail.com",
        profilePicture: require("../../assets/images/user-logo.png"), // Replace with actual image URL
      };
      const handleSignOut = ()=> {
        Alert.alert("Sign out", "Are you sure you want to sign out?");
      }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profilePictureContainer}>
        <Image source={user.profilePicture } style={styles.profilePicture} />
        <TouchableOpacity style={styles.cameraIcon}>
          <Ionicons name="camera" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.userName}>{user.name}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Username</Text>
        <Text style={styles.sectionContent}>{user.about}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Email</Text>
        <Text style={styles.sectionContent}>{user.phoneNumber}</Text>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={handleSignOut}>
        <Text style={styles.editButtonText}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default user

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
      backgroundColor: "#000",
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 25,
      marginTop: 20,
    },
    editButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
  });