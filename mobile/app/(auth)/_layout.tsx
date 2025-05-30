import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="login" options={{headerShown: false}} />
      </Stack>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
    </>
  );
};

export default AuthLayout;
