import React, { useEffect } from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import UserComponent from "@/components/UserComponent";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "@/redux/slices/auth.slice";
import { AppDispatch } from "@/redux/store";
import { View, TouchableOpacity, Platform } from "react-native";

const TabNavigator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getUserData());
  }, []);
  const { userData, isLoading, error } = useSelector(
    (state: any) => state.auth
  );
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#141414",
        tabBarInactiveTintColor: "#807e7e",
        tabBarStyle: {
          height: 60,
          backgroundColor: "#fff", // ensure this is set to white
          paddingTop: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 15,
          marginHorizontal: 15,
          borderRadius: 10,
        },
        tabBarButton: (props) => {
          const filteredProps = Object.fromEntries(
            Object.entries(props).filter(([_, v]) => v !== null)
          );
          return (
            <TouchableOpacity
              {...filteredProps}
              activeOpacity={1}
              style={[props.style, { backgroundColor: "transparent" }]}
              {...(Platform.OS === "android"
                ? { android_ripple: { color: "transparent" } }
                : {})}
            />
          );
        },
        tabBarItemStyle: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        },
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: "#f5f5f5"
        }
      }}
    >
      <Tabs.Screen
        name="conversations"
        options={{
          title: "Conversations",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 35,
                height: 35,
                borderRadius: 8,
                backgroundColor: focused ? "#5091fa" : "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="chatbox-outline"
                size={20}
                color={focused ? "white" : "black"}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="group"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 35,
                height: 35,
                borderRadius: 8,
                backgroundColor: focused ? "#5091fa" : "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Feather
                name="users"
                size={20}
                color={focused ? "white" : "black"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 35,
                height: 35,
                borderRadius: 8,
                backgroundColor: focused ? "#5091fa" : "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AntDesign
                name="profile"
                size={20}
                color={focused ? "white" : "black"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 35,
                height: 35,
                borderRadius: 8,
                backgroundColor: focused ? "#5091fa" : "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <UserComponent
                letter={userData?.username[0].toUpperCase() || "U"}
              />
            </View>
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default TabNavigator;
