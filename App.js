import React, { useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { AuthProvider } from "./src/context/AuthContext"
import AppNavigator from "./src/navigation/AppNavigator"
import { GoogleSignin } from "@react-native-google-signin/google-signin"

export default function App() {
  useEffect(() => {
    GoogleSignin.configure({
      iosClientId:
        "http://927800798267-7vk3l0b8pd0rp9qsohnruu9blndkin1r.apps.googleusercontent.com",
      webClientId:
        "http://927800798267-osn2cmpqovt0rnmh6aspnrte5clf54o4.apps.googleusercontent.com",
    })
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  )
}
