import React, { useState, useEffect, useCallback, use } from "react"
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
import Header from "../components/Header"
import EditBusinessCardForm from "../components/EditBusinessCardForm"
import useGetApi, { getApiData } from "../hooks/api/useGetApi"
import api, { endpoints } from "../api/ClientApi"
import { API, getData, postData, putData } from "../api/apiServices"
import axios from "axios"
import CustomButton from "../components/CustomButton"
import { useFocusEffect, useNavigation } from "@react-navigation/native"

// Add CustomizationSettings interface
interface CustomizationSettings {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  accentColor: string
  fontFamily: string
  fontSize: number
  fontWeight: string
  layout: string
  cardShape: string
  borderRadius: number
  shadow: boolean
  showQR: boolean
  showPersonalContact: boolean
  showBusinessContact: boolean
  showSocialMedia: boolean
  showProducts: boolean
  showServices: boolean
  showGallery: boolean
  showLogo: boolean
  logoPosition: string
  backgroundType: string
  animations: boolean
  hoverEffects: boolean
  gradient: {
    enabled: boolean
    direction: string
    colors: string[]
  }
  logo?: string
}

export default function MyCardScreen() {
  const { user, updateUser } = useAuth()
  const [businessCard, setBusinessCard] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation()

  // Add customization settings state
  const [customizationSettings, setCustomizationSettings] =
    useState<CustomizationSettings>({
      primaryColor: "#2563eb",
      secondaryColor: "#3b82f6",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      accentColor: "#71cde6",
      fontFamily: "Inter",
      fontSize: 16,
      fontWeight: "normal",
      layout: "modern",
      cardShape: "rounded",
      borderRadius: 12,
      shadow: true,
      showQR: true,
      showPersonalContact: true,
      showBusinessContact: true,
      showSocialMedia: true,
      showProducts: true,
      showServices: true,
      showGallery: true,
      showLogo: false,
      logoPosition: "top-right",
      backgroundType: "solid",
      animations: false,
      hoverEffects: true,
      gradient: {
        enabled: false,
        direction: "to-right",
        colors: [],
      },
    })

  useFocusEffect(
    useCallback(() => {
      fetchBusinessCard()
    }, [])
  )

  // Add effect to load customization when businessCard changes
  useEffect(() => {
    if (businessCard?._id) {
      loadCustomizationSettings()
    }
  }, [businessCard])

  // Add customization loading function
  const loadCustomizationSettings = async () => {
    if (!businessCard?._id) return

    try {
      const response = await getData(
        endpoints.cardCustomization(businessCard._id)
      )

      // Handle the nested structure from your API response
      if (response.data && response.data.customization) {
        const customization = response.data.customization
        setCustomizationSettings((prev) => ({
          ...prev,
          ...customization,
        }))
      }
    } catch (error) {
      console.log("No existing customization found, using defaults")
      // Keep default settings if no customization exists
    }
  }

  const fetchBusinessCard = async () => {
    try {
      setLoading(true)
      const response = await getData(endpoints.getUserBusinessCard)

      if (
        response.data.businessCards &&
        response.data.businessCards.length > 0
      ) {
        const card = response.data.businessCards[0]
        setBusinessCard(card)
        setIsEditing(false)
      } else {
        setIsEditing(true)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch business card")
      setIsEditing(true)
    } finally {
      setLoading(false)
    }
  }
  const handleSave = async (data) => {
    setLoading(true)
    try {
      let response = []
      if (businessCard && businessCard._id) {
        response = await putData(
          endpoints.updateBusinessCard(businessCard._id),
          data
        )
      } else {
        response = await postData(endpoints.createBusinessCard, data)
      }
      await fetchBusinessCard()
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to save business card")
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        style={styles.mainContainer}
        showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <MaterialIcons
                name='badge'
                size={32}
                color={COLORS.primary}
                style={styles.titleIcon}
              />
              <Text style={styles.headerTitle}>Digital Business Card</Text>
            </View>
            {!businessCard && (
              <Text style={styles.subtitle}>
                {loading
                  ? "Loading..."
                  : "Create your business card to get started"}
              </Text>
            )}
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentWrapper}>
          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            {!loading ? (
              <View style={styles.dataContainer}>
                {isEditing ? (
                  <View style={styles.formContainer}>
                    <View style={styles.formHeader}>
                      <MaterialIcons
                        name='edit'
                        size={24}
                        color={COLORS.primary}
                      />
                      <Text style={styles.formTitle}>
                        {businessCard
                          ? "Edit Your Business Card"
                          : "Create Your Business Card"}
                      </Text>
                    </View>
                    <EditBusinessCardForm
                      businessCard={businessCard}
                      onSave={(data) => handleSave(data)}
                      onCancel={() => setIsEditing(false)}
                    />
                  </View>
                ) : (
                  <>
                    {/* Card Display Section - Updated with customizationSettings */}
                    <View style={styles.cardContainer}>
                      <CardDisplay
                        businessCard={businessCard}
                        customizationSettings={customizationSettings}
                      />
                    </View>

                    {/* Quick Actions Section */}
                    <View style={styles.actionsContainer}>
                      <View style={styles.actionsHeader}>
                        <MaterialIcons
                          name='speed'
                          size={20}
                          color={COLORS.primary}
                        />
                        <Text style={styles.actionsTitle}>Quick Actions</Text>
                      </View>

                      <CustomButton
                        title='Edit Card'
                        onPress={handleEdit}
                        iconName='edit'
                        backgroundColor={COLORS.primary}
                      />

                      <CustomButton
                        title='Customize Design'
                        onPress={() =>
                          navigation.navigate("CardCustomizationScreen", {
                            businessCard: businessCard,
                          })
                        }
                        iconName='palette'
                        backgroundColor='#10b981'
                      />
                    </View>
                  </>
                )}
              </View>
            ) : (
              <LoadingSpinner />
            )}
          </ScrollView>
        </View>
      </ScrollView>
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
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    backgroundColor: COLORS.white,
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
