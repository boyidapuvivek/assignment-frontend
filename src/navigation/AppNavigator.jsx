import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { useAuth } from "../context/AuthContext"
import LoginScreen from "../screens/LoginScreen"
import DrawerNavigator from "./DrawerNavigator"
import { ActivityIndicator, View } from "react-native"

const Stack = createStackNavigator()

export default function AppNavigator() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator
          size='large'
          color='#2196F3'
        />
      </View>
    )
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen
          name='Main'
          component={DrawerNavigator}
        />
      ) : (
        <Stack.Screen
          name='Login'
          component={LoginScreen}
        />
      )}
    </Stack.Navigator>
  )
}
