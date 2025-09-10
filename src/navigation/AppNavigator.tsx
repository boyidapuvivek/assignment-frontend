import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { useAuth } from "../context/AuthContext"
import AuthNavigator from "./AuthNavigator"
import BottomTabNavigator from "./BottomTabNavigator"
import { ActivityIndicator, View } from "react-native"

const Stack = createStackNavigator()

export default function AppNavigator() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator
          size='large'
          color='#4A90E2'
        />
      </View>
    )
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen
          name='Main'
          component={BottomTabNavigator}
        />
      ) : (
        <Stack.Screen
          name='Auth'
          component={AuthNavigator}
        />
      )}
    </Stack.Navigator>
  )
}
