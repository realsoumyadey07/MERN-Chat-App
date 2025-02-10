import Entypo from "@expo/vector-icons/Entypo";
import { Tabs } from "expo-router";
import { Image, Text, View } from "react-native";


interface TabIconInterface {
  icon: Object;
  color: string;
  name: string;
  focused: boolean;
}

const TabIcon = ({ icon, color, name, focused }: TabIconInterface) => {
  return (
    <View className="flex-1 justify-center items-center gap-1">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-5 h-5"
      />
      <Text
        className={`${focused ? "font-psemibol" : "font-pregular"}`}
        style={{
          color: color,
        }}
      >
        {name}
      </Text>
    </View>
  );
};

const Layout = () => {
  return (
    <>
      <Tabs screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#ffa001',
          tabBarInactiveTintColor: '#cdcde0',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 80,
          },
          headerShadowVisible: false
        }}>
        <Tabs.Screen
          name="conversations"
          options={{
            title: "conversations",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={Entypo} color={color} focused={focused} name="Chats" />
            ),
          }}
        />
        <Tabs.Screen name="group" />
        <Tabs.Screen name="user" />
      </Tabs>
    </>
  );
};

export default Layout;
