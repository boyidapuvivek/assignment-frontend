import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "../utils/constants"

export default function CardDisplay({ user, children }) {
  const [activeTab, setActiveTab] = useState("Contact")

  const TabButton = ({ title, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTabButton]}
      onPress={onPress}>
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "Contact":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Personal Contact</Text>
            <View style={styles.contactItem}>
              <Ionicons
                name='call-outline'
                size={18}
                color='#2196F3'
              />
              <Text style={styles.contactText}>
                {user?.phone || "+916301401268"}
              </Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons
                name='mail-outline'
                size={18}
                color='#2196F3'
              />
              <Text style={styles.contactText}>
                {user?.email || "vivekboyidapu12@gmail.com"}
              </Text>
            </View>
          </View>
        )
      case "Services":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Business Details</Text>
            <Text style={styles.businessDescription}>
              {user?.businessDescription ||
                "React Native Developer specializing in mobile app development with expertise in cross-platform solutions."}
            </Text>
          </View>
        )
      case "Products":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.comingSoon}>Coming Soon</Text>
          </View>
        )
      case "Gallery":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.comingSoon}>Coming Soon</Text>
          </View>
        )
      default:
        return null
    }
  }

  const handleShare = () => {
    console.log("Share button pressed")
    // Add share functionality here
  }

  const handleQRCode = () => {
    console.log("QR Code button pressed")
    // Add QR code functionality here
  }

  return (
    <View style={styles.container}>
      {/* Header with Cover Photo */}
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          {children}
          <View style={styles.coverPhotoContainer}>
            <Ionicons
              name='camera-outline'
              size={24}
              color='#fff'
            />
            <Text style={styles.coverPhotoText}>Cover Photo</Text>
          </View>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Ionicons
              name='person'
              size={30}
              color='#2196F3'
            />
          </View>

          <Text style={styles.username}>
            {user?.name || "VENKAT VIVEK BOYIDAPU"}
          </Text>
          <Text style={styles.profession}>
            {user?.profession || "React Native Developer"}
          </Text>

          <View style={styles.locationContainer}>
            <Text style={styles.location}>{user?.location || "VIEK"}</Text>
            <Text style={styles.locationSubtext}>
              {user?.locationDetails || "test"}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}>
            <Ionicons
              name='share-outline'
              size={18}
              color='#fff'
            />
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.qrButton}
            onPress={handleQRCode}>
            <Ionicons
              name='qr-code-outline'
              size={18}
              color='#2196F3'
            />
            <Text style={styles.qrButtonText}>QR Code</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {["Contact", "Services", "Products", "Gallery"].map((tab) => (
            <TabButton
              key={tab}
              title={tab}
              isActive={activeTab === tab}
              onPress={() => setActiveTab(tab)}
            />
          ))}
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 20,
  },

  mainContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  header: {
    height: 140,
    background: "linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)",
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
  },

  coverPhotoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  coverPhotoText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 5,
    opacity: 0.9,
  },
  profileSection: {
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: -40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  profession: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 15,
  },
  locationContainer: {
    alignItems: "center",
  },
  location: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  locationSubtext: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 15,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2196F3",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },
  qrButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#2196F3",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  qrButtonText: {
    color: "#2196F3",
    fontSize: 14,
    fontWeight: "500",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#2196F3",
  },
  tabText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#2196F3",
    fontWeight: "600",
  },
  tabContent: {
    padding: 20,
    minHeight: 100,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  contactText: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  businessDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  comingSoon: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
})
