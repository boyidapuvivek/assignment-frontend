import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Alert,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import CardList from "../components/CardList"
import LoadingSpinner from "../components/LoadingSpinner"
import SearchBar from "../components/SearchBar"
import TeamCardForm from "../components/TeamCardForm"
import { COLORS } from "../utils/constants"
import Header from "../components/Header"
import { getData, postData } from "../api/apiServices"
import { endpoints } from "../api/ClientApi"
import { TeamCard } from "../types/team"

// interface TeamCard {
//   _id: string
//   name: string
//   email: string
//   phone: string
//   role: string
//   qr_code: string
//   department: string
//   profile_image?: string
//   company: string
//   business_description: string
//   business_phone: string
//   business_email: string
//   business_cover_photo?: string
//   website?: string
//   address?: string
//   linkedin_url?: string
//   twitter_url?: string
//   facebook_url?: string
//   instagram_url?: string
//   youtube_url?: string
//   custom_notes?: string
//   theme: string
//   gallery: string[]
//   createdBy: {
//     id: string
//     name: string
//     email: string
//   }
// }

interface TeamCardsScreenProps {
  navigation: any
}

export default function TeamCardsScreen({ navigation }: TeamCardsScreenProps) {
  const { user, token } = useAuth()
  const [teamCards, setTeamCards] = useState<TeamCard[]>([])
  const [filteredCards, setFilteredCards] = useState<TeamCard[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchTeamCards()
  }, [])

  // Filter cards whenever searchQuery or teamCards change
  useEffect(() => {
    filterCards(searchQuery)
  }, [searchQuery, teamCards])

  const fetchTeamCards = async () => {
    try {
      setLoading(true)
      const response = await getData(endpoints.getTeamCards)
      let cards: TeamCard[] = []

      if (response.data && Array.isArray(response.data)) {
        cards = response.data
      }

      setTeamCards(cards)
      setFilteredCards(cards)
    } catch (error) {
      console.error("Error fetching team cards:", error)
      Alert.alert(
        "Error",
        "Failed to fetch team cards. Please check your connection and try again."
      )
      setTeamCards([])
      setFilteredCards([])
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchTeamCards()
    setRefreshing(false)
  }

  const handleCreateCard = async (formData: any, imageFiles: any) => {
    try {
      setCreating(true)

      const createData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        company: formData.company || "Test",
        business_description: formData.business_description,
        business_phone: formData.business_phone,
        business_email: formData.business_email,
        website: formData.website,
        address: formData.address,
        linkedin_url: formData.linkedin_url,
        twitter_url: formData.twitter_url,
        facebook_url: formData.facebook_url,
        instagram_url: formData.instagram_url,
        youtube_url: formData.youtube_url,
        custom_notes: formData.custom_notes,
        theme: formData.theme || "modern",
        profile_image: imageFiles?.profile_image?.uri,
        business_cover_photo: imageFiles?.business_cover_photo?.uri,
        gallery: imageFiles?.gallery?.map((img: any) => img.uri),
        department: formData.department,
      }

      const response = await postData(endpoints.createTeamCard, createData)
      Alert.alert("Success", "Team card created successfully!", [
        { text: "OK", onPress: () => setShowCreateForm(false) },
      ])
      fetchTeamCards()
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to create team card")
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

  const filterCards = (text: string) => {
    setSearchQuery(text)

    if (text === "") {
      setFilteredCards(teamCards)
      return
    }

    const filtered = teamCards.filter((card) => {
      const searchableFields = [
        card.name?.toLowerCase() || "",
        card.email?.toLowerCase() || "",
        card.phone || "",
        card.role?.toLowerCase() || "",
        card.department?.toLowerCase() || "",
        card.company?.toLowerCase() || "",
        card.business_description?.toLowerCase() || "",
        card.business_email?.toLowerCase() || "",
        card.business_phone || "",
        card.address?.toLowerCase() || "",
        card.website?.toLowerCase() || "",
        card.custom_notes?.toLowerCase() || "",
        card.createdBy?.name?.toLowerCase() || "",
        card.createdBy?.email?.toLowerCase() || "",
        ...card.services.map((s) => s.name?.toLowerCase() || ""),
        ...card.services.map((s) => s.description?.toLowerCase() || ""),
        ...card.products.map((p) => p.name?.toLowerCase() || ""),
        ...card.products.map((p) => p.description?.toLowerCase() || ""),
      ]

      const searchText = text.toLowerCase()
      return searchableFields.some((field) => field.includes(searchText))
    })

    setFilteredCards(filtered)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setFilteredCards(teamCards)
  }

  const handleDeleteCard = async (cardId: string) => {
    Alert.alert(
      "Delete Card",
      "Are you sure you want to remove this team member's card?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // You can implement delete API call here if needed
              // await deleteData(endpoints.deleteTeamCard(cardId))

              // For now, just remove from local state
              setTeamCards((prev) => prev.filter((card) => card._id !== cardId))
              Alert.alert("Success", "Team card removed successfully!")
            } catch (error) {
              Alert.alert("Error", "Failed to delete team card")
            }
          },
        },
      ]
    )
  }

  const getResultsText = () => {
    if (searchQuery === "") {
      return teamCards.length > 0
        ? `Discover ${teamCards.length} team member${
            teamCards.length !== 1 ? "s" : ""
          }`
        : "No Team Cards Available"
    } else {
      return filteredCards.length > 0
        ? `Found ${filteredCards.length} team member${
            filteredCards.length !== 1 ? "s" : ""
          } for "${searchQuery}"`
        : `No team members match "${searchQuery}"`
    }
  }

  if (showCreateForm) {
    return (
      <View style={styles.container}>
        <TeamCardForm
          onSave={handleCreateCard}
          onCancel={handleCancelCreate}
          showCancel={true}
          isCreating={true}
          title='Create Team Card'
        />
        {creating && (
          <View>
            <LoadingSpinner />
            <Text style={styles.loadingText}>Creating team card...</Text>
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
              name='groups'
              size={32}
              color='#2196F3'
              style={styles.titleIcon}
            />
            <Text style={styles.headerTitle}>Team Cards</Text>
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
          <Text style={styles.createButtonText}>Create Team Card</Text>
        </TouchableOpacity>
      </View>
      {/* Search Bar */}
      <SearchBar
        placeholder='Search by name, role, department, company...'
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
                  _id: card._id,
                  name: card.name,
                  email: card.email,
                  phone: card.phone,
                  role: card.role,
                  qr_code: card.qr_code,
                  department: card.department,
                  profile_image: card.profile_image,
                  company: card.company,
                  business_description: card.business_description,
                  business_phone: card.business_phone,
                  business_email: card.business_email,
                  business_cover_photo: card.business_cover_photo,
                  website: card.website,
                  address: card.address,
                  linkedin_url: card.linkedin_url,
                  twitter_url: card.twitter_url,
                  facebook_url: card.facebook_url,
                  instagram_url: card.instagram_url,
                  youtube_url: card.youtube_url,
                  services: card.services,
                  products: card.products,
                  gallery: card.gallery,
                  theme: card.theme,
                  cardDesign: card.cardDesign,
                }))}
                emptyMessage={
                  searchQuery === ""
                    ? "No team cards found. Team members haven't created their cards yet."
                    : `No team members match "${searchQuery}". Try adjusting your search terms.`
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
  loadingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 16,
  },
})
