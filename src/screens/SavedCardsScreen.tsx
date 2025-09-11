import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Alert,
  RefreshControl,
  ScrollView,
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import CardList from "../components/CardList"
import LoadingSpinner from "../components/LoadingSpinner"
import { COLORS } from "../utils/constants"
import Header from "../components/Header"

interface SavedCard {
  _id: string
  user_id: string
  name: string
  email: string
  phone: string
  company: string
  role: string
  profile_image?: string
  business_description?: string
  business_phone?: string
  business_email?: string
  business_cover_photo?: string
  business_logo?: string
  website?: string
  address?: string
  linkedin_url?: string
  twitter_url?: string
  facebook_url?: string
  instagram_url?: string
  youtube_url?: string
  custom_notes?: string
  theme: string
  services: Array<{
    id: string
    name: string
    price: string
    duration?: string
    category?: string
    description?: string
  }>
  products: Array<{
    id: string
    name: string
    price: string
    category?: string
    description?: string
    image?: string
  }>
  gallery: string[]
  qr_code?: string
  views: number
  created_at: string
  updated_at: string
  saved_at?: string
}

const API_BASE_URL = "http://192.168.3.172:5000/api"

export default function SavedCardsScreen() {
  const { user, token } = useAuth()
  const [savedCards, setSavedCards] = useState<SavedCard[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchSavedCards()
  }, [])

  const fetchSavedCards = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/business-cards/saved`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data && Array.isArray(response.data)) {
        setSavedCards(response.data)
      } else if (
        response.data?.savedCards &&
        Array.isArray(response.data.savedCards)
      ) {
        setSavedCards(response.data.savedCards)
      } else {
        setSavedCards([])
      }
    } catch (error) {
      console.error("Error fetching saved cards:", error)
      Alert.alert(
        "Error",
        "Failed to fetch saved cards. Please check your connection and try again."
      )
      setSavedCards([])
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchSavedCards()
    setRefreshing(false)
  }

  const handleRemoveCard = async (cardId: string) => {
    Alert.alert(
      "Remove Saved Card",
      "Are you sure you want to remove this card from your saved collection?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              // You can implement unsave API call here if needed
              // await axios.delete(`${API_BASE_URL}/business-cards/saved/${cardId}`, {
              //   headers: { Authorization: `Bearer ${token}` }
              // })

              // For now, just remove from local state
              setSavedCards((prev) =>
                prev.filter((card) => card._id !== cardId)
              )
              Alert.alert("Success", "Card removed from saved collection!")
            } catch (error) {
              Alert.alert("Error", "Failed to remove saved card")
            }
          },
        },
      ]
    )
  }

  const formatServicesForDisplay = (services: SavedCard["services"]) => {
    return services.map((service) => ({
      name: service.name,
      description: service.description || "Professional service",
      price: parseFloat(service.price) || 0,
    }))
  }

  const formatProductsForDisplay = (products: SavedCard["products"]) => {
    return products.map((product) => ({
      name: product.name,
      description: product.description || "Quality product",
      price: parseFloat(product.price) || 0,
    }))
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <Header />
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialIcons
              name='bookmark'
              size={32}
              color={COLORS.primary}
              style={styles.titleIcon}
            />
            <Text style={styles.headerTitle}>Saved Cards</Text>
          </View>
          <Text style={styles.subtitle}>
            {savedCards.length > 0
              ? `You have ${savedCards.length} saved card${
                  savedCards.length !== 1 ? "s" : ""
                }`
              : "No saved cards yet"}
          </Text>
        </View>
      </View>

      {/* Content Section */}
      {!loading ? (
        <View style={styles.contentWrapper}>
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            }
            showsVerticalScrollIndicator={false}>
            <View style={styles.dataContainer}>
              <CardList
                cards={savedCards.map((card) => ({
                  id: card._id,
                  name: card.name,
                  email: card.email,
                  phone: card.phone,
                  role: card.role,
                  company: card.company,
                  business_description: card.business_description,
                  business_phone: card.business_phone,
                  business_email: card.business_email,
                  website: card.website,
                  address: card.address,
                  services: formatServicesForDisplay(card.services),
                  products: formatProductsForDisplay(card.products),
                  gallery: card.gallery,
                  business_cover_photo: card.business_cover_photo,
                  profile_image: card.profile_image,
                  theme: card.theme,
                  linkedin_url: card.linkedin_url,
                  twitter_url: card.twitter_url,
                  facebook_url: card.facebook_url,
                  instagram_url: card.instagram_url,
                  youtube_url: card.youtube_url,
                }))}
                onDelete={handleRemoveCard}
                emptyMessage='No saved cards yet. Start saving interesting business cards you discover!'
                showDeleteButton={true}
              />
            </View>
          </ScrollView>
        </View>
      ) : (
        <LoadingSpinner />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 40,
  },
  headerContainer: {
    backgroundColor: COLORS.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  titleIcon: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 20,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  dataContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 20,
  },
})
