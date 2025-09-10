import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons"
import MyCardScreen from "../screens/MyCardScreen"
import TeamCardsScreen from "../screens/TeamCardsScreen"
import BusinessCardsScreen from "../screens/BusinessCardsScreen"
import { COLORS } from "../utils/constants"
import SavedCardsScreen from "../screens/SavedCardsScreen"
import LeadsScreen from "../screens/LeadsScreen"

const Tab = createBottomTabNavigator()

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2196F3",
        tabBarInactiveTintColor: "#666",
      }}
      initialRouteName='MyCard'>
      <Tab.Screen
        name='TeamCards'
        component={TeamCardsScreen}
        options={{
          title: "Team Cards",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='people'
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name='BusinessCards'
        component={BusinessCardsScreen}
        options={{
          title: "Business Cards",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='business'
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name='MyCard'
        component={MyCardScreen}
        options={{
          title: "My Card",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='person'
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name='SavedCards'
        component={SavedCardsScreen}
        options={{
          title: "Saved Cards",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name='cards-playing-heart-multiple-outline'
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name='LeadsScreen'
        component={LeadsScreen}
        options={{
          title: "Leads",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name='leaderboard'
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  )
}
