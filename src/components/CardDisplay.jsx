import React, { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Feather,
} from "@expo/vector-icons"
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
            {/* Personal Contact Section */}
            <Text style={styles.sectionTitle}>Personal Contact</Text>
            <View style={styles.contactItem}>
              <Ionicons
                name='call'
                size={18}
                color='#2196F3'
              />
              <Text style={styles.contactText}>
                {user?.phoneNumber || "+916301401268"}
              </Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons
                name='mail'
                size={18}
                color='#2196F3'
              />
              <Text style={styles.contactText}>
                {user?.email || "vivekboyidapu12@gmail.com"}
              </Text>
            </View>
            {user?.location && (
              <View style={styles.contactItem}>
                <Ionicons
                  name='location'
                  size={18}
                  color='#2196F3'
                />
                <Text style={styles.contactText}>{user.location}</Text>
              </View>
            )}

            {/* Business Contact Section */}
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
              Business Contact
            </Text>
            {user?.businessName ? (
              <View style={styles.contactItem}>
                <MaterialIcons
                  name='business'
                  size={18}
                  color='#2196F3'
                />
                <Text style={styles.contactText}>{user.businessName}</Text>
              </View>
            ) : (
              <Text style={styles.noDataText}>No business name added</Text>
            )}
            {user?.businessEmail ? (
              <View style={styles.contactItem}>
                <MaterialIcons
                  name='email'
                  size={18}
                  color='#2196F3'
                />
                <Text style={styles.contactText}>{user.businessEmail}</Text>
              </View>
            ) : (
              <Text style={styles.noDataText}>No business email added</Text>
            )}
            {user?.businessNumber ? (
              <View style={styles.contactItem}>
                <MaterialIcons
                  name='phone'
                  size={18}
                  color='#2196F3'
                />
                <Text style={styles.contactText}>{user.businessNumber}</Text>
              </View>
            ) : (
              <Text style={styles.noDataText}>No business phone added</Text>
            )}

            {/* Social Media Section */}
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
              Social Media
            </Text>
            <View style={styles.socialMediaContainer}>
              <TouchableOpacity style={styles.socialIcon}>
                <FontAwesome5
                  name='facebook'
                  size={24}
                  color='#3b5998'
                />
                <Text style={styles.socialLabel}>Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon}>
                <FontAwesome5
                  name='twitter'
                  size={24}
                  color='#1da1f2'
                />
                <Text style={styles.socialLabel}>Twitter</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon}>
                <FontAwesome5
                  name='linkedin'
                  size={24}
                  color='#0077b5'
                />
                <Text style={styles.socialLabel}>LinkedIn</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon}>
                <FontAwesome5
                  name='instagram'
                  size={24}
                  color='#e1306c'
                />
                <Text style={styles.socialLabel}>Instagram</Text>
              </TouchableOpacity>
            </View>
          </View>
        )

      case "Services":
      case "Products":
      case "Gallery":
        return (
          <View style={styles.tabContent}>
            <View style={styles.noDataContainer}>
              <Feather
                name='box'
                size={40}
                color='#562727ff'
              />
              <Text style={styles.noDataMessage}>No {activeTab} listed</Text>
            </View>
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
      <View style={styles.mainContainer}>
        {/* Header with Cover Photo */}
        <View style={styles.header}>
          {user?.coverImage?.url ? (
            <Image
              source={{ uri: user.coverImage.url }}
              style={styles.coverImage}
              resizeMode='cover'
            />
          ) : (
            <View style={styles.coverPhotoContainer}>
              {children}
              <MaterialIcons
                name='photo-camera'
                size={32}
                color='#fff'
              />
              <Text style={styles.coverPhotoText}>Cover Photo</Text>
            </View>
          )}
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            {user?.avatar?.url ? (
              <Image
                source={{ uri: user.avatar.url }}
                style={styles.avatarImage}
                resizeMode='cover'
              />
            ) : (
              <MaterialIcons
                name='person'
                size={40}
                color='#ccc'
              />
            )}
          </View>
          <Text style={styles.username}>
            {user?.username || user?.name || "VENKAT VIVEK BOYIDAPU"}
          </Text>
          <Text style={styles.profession}>
            {user?.businessName || user?.profession || "React Native Developer"}
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
              name='share-social'
              size={16}
              color='#fff'
            />
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.qrButton}
            onPress={handleQRCode}>
            <Ionicons
              name='qr-code'
              size={16}
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
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
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
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
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
    fontSize: 16,
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
  noDataText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    marginBottom: 8,
    marginLeft: 28,
  },
  socialMediaContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
    paddingVertical: 10,
  },
  socialIcon: {
    alignItems: "center",
    padding: 10,
  },
  socialLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  placeholderText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    fontStyle: "italic",
  },
  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  noDataMessage: {
    fontSize: 18,
    color: "#999",
    marginTop: 15,
    marginBottom: 8,
    fontWeight: "500",
  },
  noDataSubtext: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  businessDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginTop: 10,
  },
})
