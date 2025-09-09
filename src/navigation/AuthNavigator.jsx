import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import LoginScreen from "../screens/auth/LoginScreen"
import OTPScreen from "../screens/auth/OTPScreen"

const AuthStack = createStackNavigator()

export default function AuthNavigator() {
  return (
    <AuthStack.Navigator
      initialRouteName='Login'
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}>
      <AuthStack.Screen
        name='Login'
        component={LoginScreen}
      />
      <AuthStack.Screen
        name='OTPScreen'
        component={OTPScreen}
        options={{
          gestureEnabled: true,
        }}
      />
    </AuthStack.Navigator>
  )
}
