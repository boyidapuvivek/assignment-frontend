import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
} from "react-native"
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons"
import { COLORS } from "../utils/constants"
import { useAuth } from "../context/AuthContext"
import { postData, deleteData } from "../api/apiServices"
import { endpoints } from "../api/ClientApi"
import { handleShare } from "../utils/cardDisplayFunctions"
import { BusinessCard } from "../types/cards"

interface CardDisplayProps {
  businessCard: BusinessCard
  onPress?: () => void
  children?: React.ReactNode
  showSaveButton?: boolean
  onSaveToggle?: (cardId: string, isSaved: boolean) => void
}

const BusinessCardsDisplay: React.FC<CardDisplayProps> = ({
  businessCard,
  onPress,
  children,
  showSaveButton = false,
  onSaveToggle,
}) => {
  const { token } = useAuth()
  const [isSaved, setIsSaved] = useState(businessCard?.isSaved || false)
  const [isLoading, setIsLoading] = useState(false)

  const cardId = businessCard?._id

  const handleCall = () => {
    const phoneNumber = businessCard?.phone || businessCard?.business_phone
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`)
    } else {
      Alert.alert("No phone number available")
    }
  }

  const handleMessage = () => {
    const phoneNumber = businessCard?.phone || businessCard?.business_phone
    if (phoneNumber) {
      Linking.openURL(`sms:${phoneNumber}`)
    } else {
      Alert.alert("No phone number available")
    }
  }

  const handleSaveToggle = async () => {
    if (!cardId) {
      Alert.alert("Error", "Card ID not found")
      return
    }

    setIsLoading(true)
    try {
      if (isSaved) {
        // Unsave the card
        await deleteData(endpoints.unsaveCard(cardId))
        setIsSaved(false)
        Alert.alert("Success", "Card removed from saved collection")
      } else {
        // Save the card
        await postData(endpoints.saveCard(cardId), {})
        setIsSaved(true)
        Alert.alert("Success", "Card saved to your collection")
      }

      // Notify parent component
      if (onSaveToggle) {
        onSaveToggle(cardId, !isSaved)
      }
    } catch (error) {
      console.error("Error toggling save status:", error)
      Alert.alert(
        "Error",
        isSaved ? "Failed to unsave card" : "Failed to save card"
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onPress}
      activeOpacity={0.8}>
      {/* Background Cover Image with Overlay */}
      <View style={styles.backgroundContainer}>
        {businessCard?.business_cover_photo ? (
          <Image
            source={{ uri: businessCard.business_cover_photo }}
            style={styles.coverImage}
            resizeMode='cover'
          />
        ) : (
          <View style={styles.defaultBackground} />
        )}
        <View style={styles.overlay} />
      </View>

      {/* Save/Unsave Button - Only show when showSaveButton is true */}
      {showSaveButton && (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveToggle}
          disabled={isLoading}
          activeOpacity={0.7}>
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={24}
            color={isSaved ? "#FFD700" : "#fff"}
          />
        </TouchableOpacity>
      )}

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Left Side - Profile Pic */}
        <View style={styles.profileContainer}>
          {businessCard?.profile_image ? (
            <Image
              source={{ uri: businessCard.profile_image }}
              style={styles.profileImage}
              resizeMode='cover'
            />
          ) : (
            <View style={styles.defaultProfile}>
              <Ionicons
                name='person'
                size={30}
                color='#2196F3'
              />
            </View>
          )}
        </View>

        {/* Right Side */}
        <View style={styles.infoContainer}>
          <View>
            <Text
              style={styles.name}
              numberOfLines={1}>
              {businessCard?.name || "Name not provided"}
            </Text>
            <Text
              style={styles.role}
              numberOfLines={1}>
              {businessCard?.role || businessCard?.company || "Professional"}
            </Text>
          </View>

          {/* Right Side - Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleCall}>
              <Ionicons
                name='call'
                size={20}
                color='#fff'
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleMessage}>
              <Ionicons
                name='chatbubble'
                size={20}
                color='#fff'
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleShare(cardId)}>
              <Ionicons
                name='share'
                size={20}
                color='#fff'
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default BusinessCardsDisplay

const styles = StyleSheet.create({
  cardContainer: {
    height: "auto",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 16,
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  defaultBackground: {
    width: "100%",
    height: "100%",
    backgroundColor: "#534df8ff",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  saveButton: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 20,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "flex-start",
    gap: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
    width: 250,
  },
  role: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  profileContainer: {
    alignSelf: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "#fff",
  },
  defaultProfile: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
})
