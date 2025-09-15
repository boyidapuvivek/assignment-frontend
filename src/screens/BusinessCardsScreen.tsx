// screens/BusinessCardsScreen.tsx
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
import { useAuth } from "../context/AuthContext"
import CardList from "../components/CardList"
import LoadingSpinner from "../components/LoadingSpinner"
import SearchBar from "../components/SearchBar"
import { COLORS } from "../utils/constants"
import Header from "../components/Header"
import { getData } from "../api/apiServices"
import { endpoints } from "../api/ClientApi"

interface BusinessCard {
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
}

interface BusinessCardsScreenProps {
  navigation: any
}

export default function BusinessCardsScreen({
  navigation,
}: BusinessCardsScreenProps) {
  const { user, token } = useAuth()
  const [businessCards, setBusinessCards] = useState<BusinessCard[]>([])
  const [filteredCards, setFilteredCards] = useState<BusinessCard[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchBusinessCards()
  }, [])

  // Filter cards whenever searchQuery or businessCards change
  useEffect(() => {
    filterCards(searchQuery)
  }, [searchQuery, businessCards])

  const fetchBusinessCards = async () => {
    try {
      setLoading(true)
      const response = await getData(endpoints.getBusinessCards)
      let cards: BusinessCard[] = []

      if (response.data && Array.isArray(response.data)) {
        cards = response.data.filter((item: any) => item.isOwner !== true)
      } else if (
        response.data?.businessCards &&
        Array.isArray(response.data.businessCards)
      ) {
        cards = response.data.businessCards
      }

      setBusinessCards(cards)
      setFilteredCards(cards)
    } catch (error) {
      console.error("Error fetching business cards:", error)
      Alert.alert(
        "Error",
        "Failed to fetch business cards. Please check your connection and try again."
      )
      setBusinessCards([])
      setFilteredCards([])
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchBusinessCards()
    setRefreshing(false)
  }

  const filterCards = (text: string) => {
    setSearchQuery(text)

    if (text === "") {
      setFilteredCards(businessCards)
      return
    }

    const filtered = businessCards.filter((card) => {
      const searchableFields = [
        card.name?.toLowerCase() || "",
        card.company?.toLowerCase() || "",
        card.role?.toLowerCase() || "",
        card.email?.toLowerCase() || "",
        card.business_email?.toLowerCase() || "",
        card.phone || "",
        card.business_phone || "",
      ]

      const searchText = text.toLowerCase()
      return searchableFields.some((field) => field.includes(searchText))
    })

    setFilteredCards(filtered)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setFilteredCards(businessCards)
  }

  const formatServicesForDisplay = (services: BusinessCard["services"]) => {
    return services.map((service) => ({
      name: service.name,
      description: service.description || "Professional service",
      price: parseFloat(service.price) || 0,
    }))
  }

  const formatProductsForDisplay = (products: BusinessCard["products"]) => {
    return products.map((product) => ({
      name: product.name,
      description: product.description || "Quality product",
      price: parseFloat(product.price) || 0,
    }))
  }

  const getResultsText = () => {
    if (searchQuery === "") {
      return businessCards.length > 0
        ? `Explore ${businessCards.length} business card${
            businessCards.length !== 1 ? "s" : ""
          }`
        : "No Business Cards Available"
    } else {
      return filteredCards.length > 0
        ? `Found ${filteredCards.length} result${
            filteredCards.length !== 1 ? "s" : ""
          } for "${searchQuery}"`
        : `No results found for "${searchQuery}"`
    }
  }

  return (
    <View style={styles.container}>
      <Header />
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialIcons
              name='business-center'
              size={32}
              color='#2196F3'
              style={styles.titleIcon}
            />
            <Text style={styles.headerTitle}>Business Cards</Text>
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
                }))}
                emptyMessage={
                  searchQuery === ""
                    ? "No business cards found. Start exploring business opportunities by creating connections!"
                    : `No business cards match "${searchQuery}". Try adjusting your search terms.`
                }
                navigation={navigation}
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
