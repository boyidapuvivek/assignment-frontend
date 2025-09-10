import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import LoginScreen from "../screens/auth/LoginScreen"
import OTPScreen from "../screens/auth/OTPScreen"

const Stack = createStackNavigator()

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName='Login'
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}>
      <Stack.Screen
        name='Login'
        component={LoginScreen}
      />
      <Stack.Screen
        name='OTPScreen'
        component={OTPScreen}
        options={{
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  )
}
