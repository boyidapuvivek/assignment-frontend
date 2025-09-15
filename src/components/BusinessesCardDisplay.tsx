import React from "react"
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

interface BusinessCard {
  phone?: string
  email?: string
  address?: string
  company?: string
  business_email?: string
  business_phone?: string
  website?: string
  linkedin_url?: string
  twitter_url?: string
  facebook_url?: string
  instagram_url?: string
  youtube_url?: string
  services?: Array<{
    name: string
    description?: string
    price: number
  }>
  products?: Array<{
    name: string
    description?: string
    price: number
  }>
  gallery?: Array<{
    url: string
  }>
  business_cover_photo?: string
  profile_image?: string
  name?: string
  role?: string
  business_description?: string
}

interface CardDisplayProps {
  businessCard: BusinessCard
  onPress?: () => void
  children?: React.ReactNode
}

const BusinessCardsDisplay: React.FC<CardDisplayProps> = ({
  businessCard,
  onPress,
  children,
}) => {
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

  const handleShare = () => {
    console.log("Share button pressed")
    // Add share functionality here
    Alert.alert("Share", "Share functionality to be implemented")
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

          {/* Right Side - Profile Image */}
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
              onPress={handleShare}>
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
  contentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: "20",
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
