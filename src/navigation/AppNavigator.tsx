import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { useAuth } from "../context/AuthContext"
import AuthNavigator from "./AuthNavigator"
import BottomTabNavigator from "./BottomTabNavigator"
import ProfileScreen from "../screens/ProfileScreen"
import { ActivityIndicator, View } from "react-native"
import MyCardScreen from "../screens/MyCardScreen"
import DetailedCardScreen from "../screens/DetailedCardScreen"

const Stack = createStackNavigator()

export default function AppNavigator() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size='large' />
      </View>
    )
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen
            name='Main'
            component={BottomTabNavigator}
          />
          <Stack.Screen
            name='Profile'
            component={ProfileScreen}
          />
          <Stack.Screen
            name='DetailedCardScreen'
            component={DetailedCardScreen}
          />
        </>
      ) : (
        <Stack.Screen
          name='Auth'
          component={AuthNavigator}
        />
      )}
    </Stack.Navigator>
  )
}
