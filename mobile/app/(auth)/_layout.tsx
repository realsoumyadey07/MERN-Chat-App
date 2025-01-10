import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

const _layout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
      </Stack>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
    </>
  );
};

export default _layout;