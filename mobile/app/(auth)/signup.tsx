import {
  Alert,
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
import { store } from "@/redux/store";
import { registration } from "@/redux/slices/auth.slice";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Validation Schema
const schema = yup.object({
  username: yup.string().required("Username is required!"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one numeric digit")
    .matches(
      /[!@#$%^&*(),.?\":{}|<>]/,
      "Password must contain at least one special character"
    ),
});
const Signup = () => {
  const [screen, setScreen] = useState<"Login" | "Registration">("Login");
  const dispatch = useDispatch<typeof store.dispatch>();
  const { registerUserData, error, isLoading } = useSelector(
    (state: any) => state.auth
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    dispatch(registration(data));
  };

  useEffect(() => {
    if (!isLoading && registerUserData) {
      Alert.alert(
        "User registered successfully",
        "Go to login screen and make login to continue",
        [
          {
            text: "Go to Login",
            onPress: () => router.replace("/login"),
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
    }
  }, [registerUserData]);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/sign-up.jpg")}
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
        <>
          <View style={{ marginTop: 20 }}>
            {/* Username Field */}
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    placeholder="Enter your username here..."
                    onChangeText={onChange}
                    value={value}
                    style={styles.input}
                  />
                  {errors.username && (
                    <Text style={styles.errorText}>
                      {errors.username.message}
                    </Text>
                  )}
                </>
              )}
            />

            {/* Email Field */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    placeholder="Enter your email here..."
                    onChangeText={onChange}
                    value={value}
                    style={styles.input}
                  />
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email.message}</Text>
                  )}
                </>
              )}
            />

            {/* Password Field */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    placeholder="Enter your password here..."
                    secureTextEntry
                    onChangeText={onChange}
                    value={value}
                    style={styles.input}
                  />
                  {errors.password && (
                    <Text style={styles.errorText}>
                      {errors.password.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>

          {/* Signup Button */}
          <CustomButton
            title="Signup"
            handleSubmit={handleSubmit(onSubmit)}
            textStyle={styles.buttonText}
            buttonStyle={styles.buttonStyle}
          />

          <TouchableOpacity
            onPress={() => router.push("../conversations")}
            style={{ marginTop: 10 }}
          >
            <Text style={{ color: "blue" }}>Do you have an account?</Text>
          </TouchableOpacity>
        </>
      </View>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
    </SafeAreaView>
  );
};

export default Signup;

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
    height: "30%",
  },
  buttonContainer: {
    marginTop: 40,
    paddingHorizontal: 10,
  },
  heading: {
    fontWeight: "600",
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
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
