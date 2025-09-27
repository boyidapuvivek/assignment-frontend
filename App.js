import "./global.css"
import React, { useEffect, useState, useCallback } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { AuthProvider } from "./src/context/AuthContext"
import AppNavigator from "./src/navigation/AppNavigator"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import * as Linking from "expo-linking"
import { PaperProvider } from "react-native-paper"
import * as SplashScreen from "expo-splash-screen"
import * as Font from "expo-font"

SplashScreen.preventAutoHideAsync()

const prefix = Linking.createURL("/")
const linking = {
  prefixes: [prefix, "com.connectree.mobile", "https://dev.connectree.co"],
  config: {
    screens: {
      Main: "main",
      TeamCards: "teamcards",
      BusinessCards: "businesscards",
      MyCard: "mycards",
      SavedCards: "savedcards",
      LeadsScreen: "leads",
      Profile: "profile",
      ViewCard: "card/:cardId",
    },
  },
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false)

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: process.env.IOSCLIENTID,
      webClientId: process.env.WEBCLIENTID,
    })

    const loadFonts = async () => {
      await Font.loadAsync({
        "Poppins-Black": require("./assets/fonts/Poppins/Poppins-Black.ttf"),
        "Poppins-BlackItalic": require("./assets/fonts/Poppins/Poppins-BlackItalic.ttf"),
        "Poppins-Bold": require("./assets/fonts/Poppins/Poppins-Bold.ttf"),
        "Poppins-BoldItalic": require("./assets/fonts/Poppins/Poppins-BoldItalic.ttf"),
        "Poppins-ExtraBold": require("./assets/fonts/Poppins/Poppins-ExtraBold.ttf"),
        "Poppins-ExtraBoldItalic": require("./assets/fonts/Poppins/Poppins-ExtraBoldItalic.ttf"),
        "Poppins-ExtraLight": require("./assets/fonts/Poppins/Poppins-ExtraLight.ttf"),
        "Poppins-ExtraLightItalic": require("./assets/fonts/Poppins/Poppins-ExtraLightItalic.ttf"),
        "Poppins-Italic": require("./assets/fonts/Poppins/Poppins-Italic.ttf"),
        "Poppins-Light": require("./assets/fonts/Poppins/Poppins-Light.ttf"),
        "Poppins-LightItalic": require("./assets/fonts/Poppins/Poppins-LightItalic.ttf"),
        "Poppins-Medium": require("./assets/fonts/Poppins/Poppins-Medium.ttf"),
        "Poppins-MediumItalic": require("./assets/fonts/Poppins/Poppins-MediumItalic.ttf"),
        "Poppins-Regular": require("./assets/fonts/Poppins/Poppins-Regular.ttf"),
        "Poppins-SemiBold": require("./assets/fonts/Poppins/Poppins-SemiBold.ttf"),
        "Poppins-SemiBoldItalic": require("./assets/fonts/Poppins/Poppins-SemiBoldItalic.ttf"),
        "Poppins-Thin": require("./assets/fonts/Poppins/Poppins-Thin.ttf"),
        "Poppins-ThinItalic": require("./assets/fonts/Poppins/Poppins-ThinItalic.ttf"),
      })
      setFontsLoaded(true)
    }

    loadFonts().catch((err) => console.error("Error loading fonts", err))
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <GestureHandlerRootView
      style={{ flex: 1 }}
      onLayout={onLayoutRootView}>
      <PaperProvider>
        <AuthProvider>
          <NavigationContainer linking={linking}>
            <AppNavigator />
          </NavigationContainer>
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  )
}
