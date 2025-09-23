import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
  TouchableOpacity,
  Dimensions,
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { COLORS } from "../utils/constants"
import Header from "../components/Header"
import CustomButton from "../components/CustomButton"
import CardDisplay from "../components/card_display/CardDisplay"
import { getData, putData, postData, deleteData } from "../api/apiServices"
import { endpoints } from "../api/ClientApi"
import { useAuth } from "../context/AuthContext"
import { BASE_URL } from "../api/ClientApi"

const { width: screenWidth } = Dimensions.get("window")

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

interface CardCustomizationScreenProps {
  navigation: any
  route: any
}

const PresetThemes = [
  {
    name: "Professional Navy",
    primaryColor: "#4a90e2",
    secondaryColor: "#357abd",
    backgroundColor: "#f8fafc",
    textColor: "#1e3a8a",
    accentColor: "#06b6d4",
  },
  {
    name: "Slate Professional",
    primaryColor: "#64748b",
    secondaryColor: "#475569",
    backgroundColor: "#f8fafc",
    textColor: "#1e293b",
    accentColor: "#94a3b8",
  },
  {
    name: "Modern Pastel",
    primaryColor: "#8ecae6",
    secondaryColor: "#219ebc",
    backgroundColor: "#f1faee",
    textColor: "#023047",
    accentColor: "#ffb3c6",
  },
  {
    name: "Warm Peach",
    primaryColor: "#ffb4a2",
    secondaryColor: "#e5989b",
    backgroundColor: "#fff1e6",
    textColor: "#6d597a",
    accentColor: "#71cde6",
  },
  {
    name: "Lavender Mist",
    primaryColor: "#c7b9e2",
    secondaryColor: "#a69cac",
    backgroundColor: "#f5f3f7",
    textColor: "#3c3744",
    accentColor: "#e2b9d4",
  },
  {
    name: "Minty Fresh",
    primaryColor: "#a9d6a9",
    secondaryColor: "#78c6a3",
    backgroundColor: "#f0f9f0",
    textColor: "#2d6a4f",
    accentColor: "#b8e6d1",
  },
  {
    name: "Gentle Sky",
    primaryColor: "#b8d4f0",
    secondaryColor: "#95b8d1",
    backgroundColor: "#f0f6fc",
    textColor: "#2c4a6b",
    accentColor: "#d4e8f7",
  },
  {
    name: "Soft Coral",
    primaryColor: "#ffb3ba",
    secondaryColor: "#ff9aa0",
    backgroundColor: "#fff5f5",
    textColor: "#6b3a3e",
    accentColor: "#ffd1dc",
  },
  {
    name: "Corporate Teal",
    primaryColor: "#20b2aa",
    secondaryColor: "#178f87",
    backgroundColor: "#f0fdfa",
    textColor: "#0f766e",
    accentColor: "#5fd4cc",
  },
  {
    name: "Executive Purple",
    primaryColor: "#8b5cf6",
    secondaryColor: "#7c3aed",
    backgroundColor: "#faf5ff",
    textColor: "#581c87",
    accentColor: "#a78bfa",
  },
  {
    name: "Emerald Modern",
    primaryColor: "#10b981",
    secondaryColor: "#059669",
    backgroundColor: "#f0fdf4",
    textColor: "#14532d",
    accentColor: "#34d399",
  },
  {
    name: "Ruby Executive",
    primaryColor: "#e11d48",
    secondaryColor: "#be185d",
    backgroundColor: "#fef2f2",
    textColor: "#7f1d1d",
    accentColor: "#fb7185",
  },
  {
    name: "Amber Elite",
    primaryColor: "#f59e0b",
    secondaryColor: "#d97706",
    backgroundColor: "#fffbeb",
    textColor: "#78350f",
    accentColor: "#fbbf24",
  },
]

