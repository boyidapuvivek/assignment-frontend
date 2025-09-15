import React, { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  Alert,
  RefreshControl,
  ScrollView,
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { useFocusEffect } from "@react-navigation/native"
import { useAuth } from "../context/AuthContext"
import CardList from "../components/CardList"
import LoadingSpinner from "../components/LoadingSpinner"
import SearchBar from "../components/SearchBar"
import { COLORS } from "../utils/constants"
import Header from "../components/Header"
import { getData, deleteData } from "../api/apiServices"
import { endpoints } from "../api/ClientApi"

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

interface SavedCardsScreenProps {
  navigation: any
}

export default function SavedCardsScreen({
  navigation,
}: SavedCardsScreenProps) {
  const { user, token } = useAuth()
  const [savedCards, setSavedCards] = useState<SavedCard[]>([])
  const [filteredCards, setFilteredCards] = useState<SavedCard[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchSavedCards = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getData(endpoints.getSavedCards)
      let cards: SavedCard[] = []

      if (response.data && Array.isArray(response.data)) {
        cards = response.data
      } else if (
        response.data?.savedCards &&
        Array.isArray(response.data.savedCards)
      ) {
        cards = response.data.savedCards
      }

      setSavedCards(cards)
      setFilteredCards(cards)
    } catch (error) {
      console.error("Error fetching saved cards:", error)
      Alert.alert(
        "Error",
        "Failed to fetch saved cards. Please check your connection and try again."
      )
      setSavedCards([])
      setFilteredCards([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch data every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchSavedCards()
    }, [fetchSavedCards])
  )

  // Filter cards whenever searchQuery or savedCards change
  useEffect(() => {
    filterCards(searchQuery)
  }, [searchQuery, savedCards])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchSavedCards()
    setRefreshing(false)
  }

  const handleSaveToggle = async (cardId: string, isSaved: boolean) => {
    try {
      if (!isSaved) {
        // Card was unsaved, remove it from the list and refetch
        await fetchSavedCards()
      }
    } catch (error) {
      console.error("Error handling save toggle:", error)
      // Refetch data in case of error to ensure consistency
      await fetchSavedCards()
    }
  }

  const filterCards = (text: string) => {
    setSearchQuery(text)

    if (text === "") {
      setFilteredCards(savedCards)
      return
    }

    const filtered = savedCards.filter((card) => {
      const searchableFields = [
        card.name?.toLowerCase() || "",
        card.company?.toLowerCase() || "",
        card.role?.toLowerCase() || "",
        card.business_description?.toLowerCase() || "",
        card.email?.toLowerCase() || "",
        card.business_email?.toLowerCase() || "",
        card.phone || "",
        card.business_phone || "",
        card.address?.toLowerCase() || "",
        card.website?.toLowerCase() || "",
        card.custom_notes?.toLowerCase() || "",
        ...card.services.map((s) => s.name?.toLowerCase() || ""),
        ...card.products.map((p) => p.name?.toLowerCase() || ""),
      ]

      const searchText = text.toLowerCase()
      return searchableFields.some((field) => field.includes(searchText))
    })

    setFilteredCards(filtered)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setFilteredCards(savedCards)
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

  const getResultsText = () => {
    if (searchQuery === "") {
      return savedCards.length > 0
        ? `You have ${savedCards.length} saved card${
            savedCards.length !== 1 ? "s" : ""
          }`
        : "No saved cards yet"
    } else {
      return filteredCards.length > 0
        ? `Found ${filteredCards.length} saved card${
            filteredCards.length !== 1 ? "s" : ""
          } for "${searchQuery}"`
        : `No saved cards match "${searchQuery}"`
    }
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialIcons
              name='bookmark'
              size={32}
              color='#2196F3'
              style={styles.titleIcon}
            />
            <Text style={styles.headerTitle}>Saved Cards</Text>
          </View>
          <Text style={styles.subtitle}>
            {loading ? "Loading..." : getResultsText()}
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <SearchBar
        placeholder='Search by name, company, role, services...'
        value={searchQuery}
        onChangeText={filterCards}
        onClear={handleClearSearch}
        style={styles.searchBarContainer}
      />

      {/* Content Section */}
      <View style={styles.contentWrapper}>
        {!loading ? (
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }>
            <View style={styles.dataContainer}>
              <CardList
                cards={filteredCards.map((card) => ({
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
                  isSaved: true, // Mark all cards as saved since this is SavedCardsScreen
                }))}
                emptyMessage={
                  searchQuery === ""
                    ? "No saved cards yet. Start saving interesting business cards you discover!"
                    : `No saved cards match "${searchQuery}". Try adjusting your search terms.`
                }
                showSaveButton={true} // Enable save button only for SavedCardsScreen
                onSaveToggle={handleSaveToggle} // Handle save toggle callback
              />
            </View>
          </ScrollView>
        ) : (
          <LoadingSpinner />
        )}
      </View>
    </View>
  )
}

// Keep all existing styles
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
  searchBarContainer: {
    paddingBottom: 8,
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
    paddingTop: 12,
  },
})
