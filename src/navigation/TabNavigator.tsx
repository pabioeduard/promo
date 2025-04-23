import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PostarScreen from "../screens/PostarScreen";
import HomeStackNavigator from "./HomeStackNavigator";
import ContaStackNavigator from "./ContaStackNavigator";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Início") iconName = "home";
          else if (route.name === "Postar") iconName = "add-circle";
          else if (route.name === "Conta") iconName = "person";

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#f97316",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Início" component={HomeStackNavigator}  options={{ headerShown: false }} />
      <Tab.Screen name="Postar" component={PostarScreen} />
      <Tab.Screen name="Conta" component={ContaStackNavigator} options={{ headerShown: false }} />

    </Tab.Navigator>
  );
}