const CardCustomizationScreen: React.FC<CardCustomizationScreenProps> = ({
  navigation,
  route,
}) => {
  const { user, token } = useAuth()
  const [businessCard, setBusinessCard] = useState(
    route.params?.businessCard || null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("colors")
  const [hasExistingCustomization, setHasExistingCustomization] =
    useState(false)

  // Updated to match exact API response structure
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

  useEffect(() => {
    if (route.params?.businessCard) {
      setBusinessCard(route.params.businessCard)
      loadCustomizationSettings()
    }
    fetchCustomizationData()
  }, [route.params?.businessCard])

  const fetchCustomizationData = async () => {
    try {
      const response = await getData(
        endpoints.cardCustomization(businessCard._id)
      )
    } catch (error) {
      console.error("Error fetching business card:", error)
    }
  }

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
        setHasExistingCustomization(true)
      }
    } catch (error) {
      console.log("No existing customization found, using defaults")
      setHasExistingCustomization(false)
    }
  }

  const handleSettingChange = (
    key: keyof CustomizationSettings,
    value: any
  ) => {
    setCustomizationSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleThemeSelect = (theme: (typeof PresetThemes)[0]) => {
    setCustomizationSettings((prev) => ({
      ...prev,
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      backgroundColor: theme.backgroundColor,
      textColor: theme.textColor,
      accentColor: theme.accentColor,
      layout: "minimalist", //need to work on this
    }))
  }

  const handleSaveCustomization = async () => {
    if (!businessCard?._id) {
      Alert.alert("Error", "Business card not found")
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()

      formData.append("customization", JSON.stringify(customizationSettings))
      // let response

      // const response = await postData(
      //   endpoints.cardCustomization(businessCard._id),
      //   formData
      // )

      const response = await fetch(
        `${BASE_URL}/card-customization/${businessCard._id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      )

      Alert.alert("Success", "Customization settings saved successfully!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ])
    } catch (error: any) {
      console.error("Full error object:", error)
      console.error("Error response:", error.response?.data)
      console.error("Error status:", error.response?.status)

      let errorMessage = "Failed to save customization settings"

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.message) {
        errorMessage = error.message
      }

      Alert.alert("Error", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const TabButton = ({
    title,
    isActive,
    onPress,
    icon,
  }: {
    title: string
    isActive: boolean
    onPress: () => void
    icon: string
  }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        isActive && {
          ...styles.activeTabButton,
          borderBottomColor: customizationSettings.primaryColor,
        },
      ]}
      onPress={onPress}>
      <MaterialIcons
        name={icon as any}
        size={20}
        color={isActive ? customizationSettings.primaryColor : "#666"}
      />
      <Text
        style={[
          styles.tabText,
          isActive && {
            ...styles.activeTabText,
            color: customizationSettings.primaryColor,
          },
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  )

  const ThemePicker = () => (
    <View style={styles.themePickerContainer}>
      <Text style={styles.themePickerTitle}>Choose Theme</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.themesScrollView}
        contentContainerStyle={styles.themesContainer}>
        {PresetThemes.map((theme, index) => {
          const isSelected =
            theme.primaryColor === customizationSettings.primaryColor &&
            theme.secondaryColor === customizationSettings.secondaryColor &&
            theme.backgroundColor === customizationSettings.backgroundColor &&
            theme.textColor === customizationSettings.textColor

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.themeOption,
                isSelected && styles.selectedThemeOption,
              ]}
              onPress={() => handleThemeSelect(theme)}>
              <View style={styles.themeColors}>
                <View
                  style={[
                    styles.colorBox,
                    { backgroundColor: theme.primaryColor },
                  ]}
                />
              </View>
              <Text style={styles.themeName}>{theme.name}</Text>
              {isSelected && (
                <View style={styles.selectedIndicator}>
                  <MaterialIcons
                    name='check'
                    size={16}
                    color='#fff'
                  />
                </View>
              )}
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )

  const SettingToggle = ({
    title,
    description,
    value,
    onToggle,
  }: {
    title: string
    description: string
    value: boolean
    onToggle: () => void
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{
          false: "#767577",
          true: customizationSettings.primaryColor,
        }}
        thumbColor={value ? "#ffffff" : "#f4f3f4"}
      />
    </View>
  )

  const renderTabContent = () => {
    if (activeTab === "colors") {
      return (
        <View style={styles.tabContent}>
          <ThemePicker />
        </View>
      )
    } else {
      return (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Section Visibility</Text>
          <View style={styles.sectionContent}>
            <SettingToggle
              title='Personal Contact'
              description='Show personal phone and email'
              value={customizationSettings.showPersonalContact}
              onToggle={() =>
                handleSettingChange(
                  "showPersonalContact",
                  !customizationSettings.showPersonalContact
                )
              }
            />

            <SettingToggle
              title='Business Contact'
              description='Show business phone and email'
              value={customizationSettings.showBusinessContact}
              onToggle={() =>
                handleSettingChange(
                  "showBusinessContact",
                  !customizationSettings.showBusinessContact
                )
              }
            />

            <SettingToggle
              title='Social Media'
              description='Display social media links and icons'
              value={customizationSettings.showSocialMedia}
              onToggle={() =>
                handleSettingChange(
                  "showSocialMedia",
                  !customizationSettings.showSocialMedia
                )
              }
            />

            <SettingToggle
              title='Services Section'
              description='Show services section'
              value={customizationSettings.showServices}
              onToggle={() =>
                handleSettingChange(
                  "showServices",
                  !customizationSettings.showServices
                )
              }
            />

            <SettingToggle
              title='Products Section'
              description='Show products section'
              value={customizationSettings.showProducts}
              onToggle={() =>
                handleSettingChange(
                  "showProducts",
                  !customizationSettings.showProducts
                )
              }
            />

            <SettingToggle
              title='Gallery Section'
              description='Show gallery/portfolio section'
              value={customizationSettings.showGallery}
              onToggle={() =>
                handleSettingChange(
                  "showGallery",
                  !customizationSettings.showGallery
                )
              }
            />

            <SettingToggle
              title='QR Code'
              description='Show QR code for easy sharing'
              value={customizationSettings.showQR}
              onToggle={() =>
                handleSettingChange("showQR", !customizationSettings.showQR)
              }
            />

            <SettingToggle
              title='Animations'
              description='Enable card animations'
              value={customizationSettings.animations}
              onToggle={() =>
                handleSettingChange(
                  "animations",
                  !customizationSettings.animations
                )
              }
            />

            <SettingToggle
              title='Hover Effects'
              description='Enable hover interactions'
              value={customizationSettings.hoverEffects}
              onToggle={() =>
                handleSettingChange(
                  "hoverEffects",
                  !customizationSettings.hoverEffects
                )
              }
            />
          </View>
        </View>
      )
    }
  }

  if (!businessCard) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>No Business Card Found</Text>
            <Text style={styles.subtitle}>
              You need to create a business card first before customizing it.
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton
            title='Go Back'
            onPress={() => navigation.goBack()}
            iconName='arrow-back'
            backgroundColor='#6b7280'
          />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialIcons
              name='palette'
              size={28}
              color={customizationSettings.primaryColor}
              style={styles.titleIcon}
            />
            <Text style={styles.headerTitle}>Customize Card</Text>
          </View>
          <Text style={styles.subtitle}>
            Personalize colors and visibility settings
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.contentWrapper}
        showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {/* Tab Navigation */}
          <View style={styles.section}>
            <View style={styles.tabContainer}>
              <TabButton
                title='Colors & Theme'
                isActive={activeTab === "colors"}
                onPress={() => setActiveTab("colors")}
                icon='color-lens'
              />
              <TabButton
                title='Visibility'
                isActive={activeTab === "visibility"}
                onPress={() => setActiveTab("visibility")}
                icon='visibility'
              />
            </View>

            {renderTabContent()}
          </View>

          {/* Preview Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons
                name='preview'
                size={20}
                color={customizationSettings.primaryColor}
              />
              <Text style={styles.sectionTitle}>Live Preview</Text>
            </View>

            <View style={styles.previewContainer}>
              <CardDisplay
                businessCard={businessCard}
                customizationSettings={customizationSettings}
              />
            </View>
          </View>

          {/* Save/Cancel Buttons */}
          <View style={styles.buttonContainer}>
            <CustomButton
              title={isLoading ? "Saving..." : "Save Customization"}
              onPress={handleSaveCustomization}
              iconName='save'
              backgroundColor={customizationSettings.primaryColor}
              disabled={isLoading}
            />

            <CustomButton
              title='Cancel'
              onPress={() => navigation.goBack()}
              iconName='close'
              backgroundColor='#6b7280'
              style={styles.cancelButton}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

// Keep all existing styles unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 40,
  },
  headerContainer: {
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 8,
  },
  sectionContent: {
    padding: 20,
    paddingTop: 0,
  },
  // Tab styles
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    gap: 6,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#2196F3",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#2196F3",
    fontWeight: "600",
  },
  tabContent: {
    padding: 20,
  },
  // Theme picker styles
  themePickerContainer: {
    marginBottom: 10,
  },
  themePickerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  themesScrollView: {
    marginHorizontal: -5,
  },
  themesContainer: {
    paddingHorizontal: 5,
  },
  themeOption: {
    width: 140,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: "#f8f9fa",
    padding: 12,
    alignItems: "center",
    position: "relative",
  },
  selectedThemeOption: {
    borderColor: "#4a90e2",
    backgroundColor: "#f0f6fc",
  },
  themeColors: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 4,
  },
  colorBox: {
    width: "100%",
    height: 30,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  themeName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
    textAlign: "center",
    lineHeight: 16,
  },
  selectedIndicator: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4a90e2",
    justifyContent: "center",
    alignItems: "center",
  },
  // Setting toggle styles
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 18,
  },
  previewContainer: {
    padding: 20,
    paddingTop: 0,
  },
  buttonContainer: {
    marginTop: 20,
  },
  cancelButton: {
    marginTop: 8,
  },
})

export default CardCustomizationScreen
