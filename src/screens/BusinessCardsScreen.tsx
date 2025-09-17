import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Alert,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import CardList from "../components/CardList"
import LoadingSpinner from "../components/LoadingSpinner"
import SearchBar from "../components/SearchBar"
import BusinessCardForm from "../components/BusinessCardForm"
import { COLORS } from "../utils/constants"
import Header from "../components/Header"
import { getData, postData } from "../api/apiServices"
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
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [creating, setCreating] = useState(false)

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

      cards.reverse()

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

  const handleCreateCard = async (formData: any, imageFiles: any) => {
    try {
      setCreating(true)

      // Create FormData for multipart upload
      const createData = new FormData()

      // Add form fields
      createData.append("name", formData.username || "")
      createData.append("email", formData.email || "")
      createData.append("phone", formData.phoneNumber || "")
      createData.append("business_email", formData.businessEmail || "")
      createData.append("business_phone", formData.businessNumber || "")
      createData.append(
        "business_description",
        formData.businessDescription || ""
      )
      createData.append("address", formData.location || "")
      createData.append("company", formData.businessName || "")

      // Add social media links
      if (formData.socialMediaLinks && formData.socialMediaLinks[0]) {
        const social = formData.socialMediaLinks[0]
        createData.append("facebook_url", social.facebook || "")
        createData.append("twitter_url", social.twitter || "")
        createData.append("linkedin_url", social.linkedIn || "")
        createData.append("instagram_url", social.instagram || "")
      }

      // Add services and products as JSON strings
      if (formData.services && formData.services.length > 0) {
        createData.append("services", JSON.stringify(formData.services))
      }

      if (formData.products && formData.products.length > 0) {
        createData.append("products", JSON.stringify(formData.products))
      }

      // Add image files
      if (imageFiles.avatar) {
        createData.append("profile_image", {
          uri: imageFiles.avatar.uri,
          type: imageFiles.avatar.type,
          name: imageFiles.avatar.fileName,
        } as any)
      }

      if (imageFiles.coverImage) {
        createData.append("business_cover_photo", {
          uri: imageFiles.coverImage.uri,
          type: imageFiles.coverImage.type,
          name: imageFiles.coverImage.fileName,
        } as any)
      }

      if (imageFiles.gallery && imageFiles.gallery.length > 0) {
        imageFiles.gallery.forEach((image: any, index: number) => {
          createData.append(`gallery_${index}`, {
            uri: image.uri,
            type: image.type,
            name: image.fileName,
          } as any)
        })
      }
      const payload = JSON.stringify(createData)
      // Make API call
      const response = await postData(endpoints.createBusinessCard, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      console.log("😊", response)

      Alert.alert("Success", "Business card created successfully!", [
        {
          text: "OK",
          onPress: () => {
            setShowCreateForm(false)
            fetchBusinessCards() // Refresh the list
          },
        },
      ])
    } catch (error) {
      console.error("Error creating business card:", error)
      Alert.alert("Error", "Failed to create business card. Please try again.")
    } finally {
      setCreating(false)
    }
  }

  const handleCancelCreate = () => {
    Alert.alert(
      "Cancel Creation",
      "Are you sure you want to cancel? All entered data will be lost.",
      [
        {
          text: "Continue Editing",
          style: "cancel",
        },
        {
          text: "Cancel",
          style: "destructive",
          onPress: () => setShowCreateForm(false),
        },
      ]
    )
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

  if (showCreateForm) {
    return (
      <View style={styles.container}>
        <BusinessCardForm
          onSave={handleCreateCard}
          onCancel={handleCancelCreate}
          showCancel={true}
          isCreating={true}
          title='Create Business Card'
        />
        {creating && (
          <View style={styles.loadingOverlay}>
            <LoadingSpinner />
            <Text style={styles.loadingText}>Creating business card...</Text>
          </View>
        )}
      </View>
    )
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

      {/* Create Button */}
      <View style={styles.createButtonContainer}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateForm(true)}
          activeOpacity={0.8}>
          <MaterialIcons
            name='add'
            size={24}
            color='#fff'
          />
          <Text style={styles.createButtonText}>Create Business Card</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <SearchBar
        placeholder='Search by name, company, role, email...'
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
  createButtonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
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
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 16,
  },
})
