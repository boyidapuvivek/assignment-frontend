import React, { useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { AuthProvider } from "./src/context/AuthContext"
import AppNavigator from "./src/navigation/AppNavigator"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import * as Linking from "expo-linking"

const prefix = Linking.createURL("/")

const linking = {
  prefixes: [
    prefix,
    "com.connectree.mobile://",
    "https://preeminent-kleicha-70bb07.netlify.app",
  ],
  config: {
    screens: {
      Profile: "profile",
      Main: "main",
    },
  },
}

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
        <NavigationContainer linking={linking}>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  )
}

// useEffect(() => {
//   // Handle initial URL when app opens from deep link
//   const getInitialURL = async () => {
//     const initialUrl = await Linking.getInitialURL()
//     if (initialUrl) {
//       console.log("🔗 App opened with URL:", initialUrl)
//     }
//   }

//   // Handle URL changes when app is already running
//   const handleDeepLink = (event) => {
//     console.log("🔗 Deep link received:", event.url)
//   }

//   getInitialURL()
//   const subscription = Linking.addEventListener("url", handleDeepLink)

//   return () => subscription?.remove()
// }, [])
