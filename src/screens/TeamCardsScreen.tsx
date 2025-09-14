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
import { getData } from "../api/apiServices"
import { endpoints } from "../api/ClientApi"

interface TeamCard {
  _id: string
  name: string
  email: string
  phone: string
  role: string
  department: string
  profile_image?: string
  company: string
  business_description: string
  business_phone: string
  business_email: string
  business_cover_photo?: string
  website?: string
  address: string
  linkedin_url?: string
  twitter_url?: string
  facebook_url?: string
  instagram_url?: string
  youtube_url?: string
  custom_notes?: string
  theme: string
  services: Array<{
    name: string
    description?: string
    price: number
  }>
  products: Array<{
    name: string
    description?: string
    price: number
  }>
  gallery: string[]
  createdBy: {
    _id: string
    name: string
    email: string
  }
  user_id: string
  views: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  qrCode?: string
  connectionCount: number
  cardDesign: {
    theme: string
    primaryColor: string
    secondaryColor: string
  }
}

const API_BASE_URL = "http://192.168.3.172:5000/api"

export default function TeamCardsScreen() {
  const { user, token } = useAuth()
  const [teamCards, setTeamCards] = useState<TeamCard[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchTeamCards()
  }, [])

  const fetchTeamCards = async () => {
    try {
      setLoading(true)
      const response = await getData(endpoints.getTeamCards)

      if (response.data && Array.isArray(response.data)) {
        setTeamCards(response.data)
      } else {
        setTeamCards([])
      }
    } catch (error) {
      console.error("Error fetching team cards:", error)
      Alert.alert(
        "Error",
        "Failed to fetch team cards. Please check your connection and try again."
      )
      setTeamCards([])
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchTeamCards()
    setRefreshing(false)
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
              // await axios.delete(`${API_BASE_URL}/team-card/${cardId}`)

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

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <Header />
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialIcons
              name='groups'
              size={32}
              color={COLORS.primary}
              style={styles.titleIcon}
            />
            <Text style={styles.headerTitle}>Team Cards</Text>
          </View>
          <Text style={styles.subtitle}>
            {teamCards.length > 0
              ? `Discover ${teamCards.length} team member${
                  teamCards.length !== 1 ? "s" : ""
                }`
              : loading
              ? "Loading..."
              : "No Team Cards Available"}
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
                cards={teamCards.map((card) => ({
                  id: card._id,
                  ...card,
                }))}
                onDelete={handleDeleteCard}
                emptyMessage="No team cards found. Team members haven't created their cards yet."
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
