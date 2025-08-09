import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons"; 
import { Ionicons } from "@expo/vector-icons"; 
import { Entypo } from "@expo/vector-icons"; 

import DashboardScreen from "./DashboardScreen";
import StatisticsScreen from "./StatisticsScreen";
import MoreScreen from "./MoreScreen";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#111418",
        tabBarInactiveTintColor: "#60758a",
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color }) => <Feather name="list" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          tabBarLabel: "Estadísticas",
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          tabBarLabel: "Más",
          tabBarIcon: ({ color }) => <Entypo name="dots-three-horizontal" size={20} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
