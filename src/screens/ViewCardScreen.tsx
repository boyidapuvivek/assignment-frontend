import React, { useState, useEffect } from "react"
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import CardDisplay from "../components/CardDisplay" // Adjust path as needed
import { getData } from "../api/apiServices" // Your existing API service
import { endpoints } from "../api/ClientApi" // Your existing endpoints

// Define the route parameters type
type ViewCardRouteProp = RouteProp<{ ViewCard: { cardId: string } }, "ViewCard">

type ViewCardNavigationProp = StackNavigationProp<
  { ViewCard: { cardId: string } },
  "ViewCard"
>

// BusinessCard interface (matching your CardDisplay component)
interface BusinessCard {
  id?: string
  _id?: string
  phone?: string
  email?: string
  address?: string
  company?: string
  businessemail?: string
  businessphone?: string
  website?: string
  linkedinurl?: string
  twitterurl?: string
  facebookurl?: string
  instagramurl?: string
  youtubeurl?: string
  services?: Array<{
    name: string
    description?: string
    price: number
  }>
  products?: Array<{
    name: string
    description?: string
    price: number
  }>
  gallery?: Array<{
    url: string
  }>
  businesscoverphoto?: string
  profileimage?: string
  name?: string
  role?: string
  businessdescription?: string
  isSaved?: boolean
  qrcode?: string
}

const ViewCardScreen: React.FC = () => {
  const navigation = useNavigation<ViewCardNavigationProp>()
  const route = useRoute<ViewCardRouteProp>()
  const { cardId } = route.params

  const [cardData, setCardData] = useState<BusinessCard | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  //   useEffect(() => {
  //     console.log("🔗 ViewCard screen opened with cardId:", cardId)

  //     if (cardId) {
  //       loadCardData(cardId)
  //     } else {
  //       setError("Card ID not provided")
  //       setLoading(false)
  //       Alert.alert("Error", "Card ID not provided", [
  //         { text: "Go Back", onPress: () => navigation.goBack() },
  //       ])
  //     }
  //   }, [cardId])

  const loadCardData = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      // Replace with your actual API endpoint
      const response = await getData(`${endpoints.getBussinessCardById}/${id}`)

      if (response.success) {
        setCardData(response.data)
      } else {
        throw new Error(response.message || "Failed to load card")
      }
    } catch (err) {
      console.error("Error loading card data:", err)
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load card data"
      setError(errorMessage)
      Alert.alert("Error", errorMessage, [
        { text: "Retry", onPress: () => loadCardData(id) },
        { text: "Go Back", onPress: () => navigation.goBack() },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSaveToggle = (cardId: string, isSaved: boolean) => {
    // Update local state to reflect the change
    setCardData((prev) => (prev ? { ...prev, isSaved } : null))
  }

  // Customization settings for the card display
  const customizationSettings = {
    primaryColor: "#2196F3",
    secondaryColor: "#3b82f6",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    showPersonalContact: true,
    showBusinessContact: true,
    showSocialMedia: true,
    showServices: true,
    showProducts: true,
    showGallery: true,
    showQR: true,
    enableAnimations: false,
    enableInteractions: true,
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle='dark-content'
          backgroundColor='#ffffff'
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size='large'
            color='#2196F3'
          />
        </View>
      </SafeAreaView>
    )
  }

  if (error || !cardData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle='dark-content'
          backgroundColor='#ffffff'
        />
        <View style={styles.errorContainer}>
          {/* Add your error UI here */}
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle='dark-content'
        backgroundColor='#ffffff'
      />
      <CardDisplay
        businessCard={cardData}
        onSaveToggle={handleSaveToggle}
        customizationSettings={customizationSettings}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
})

export default ViewCardScreen
