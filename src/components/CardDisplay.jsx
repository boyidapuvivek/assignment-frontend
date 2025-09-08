import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native"
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Feather,
} from "@expo/vector-icons"
import { COLORS } from "../utils/constants"

export default function CardDisplay({ user, children }) {
  const [activeTab, setActiveTab] = useState("Contact")

  // Hardcoded data
  const hardcodedServices = [{ name: "food", price: 1000 }]

  const hardcodedProducts = [{ name: "Chocolate", price: 100 }]

  // You'll need to add these images to your assets folder
  const hardcodedGallery = [require("../../assets/business.jpg")]

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
          <ScrollView
            style={styles.tabContent}
            showsVerticalScrollIndicator={false}>
            {/* Personal Contact Section */}
            <View style={styles.contactSection}>
              <Text style={styles.sectionTitle}>Personal Contact</Text>
              <View style={styles.contactItem}>
                <View style={styles.contactIconContainer}>
                  <Ionicons
                    name='call'
                    size={18}
                    color='#2196F3'
                  />
                </View>
                <Text style={styles.contactText}>
                  {user?.phoneNumber || "+916301401268"}
                </Text>
              </View>
              <View style={styles.contactItem}>
                <View style={styles.contactIconContainer}>
                  <Ionicons
                    name='mail'
                    size={18}
                    color='#2196F3'
                  />
                </View>
                <Text style={styles.contactText}>
                  {user?.email || "vivekboyidapu12@gmail.com"}
                </Text>
              </View>
              {user?.location && (
                <View style={styles.contactItem}>
                  <View style={styles.contactIconContainer}>
                    <Ionicons
                      name='location'
                      size={18}
                      color='#2196F3'
                    />
                  </View>
                  <Text style={styles.contactText}>{user.location}</Text>
                </View>
              )}
            </View>

            {/* Business Contact Section */}
            <View style={styles.contactSection}>
              <Text style={styles.sectionTitle}>Business Contact</Text>
              <View style={styles.contactItem}>
                <View style={styles.contactIconContainer}>
                  <Ionicons
                    name='business'
                    size={18}
                    color='#2196F3'
                  />
                </View>
                {user?.businessName ? (
                  <Text style={styles.contactText}>{user.businessName}</Text>
                ) : (
                  <Text style={styles.noDataText}>No business name added</Text>
                )}
              </View>
              <View style={styles.contactItem}>
                <View style={styles.contactIconContainer}>
                  <Ionicons
                    name='mail'
                    size={18}
                    color='#2196F3'
                  />
                </View>
                {user?.businessEmail ? (
                  <Text style={styles.contactText}>{user.businessEmail}</Text>
                ) : (
                  <Text style={styles.noDataText}>No business email added</Text>
                )}
              </View>
              <View style={styles.contactItem}>
                <View style={styles.contactIconContainer}>
                  <Ionicons
                    name='call'
                    size={18}
                    color='#2196F3'
                  />
                </View>
                {user?.businessNumber ? (
                  <Text style={styles.contactText}>{user.businessNumber}</Text>
                ) : (
                  <Text style={styles.noDataText}>No business phone added</Text>
                )}
              </View>
            </View>

            {/* Social Media Section */}
            <View style={styles.contactSection}>
              <Text style={styles.sectionTitle}>Social Media</Text>
              <View style={styles.socialMediaContainer}>
                <TouchableOpacity style={styles.socialIcon}>
                  <View
                    style={[
                      styles.socialIconBg,
                      { backgroundColor: "#1877F2" },
                    ]}>
                    <Ionicons
                      name='logo-facebook'
                      size={20}
                      color='#fff'
                    />
                  </View>
                  <Text style={styles.socialLabel}>Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon}>
                  <View
                    style={[
                      styles.socialIconBg,
                      { backgroundColor: "#1DA1F2" },
                    ]}>
                    <Ionicons
                      name='logo-twitter'
                      size={20}
                      color='#fff'
                    />
                  </View>
                  <Text style={styles.socialLabel}>Twitter</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon}>
                  <View
                    style={[
                      styles.socialIconBg,
                      { backgroundColor: "#0A66C2" },
                    ]}>
                    <Ionicons
                      name='logo-linkedin'
                      size={20}
                      color='#fff'
                    />
                  </View>
                  <Text style={styles.socialLabel}>LinkedIn</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon}>
                  <View
                    style={[
                      styles.socialIconBg,
                      { backgroundColor: "#E4405F" },
                    ]}>
                    <Ionicons
                      name='logo-instagram'
                      size={20}
                      color='#fff'
                    />
                  </View>
                  <Text style={styles.socialLabel}>Instagram</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )

      case "Services":
        return (
          <ScrollView
            style={styles.tabContent}
            showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Our Services</Text>
            {hardcodedServices.map((service, index) => (
              <View
                key={index}
                style={styles.serviceCard}>
                <View style={styles.serviceHeader}>
                  <View style={styles.serviceIconContainer}>
                    <MaterialIcons
                      name='restaurant'
                      size={24}
                      color='#2196F3'
                    />
                  </View>
                  <View style={styles.serviceDetails}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.serviceDescription}>
                      Delicious food services
                    </Text>
                  </View>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>Starting from</Text>
                  <Text style={styles.priceText}>₹{service.price}</Text>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.inquireButton}>
              <Ionicons
                name='chatbubble-ellipses'
                size={20}
                color='#fff'
              />
              <Text style={styles.inquireButtonText}>Inquire Now</Text>
            </TouchableOpacity>
          </ScrollView>
        )

      case "Products":
        return (
          <ScrollView
            style={styles.tabContent}
            showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Our Products</Text>
            {hardcodedProducts.map((product, index) => (
              <View
                key={index}
                style={styles.productCard}>
                <View style={styles.productImageContainer}>
                  <View style={styles.productImagePlaceholder}>
                    <MaterialIcons
                      name='inventory'
                      size={32}
                      color='#2196F3'
                    />
                  </View>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productDescription}>
                    Premium quality chocolate
                  </Text>
                  <View style={styles.productPriceContainer}>
                    <Text style={styles.productPrice}>₹{product.price}</Text>
                    <TouchableOpacity style={styles.addToCartButton}>
                      <Ionicons
                        name='bag-add'
                        size={16}
                        color='#fff'
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllButtonText}>View All Products</Text>
              <Ionicons
                name='arrow-forward'
                size={18}
                color='#2196F3'
              />
            </TouchableOpacity>
          </ScrollView>
        )

      case "Gallery":
        return (
          <ScrollView
            style={styles.tabContent}
            showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <View style={styles.galleryGrid}>
              {/* Since we can't use require() with dynamic paths in this context, 
                  I'll show placeholder images. In a real app, you'd replace these 
                  with actual image sources */}
              {hardcodedGallery.map((item, index) => (
                <Image
                  key={index}
                  style={styles.galleryItem}
                  source={item}
                />
              ))}
            </View>
          </ScrollView>
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
            />
          ) : (
            <View style={styles.coverPhotoContainer}>
              {children}
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
              />
            ) : (
              <Ionicons
                name='person'
                size={35}
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
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
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
  tabContent: {},
  contactSection: {
    marginBottom: 25,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 10,
  },
  contactIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(33, 150, 243, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactText: {
    fontSize: 15,
    color: "#333",
    flex: 1,
    fontWeight: "500",
  },
  noDataText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    flex: 1,
  },
  socialMediaContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
  },
  socialIcon: {
    alignItems: "center",
    padding: 10,
  },
  socialIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  socialLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  // Services Styles
  serviceCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    padding: 16,
    marginBottom: 15,
    borderLeft: 4,
    borderLeftColor: "#2196F3",
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(33, 150, 243, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  serviceDetails: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    textTransform: "capitalize",
  },
  serviceDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  priceLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  priceText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2196F3",
  },
  inquireButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    gap: 8,
  },
  inquireButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // Products Styles
  productCard: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    padding: 16,
    marginBottom: 15,
  },
  productImageContainer: {
    marginRight: 15,
  },
  productImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "rgba(33, 150, 243, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  productPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2196F3",
  },
  addToCartButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: "#2196F3",
    borderRadius: 12,
    marginTop: 10,
    gap: 8,
  },
  viewAllButtonText: {
    color: "#2196F3",
    fontSize: 16,
    fontWeight: "600",
  },
  // Gallery Styles
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  galleryItem: {
    width: "48%",
    aspectRatio: 1,
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    position: "relative",
  },
  galleryImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(33, 150, 243, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  galleryImageText: {
    fontSize: 12,
    color: "#2196F3",
    fontWeight: "600",
    marginTop: 8,
  },
  galleryOverlay: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
})
