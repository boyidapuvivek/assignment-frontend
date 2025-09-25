import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import AuthScreen from "@screens/auth/AuthScreen"
import OTPScreen from "@screens/auth/OTPScreen"

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
        component={AuthScreen}
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
