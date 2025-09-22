import React, { useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { AuthProvider } from "./src/context/AuthContext"
import AppNavigator from "./src/navigation/AppNavigator"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import * as Linking from "expo-linking"

const prefix = Linking.createURL("/")

const linking = {
  prefixes: [prefix, "com.connectree.mobile://", "https://dev.connectree.co"],
  config: {
    screens: {
      Main: {
        screens: {
          TeamCards: "teamcards",
          BusinessCards: "businesscards",
          MyCard: "mycards",
          SavedCards: "savedcards",
          LeadsScreen: "leads",
        },
      },
      Profile: "profile",
      ViewCard: "card/:cardId",
    },
  },
}

export default function App() {
  useEffect(() => {
    // Configure Google Sign-in
    GoogleSignin.configure({
      iosClientId:
        "927800798267-7vk3l0b8pd0rp9qsohnruu9blndkin1r.apps.googleusercontent.com",
      webClientId:
        "927800798267-osn2cmpqovt0rnmh6aspnrte5clf54o4.apps.googleusercontent.com",
    })

    // Handle initial deep link when app opens from closed state
    const getInitialURL = async () => {
      try {
        const initialUrl = await Linking.getInitialURL()
        if (initialUrl) {
          console.log("🔗 App opened with initial URL:", initialUrl)
        }
      } catch (error) {
        console.error("Error getting initial URL:", error)
      }
    }

    // Handle deep links when app is already running
    const handleDeepLink = (event) => {
      console.log("🔗 Deep link received while app running:", event.url)
    }

    // Set up deep link listeners
    getInitialURL()
    const subscription = Linking.addEventListener("url", handleDeepLink)

    // Cleanup function
    return () => {
      if (subscription?.remove) {
        subscription.remove()
      }
    }
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
