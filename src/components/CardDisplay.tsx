import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
} from "react-native"
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Feather,
} from "@expo/vector-icons"
import { COLORS } from "../utils/constants"
import { useAuth } from "../context/AuthContext"
import { postData, deleteData, getData } from "../api/apiServices"
import { endpoints } from "../api/ClientApi"
import {
  handleSocialMediaPress,
  handlePhonePress,
  handleEmailPress,
  handleLocationPress,
  handleShare,
} from "../utils/cardDisplayFunctions"
import { Share } from "react-native"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

interface BusinessCard {
  id?: string
  _id?: string
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
  isSaved?: boolean
  qr_code?: string
}

interface CustomizationSettings {
  primaryColor?: string
  secondaryColor?: string
  backgroundColor?: string
  textColor?: string
  showPersonalContact?: boolean
  showBusinessContact?: boolean
  showSocialMedia?: boolean
  showServices?: boolean
  showProducts?: boolean
  showGallery?: boolean
  showQR?: boolean
  enableAnimations?: boolean
  enableInteractions?: boolean
}

interface CardDisplayProps {
  businessCard: BusinessCard
  children?: React.ReactNode
  onSaveToggle?: (cardId: string, isSaved: boolean) => void
  customizationSettings?: CustomizationSettings
}

interface TabButtonProps {
  title: string
  isActive: boolean
  onPress: () => void
  primaryColor: string
}

