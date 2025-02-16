import React from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

interface TabIconProps {
  iconName: keyof typeof FontAwesome.glyphMap;
  color: string;
  focused: boolean;
  name: string;
}

const TabIcon: React.FC<TabIconProps> = ({
  iconName,
  color,
  focused,
  name,
}) => {
  return (
    <View
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      <FontAwesome name={iconName} size={24} color={color} />
      <Text
        style={{
          color: focused ? color : "gray",
          fontSize: 10,
          marginTop: 4,
        }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabNavigator: React.FC = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#141414",
        tabBarInactiveTintColor: "#807e7e",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#232533",
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
          alignItems: "center",
          justifyContent: "center",
        },
        tabBarItemStyle: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="conversations"
        options={{
          title: "Conversations",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              iconName="comment"
              color={color}
              focused={focused}
              name="Chats"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="group"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              iconName="users"
              color={color}
              focused={focused}
              name="Groups"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              iconName="user"
              color={color}
              focused={focused}
              name="Profile"
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabNavigator;
