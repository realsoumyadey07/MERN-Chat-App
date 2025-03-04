import {
  Button,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "@/components/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/redux/slices/auth.slice";
import { store } from "@/redux/store";



const handleUserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<typeof store.dispatch>();
  const {isLoading, loginUserData, error} = useSelector((state: any )=> state.auth );
  const handleLogin = () => {
    dispatch(login({email, password}));
  };
  useEffect(()=> {
    if(!error && loginUserData) {
      router.replace("/conversations");
    }
  },[loginUserData, error]);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/login.jpg")}
        style={styles.image}
      >
        <LinearGradient
          colors={[
            "transparent",
            "rgba(255, 255, 255, 0.7)",
            "rgba(255, 255, 255, 1)",
          ]}
          style={styles.gradient}
        />
      </ImageBackground>
      <View style={styles.buttonContainer}>
        <Text style={styles.heading}>MERN Chat App</Text>
        <Text style={styles.text}>
          A chat app where you can have unlimited chats...
        </Text>
        <View style={{marginTop: 20}}>
          <TextInput
            placeholder="Enter your email here..."
            onChangeText={(e)=> setEmail(e)}
            style={styles.input}
          />
          <TextInput
            placeholder="Enter your password here..."
            onChangeText={(e)=> setPassword(e)}
            style={styles.input}
          />
        </View>
        <CustomButton
          title="Login"
          handleSubmit={handleLogin}
          textStyle={styles.buttonText}
          buttonStyle={styles.buttonStyle}
        />
        <TouchableOpacity
          onPress={() => router.push("/signup")}
          style={{ marginTop: 10 }}
        >
          <Text style={{ color: "blue" }}>Don't have an account?</Text>
        </TouchableOpacity>
      </View>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
    </SafeAreaView>
  );
};

export default handleUserLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    width: 400,
    height: 400,
    position: "absolute",
    top: 0,
  },
  gradient: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "30%", // Adjust the height to control the blur area
  },
  buttonContainer: {
    marginTop: 40,
    paddingHorizontal: 10,
  },
  heading: {
    fontWeight: 600,
    fontSize: 24,
    color: "#3b3b3b",
  },
  text: {
    color: "#474747",
    fontSize: 15,
  },
  buttonStyle: {
    backgroundColor: "#141414",
    paddingVertical: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    color: "gray",
    borderWidth: 1,
    borderColor: "gray",
  },
});
