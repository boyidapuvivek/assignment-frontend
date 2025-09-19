import React, { useState, useEffect } from "react"
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import CardDisplay from "../components/CardDisplay"
import { BASE_URL } from "../api/ClientApi"
import { useNavigation } from "@react-navigation/native"

const { height } = Dimensions.get("window")

export default function ViewCardScreen({ route }) {
  const { cardId } = route.params || {}
  const [cardData, setCardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigation = useNavigation()

  useEffect(() => {
    if (cardId) {
      console.log("🔗 ViewCard opened for card:", cardId)
      fetchCardData(cardId)
    } else {
      setError("Card ID not provided")
      setLoading(false)
      Alert.alert("Error", "Card ID not provided", [
        { text: "Go Back", onPress: () => navigation.goBack() },
      ])
    }
  }, [cardId])

  const fetchCardData = async (id) => {
    try {
      setLoading(true)
      setError(null)

      // Replace with your actual API base URL from your existing API setup
      const response = await fetch(`${BASE_URL}/business-cards/${id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch card data")
      }

      const data = await response.json()

      // Transform API data to match CardDisplay interface
      const transformedData = {
        _id: data._id,
        id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        role: data.role,
        profile_image: data.profile_image,
        address: data.address,
        business_email: data.business_email,
        business_phone: data.business_phone,
        business_cover_photo: data.business_cover_photo,
        business_description: data.business_description,
        website: data.website,
        linkedin_url: data.linkedin_url,
        twitter_url: data.twitter_url,
        facebook_url: data.facebook_url,
        instagram_url: data.instagram_url,
        youtube_url: data.youtube_url,
        services: data.services || [],
        products: data.products || [],
        gallery: data.gallery || [],
        qr_code: data.qr_code,
        isSaved: false, // You can check this from your saved cards API
        custom_notes: data.custom_notes,
      }

      setCardData(transformedData)
    } catch (err) {
      console.error("Error fetching card data:", err)
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load card data"
      setError(errorMessage)
      Alert.alert("Error", errorMessage, [
        { text: "Retry", onPress: () => fetchCardData(id) },
        { text: "Go Back", onPress: () => navigation.navigate("Main") },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSaveToggle = (cardId, isSaved) => {
    // Update local state when card is saved/unsaved
    setCardData((prev) => (prev ? { ...prev, isSaved } : null))
    console.log("Card save status changed:", cardId, isSaved)
  }

  const handleBack = () => {
    navigation.navigate("Main")
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
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => handleBack()}>
            <Ionicons
              name='arrow-back'
              size={24}
              color='#ffffff'
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Business Card</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size='large'
            color='#2196F3'
          />
          <Text style={styles.loadingText}>Loading business card...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error || !cardData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => handleBack()}>
            <Ionicons
              name='arrow-back'
              size={24}
              color='#ffffff'
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Business Card</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons
            name='alert-circle-outline'
            size={64}
            color='#ff6b6b'
          />
          <Text style={styles.errorTitle}>Card Not Found</Text>
          <Text style={styles.errorMessage}>
            {error ||
              "The business card you're looking for doesn't exist or has been removed."}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchCardData(cardId)}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => handleBack()}>
          <Ionicons
            name='arrow-back'
            size={24}
            color='#ffffff'
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Business Card</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Card Display Container */}
      <View style={styles.cardContainer}>
        <CardDisplay
          businessCard={cardData}
          onSaveToggle={handleSaveToggle}
          customizationSettings={customizationSettings}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2196F3",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },
  cardContainer: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  loadingText: {
    color: "#666666",
    fontSize: 16,
    marginTop: 16,
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingBottom: 100,
  },
  errorTitle: {
    color: "#333333",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  errorMessage: {
    color: "#666666",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
})