const CardDisplay: React.FC<CardDisplayProps> = ({
  businessCard,
  children,
  onSaveToggle,
  customizationSettings = {
    primaryColor: "#2196F3",
    secondaryColor: "#3b82f6",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    showPersonalContact: true,
    showBusinessContact: true,
    showSocialMedia: true,
    showServices: true,
    showProducts: true,
    showGallery: true,
    showQR: true,
    enableAnimations: false,
    enableInteractions: true,
  },
}) => {
  const { token } = useAuth()
  const [activeTab, setActiveTab] = useState("Contact")
  const [isSaved, setIsSaved] = useState(businessCard?.isSaved || false)
  const [isLoading, setIsLoading] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)

  const cardId = businessCard?.id || businessCard?._id

  // Dynamic colors from customization
  const primaryColor = customizationSettings.primaryColor || "#2196F3"
  const secondaryColor = customizationSettings.secondaryColor || "#3b82f6"
  const backgroundColor = customizationSettings.backgroundColor || "#ffffff"
  const textColor = customizationSettings.textColor || "#1f2937"

  const TabButton: React.FC<TabButtonProps> = ({
    title,
    isActive,
    onPress,
    primaryColor,
  }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        isActive && {
          ...styles.activeTabButton,
          borderBottomColor: primaryColor,
        },
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.tabText,
          isActive && { ...styles.activeTabText, color: primaryColor },
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  )

  const handleSaveToggle = async () => {
    if (!cardId) {
      Alert.alert("Error", "Card ID not found")
      return
    }

    setIsLoading(true)
    try {
      if (isSaved) {
        await deleteData(endpoints.unsaveCard(cardId))
        setIsSaved(false)
        Alert.alert("Success", "Card removed from saved collection")
      } else {
        await postData(endpoints.saveCard(cardId), {})
        setIsSaved(true)
        Alert.alert("Success", "Card saved to your collection")
      }

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

  const handleQRCode = (): void => {
    if (!businessCard?.qr_code) {
      Alert.alert("QR Code", "QR code not available for this card")
      return
    }
    setShowQRModal(true)
  }

  const closeQRModal = () => {
    setShowQRModal(false)
  }

  // QR Code Modal Component
  const QRCodeModal = () => (
    <Modal
      visible={showQRModal}
      transparent={true}
      animationType='fade'
      onRequestClose={closeQRModal}>
      <TouchableWithoutFeedback onPress={closeQRModal}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContainer}>
              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeQRModal}>
                <MaterialIcons
                  name='close'
                  size={20}
                  color='#666'
                />
              </TouchableOpacity>

              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <MaterialIcons
                  name='qr-code'
                  size={32}
                  color={primaryColor}
                />
                <Text style={styles.modalTitle}>QR Code</Text>
                <Text style={styles.modalSubtitle}>
                  Scan to view {businessCard?.name || "this"} business card
                </Text>
              </View>

              {/* QR Code Container */}
              <View style={styles.qrContainer}>
                {businessCard?.qr_code ? (
                  <Image
                    source={{ uri: businessCard.qr_code }}
                    style={styles.qrCodeImage}
                    resizeMode='contain'
                  />
                ) : (
                  <View style={styles.qrPlaceholder}>
                    <MaterialIcons
                      name='qr-code'
                      size={48}
                      color='#ccc'
                    />
                    <Text style={styles.qrPlaceholderText}>
                      QR Code Not Available
                    </Text>
                  </View>
                )}
              </View>

              {/* Card Info */}
              <View style={styles.modalCardInfo}>
                <Text style={styles.modalCardName}>
                  {businessCard?.name || "Business Card"}
                </Text>
                <Text style={styles.modalCardRole}>
                  {businessCard?.role ||
                    businessCard?.company ||
                    "Professional"}
                </Text>
              </View>

              {/* Instructions */}
              <View style={styles.instructionsContainer}>
                <Text style={styles.instructionsText}>
                  Point your camera at the QR code to instantly access this
                  business card
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )

  const renderTabContent = (): JSX.Element | null => {
    switch (activeTab) {
      case "Contact":
        return (
          <View style={styles.contactSection}>
            {customizationSettings.showPersonalContact && (
              <>
                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  Personal Contact
                </Text>
                <TouchableOpacity
                  style={styles.contactItem}
                  onPress={() => handlePhonePress(businessCard?.phone)}>
                  <View
                    style={[
                      styles.contactIconContainer,
                      { backgroundColor: `${primaryColor}20` },
                    ]}>
                    <MaterialIcons
                      name='phone'
                      size={18}
                      color={primaryColor}
                    />
                  </View>
                  <Text
                    style={[
                      styles.contactText,
                      {
                        color:
                          businessCard?.phone &&
                          businessCard.phone !== "No phone number"
                            ? primaryColor
                            : textColor,
                      },
                    ]}>
                    {businessCard?.phone || "No phone number"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.contactItem}
                  onPress={() => handleEmailPress(businessCard?.email)}>
                  <View
                    style={[
                      styles.contactIconContainer,
                      { backgroundColor: `${primaryColor}20` },
                    ]}>
                    <MaterialIcons
                      name='email'
                      size={18}
                      color={primaryColor}
                    />
                  </View>
                  <Text
                    style={[
                      styles.contactText,
                      {
                        color:
                          businessCard?.email &&
                          businessCard.email !== "No email"
                            ? primaryColor
                            : textColor,
                      },
                    ]}>
                    {businessCard?.email || "No email"}
                  </Text>
                </TouchableOpacity>
                {businessCard?.address && (
                  <TouchableOpacity
                    style={styles.contactItem}
                    onPress={() => handleLocationPress(businessCard?.address)}>
                    <View
                      style={[
                        styles.contactIconContainer,
                        { backgroundColor: `${primaryColor}20` },
                      ]}>
                      <MaterialIcons
                        name='location-on'
                        size={18}
                        color={primaryColor}
                      />
                    </View>
                    <Text style={[styles.contactText, { color: primaryColor }]}>
                      {businessCard.address}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {customizationSettings.showBusinessContact && (
              <>
                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  Business Contact
                </Text>
                <View style={styles.contactItem}>
                  <View
                    style={[
                      styles.contactIconContainer,
                      { backgroundColor: `${primaryColor}20` },
                    ]}>
                    <MaterialIcons
                      name='business'
                      size={18}
                      color={primaryColor}
                    />
                  </View>
                  <Text style={[styles.contactText, { color: textColor }]}>
                    {businessCard?.company || "No company name"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.contactItem}
                  onPress={() =>
                    handleEmailPress(businessCard?.business_email)
                  }>
                  <View
                    style={[
                      styles.contactIconContainer,
                      { backgroundColor: `${primaryColor}20` },
                    ]}>
                    <MaterialIcons
                      name='email'
                      size={18}
                      color={primaryColor}
                    />
                  </View>
                  <Text
                    style={[
                      styles.contactText,
                      {
                        color:
                          businessCard?.business_email &&
                          businessCard.business_email !== "No business email"
                            ? primaryColor
                            : textColor,
                      },
                    ]}>
                    {businessCard?.business_email || "No business email"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.contactItem}
                  onPress={() =>
                    handlePhonePress(businessCard?.business_phone)
                  }>
                  <View
                    style={[
                      styles.contactIconContainer,
                      { backgroundColor: `${primaryColor}20` },
                    ]}>
                    <MaterialIcons
                      name='phone'
                      size={18}
                      color={primaryColor}
                    />
                  </View>
                  <Text
                    style={[
                      styles.contactText,
                      {
                        color:
                          businessCard?.business_phone &&
                          businessCard.business_phone !== "No business phone"
                            ? primaryColor
                            : textColor,
                      },
                    ]}>
                    {businessCard?.business_phone || "No business phone"}
                  </Text>
                </TouchableOpacity>
                {businessCard?.website && (
                  <TouchableOpacity
                    style={styles.contactItem}
                    onPress={() =>
                      handleSocialMediaPress(businessCard.website, "Website")
                    }>
                    <View
                      style={[
                        styles.contactIconContainer,
                        { backgroundColor: `${primaryColor}20` },
                      ]}>
                      <MaterialIcons
                        name='language'
                        size={18}
                        color={primaryColor}
                      />
                    </View>
                    <Text style={[styles.contactText, { color: primaryColor }]}>
                      {businessCard.website}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {customizationSettings.showSocialMedia && (
              <>
                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  Social Media
                </Text>
                <View style={styles.socialMediaContainer}>
                  <TouchableOpacity
                    style={styles.socialIcon}
                    onPress={() =>
                      handleSocialMediaPress(
                        businessCard?.youtube_url,
                        "Youtube"
                      )
                    }>
                    <View
                      style={[
                        styles.socialIconBg,
                        { backgroundColor: "#FF0000" },
                      ]}>
                      <MaterialIcons
                        name='video-library'
                        size={20}
                        color='#fff'
                      />
                    </View>
                    <Text style={styles.socialLabel}>Youtube</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.socialIcon}
                    onPress={() =>
                      handleSocialMediaPress(
                        businessCard?.twitter_url,
                        "Twitter"
                      )
                    }>
                    <View
                      style={[
                        styles.socialIconBg,
                        { backgroundColor: "#1DA1F2" },
                      ]}>
                      <MaterialIcons
                        name='alternate-email'
                        size={20}
                        color='#fff'
                      />
                    </View>
                    <Text style={styles.socialLabel}>Twitter</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.socialIcon}
                    onPress={() =>
                      handleSocialMediaPress(
                        businessCard?.linkedin_url,
                        "LinkedIn"
                      )
                    }>
                    <View
                      style={[
                        styles.socialIconBg,
                        { backgroundColor: "#0077B5" },
                      ]}>
                      <MaterialIcons
                        name='work'
                        size={20}
                        color='#fff'
                      />
                    </View>
                    <Text style={styles.socialLabel}>LinkedIn</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.socialIcon}
                    onPress={() =>
                      handleSocialMediaPress(
                        businessCard?.instagram_url,
                        "Instagram"
                      )
                    }>
                    <View
                      style={[
                        styles.socialIconBg,
                        { backgroundColor: "#E4405F" },
                      ]}>
                      <MaterialIcons
                        name='camera-alt'
                        size={20}
                        color='#fff'
                      />
                    </View>
                    <Text style={styles.socialLabel}>Instagram</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )

      case "Services":
        if (!customizationSettings.showServices) return null
        return (
          <View style={styles.contactSection}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Our Services
            </Text>
            {businessCard?.services && businessCard.services.length > 0 ? (
              businessCard.services.map((service, index) => (
                <View
                  key={index}
                  style={[
                    styles.serviceCard,
                    { borderLeftColor: primaryColor },
                  ]}>
                  <View style={styles.serviceHeader}>
                    <View
                      style={[
                        styles.serviceIconContainer,
                        { backgroundColor: `${primaryColor}20` },
                      ]}>
                      <MaterialIcons
                        name='work'
                        size={24}
                        color={primaryColor}
                      />
                    </View>
                    <View style={styles.serviceDetails}>
                      <Text style={[styles.serviceName, { color: textColor }]}>
                        {service.name}
                      </Text>
                      <Text style={styles.serviceDescription}>
                        {service.description || "Professional service"}
                      </Text>
                    </View>
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceLabel}>Starting from</Text>
                      <Text style={[styles.priceText, { color: primaryColor }]}>
                        ₹{service.price}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No services added yet</Text>
            )}
            <TouchableOpacity
              style={[styles.inquireButton, { backgroundColor: primaryColor }]}>
              <MaterialIcons
                name='help'
                size={20}
                color='#fff'
              />
              <Text style={styles.inquireButtonText}>Inquire Now</Text>
            </TouchableOpacity>
          </View>
        )

      case "Products":
        if (!customizationSettings.showProducts) return null
        return (
          <View style={styles.contactSection}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Our Products
            </Text>
            {businessCard?.products && businessCard.products.length > 0 ? (
              businessCard.products.map((product, index) => (
                <View
                  key={index}
                  style={styles.productCard}>
                  <View style={styles.productImageContainer}>
                    <View
                      style={[
                        styles.productImagePlaceholder,
                        { backgroundColor: `${primaryColor}20` },
                      ]}>
                      <MaterialIcons
                        name='inventory'
                        size={32}
                        color={primaryColor}
                      />
                    </View>
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={[styles.productName, { color: textColor }]}>
                      {product.name}
                    </Text>
                    <Text style={styles.productDescription}>
                      {product.description || "Quality product"}
                    </Text>
                    <View style={styles.productPriceContainer}>
                      <Text
                        style={[styles.productPrice, { color: primaryColor }]}>
                        ₹{product.price}
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.addToCartButton,
                          { backgroundColor: primaryColor },
                        ]}>
                        <MaterialIcons
                          name='add-shopping-cart'
                          size={18}
                          color='#fff'
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No products added yet</Text>
            )}
            <TouchableOpacity
              style={[styles.viewAllButton, { borderColor: primaryColor }]}>
              <MaterialIcons
                name='shopping-cart'
                size={20}
                color={primaryColor}
              />
              <Text style={[styles.viewAllButtonText, { color: primaryColor }]}>
                View All Products
              </Text>
            </TouchableOpacity>
          </View>
        )

      case "Gallery":
        if (!customizationSettings.showGallery) return null
        return (
          <View style={styles.contactSection}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Gallery
            </Text>
            {businessCard?.gallery && businessCard.gallery.length > 0 ? (
              <View style={styles.galleryGrid}>
                {businessCard.gallery.map((image, index) => (
                  <View
                    key={index}
                    style={styles.galleryItem}>
                    <Image
                      source={{ uri: image.url }}
                      style={styles.galleryImage}
                      resizeMode='cover'
                    />
                    <View style={styles.galleryOverlay}>
                      <MaterialIcons
                        name='zoom-in'
                        size={16}
                        color='#fff'
                      />
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noDataText}>No gallery images added yet</Text>
            )}
          </View>
        )

      default:
        return null
    }
  }

  // Filter available tabs based on customization settings
  const getAvailableTabs = () => {
    const tabs = ["Contact"]
    if (customizationSettings.showServices && businessCard?.services?.length) {
      tabs.push("Services")
    }
    if (customizationSettings.showProducts && businessCard?.products?.length) {
      tabs.push("Products")
    }
    if (customizationSettings.showGallery && businessCard?.gallery?.length) {
      tabs.push("Gallery")
    }
    return tabs
  }

  const availableTabs = getAvailableTabs()

  // Reset active tab if it's no longer available
  useEffect(() => {
    if (!availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0] || "Contact")
    }
  }, [availableTabs, activeTab])

  useEffect(() => {
    const checkSavedStatus = async () => {
      const cardId = businessCard?.id
      if (!cardId) return
      try {
        const response = await getData(endpoints.saveStatus(cardId))
        setIsSaved(response.data.isSaved)
      } catch (error) {
        console.error("Error checking saved status:", error)
      }
    }
    checkSavedStatus()
  }, [businessCard?.id])

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header with Cover Photo */}
      <View style={[styles.header, { backgroundColor: primaryColor }]}>
        {businessCard?.business_cover_photo ? (
          <Image
            source={{ uri: businessCard.business_cover_photo }}
            style={styles.coverImage}
            resizeMode='cover'
          />
        ) : (
          <View style={styles.coverPhotoContainer}>
            {children}
            <MaterialIcons
              name='image'
              size={40}
              color='#fff'
            />
            <Text style={styles.coverPhotoText}>Cover Photo</Text>
          </View>
        )}

        {/* Save/Unsave Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveToggle}
          disabled={isLoading}>
          <MaterialIcons
            name={isSaved ? "favorite" : "favorite-border"}
            size={24}
            color={isSaved ? "#ff4757" : "#fff"}
          />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          {businessCard?.profile_image ? (
            <Image
              source={{ uri: businessCard.profile_image }}
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

        <Text style={[styles.username, { color: textColor }]}>
          {businessCard?.name || "Name not provided"}
        </Text>
        <Text style={styles.profession}>
          {businessCard?.role || businessCard?.company || "Professional"}
        </Text>

        <View style={styles.locationContainer}>
          <Text style={[styles.location, { color: textColor }]}>
            {businessCard?.address || "Location not provided"}
          </Text>
        </View>

        {businessCard?.business_description && (
          <Text
            style={[styles.profession, { color: textColor, marginTop: 10 }]}>
            {businessCard.business_description}
          </Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.shareButton, { backgroundColor: primaryColor }]}
          onPress={() => handleShare(businessCard?._id)}>
          <MaterialIcons
            name='share'
            size={18}
            color='#fff'
          />
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>

        {customizationSettings.showQR && (
          <TouchableOpacity
            style={[styles.qrButton, { borderColor: primaryColor }]}
            onPress={handleQRCode}>
            <MaterialIcons
              name='qr-code'
              size={18}
              color={primaryColor}
            />
            <Text style={[styles.qrButtonText, { color: primaryColor }]}>
              QR Code
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {availableTabs.map((tab) => (
          <TabButton
            key={tab}
            title={tab}
            isActive={activeTab === tab}
            onPress={() => setActiveTab(tab)}
            primaryColor={primaryColor}
          />
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView
        style={styles.tabContent}
        showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>

      {/* QR Code Modal */}
      <QRCodeModal />
    </View>
  )
}

export default CardDisplay

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
  },
  // Existing styles
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
  galleryImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  noDataText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 20,
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
    justifyContent: "space-around",
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
  socialMediaContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    marginBottom: 10,
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

  // QR Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    width: screenWidth * 0.9,
    maxWidth: 400,
    maxHeight: screenHeight * 0.8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 20,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginTop: 12,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  qrContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    minHeight: 200,
  },
  qrCodeImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  qrPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.5,
  },
  qrPlaceholderText: {
    fontSize: 14,
    color: "#999",
    marginTop: 12,
    textAlign: "center",
  },
  modalCardInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalCardName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  modalCardRole: {
    fontSize: 14,
    color: "#666",
  },
  instructionsContainer: {
    backgroundColor: "#e3f2fd",
    borderRadius: 12,
    padding: 16,
  },
  instructionsText: {
    fontSize: 13,
    color: "#1976d2",
    textAlign: "center",
    lineHeight: 18,
    fontWeight: "500",
  },
})
