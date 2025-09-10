import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import { cardAPI, userAPI } from "../utils/api"
import CardForm from "../components/CardForm"
import CardDisplay from "../components/CardDisplay"
import LoadingSpinner from "../components/LoadingSpinner"
import { COLORS } from "../utils/constants"

export default function MyCardScreen() {
  const { user, updateUser } = useAuth()
  const [businessCard, setBusinessCard] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBusinessCard()
  }, [])

  const fetchBusinessCard = async () => {
    try {
      setLoading(true)
      // Using the new API endpoint
      const response = await cardAPI.getUserBusinessCards()
      if (
        response.data.businessCards &&
        response.data.businessCards.length > 0
      ) {
        setBusinessCard(response.data.businessCards[0]) // Get the first business card
        setIsEditing(false)
      } else {
        setIsEditing(true) // No business card exists, show form
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch business card")
      setIsEditing(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (formData, imageFiles) => {
    setLoading(true)
    try {
      let response
      if (businessCard) {
        // Update existing business card
        response = await cardAPI.updateBusinessCard(
          businessCard._id,
          formData,
          imageFiles
        )
      } else {
        // Create new business card
        response = await cardAPI.createBusinessCard(formData, imageFiles)
      }

      // Refresh the business card data
      await fetchBusinessCard()
      Alert.alert("Success", "Business card saved successfully!")
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to save business card"
      )
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleLogout = () => {
    updateUser("")
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>My Digital Bussiness Card</Text>
          </View>
          {!businessCard && (
            <Text style={styles.subtitle}>
              "Create your business card to get started"
            </Text>
          )}
        </View>
      </View>

      {/* Content Section */}
      <ScrollView
        style={styles.contentWrapper}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.dataContainer}>
          {isEditing ? (
            <View style={styles.formContainer}>
              <View style={styles.formHeader}>
                <MaterialIcons
                  name='edit'
                  size={24}
                  color='#2196F3'
                />
                <Text style={styles.formTitle}>
                  {businessCard
                    ? "Edit Your Business Card"
                    : "Create Your Business Card"}
                </Text>
              </View>
              <CardForm
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
                showCancel={!!businessCard}
                initialData={businessCard}
              />
            </View>
          ) : (
            <>
              {/* Card Display Section */}
              <View style={styles.cardContainer}>
                <CardDisplay businessCard={businessCard} />
              </View>

              {/* Quick Actions Section */}
              <View style={styles.actionsContainer}>
                <View style={styles.actionsHeader}>
                  <MaterialIcons
                    name='flash-on'
                    size={20}
                    color='#374151'
                  />
                  <Text style={styles.actionsTitle}>Quick Actions</Text>
                </View>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={handleEdit}>
                  <View style={styles.editButtonContent}>
                    <MaterialIcons
                      name='edit'
                      size={20}
                      color={COLORS.white}
                    />
                    <Text style={styles.editButtonText}>Edit Card</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={{
          backgroundColor: COLORS.warning,

          alignItems: "center",
        }}
        onPress={handleLogout}>
        <Text style={{ color: COLORS.text }}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

// Styles remain the same as original
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 40,
  },
  headerContainer: {
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 25,
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
  scrollContent: {
    paddingBottom: 30,
  },
  dataContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 20,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
    marginLeft: 10,
  },
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    // padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  actionsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  actionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  editButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
    letterSpacing: 0.3,
  },
})
