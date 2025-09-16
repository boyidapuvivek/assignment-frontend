// screens/CardCustomizationScreen.tsx
import React, { useState } from "react"
import { View, Text, ScrollView, StyleSheet, Switch, Alert } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { COLORS } from "../utils/constants"
import Header from "../components/Header"
import CustomButton from "../components/CustomButton"

interface CardCustomizationScreenProps {
  navigation: any
}

const CardCustomizationScreen: React.FC<CardCustomizationScreenProps> = ({
  navigation,
}) => {
  const [settings, setSettings] = useState({
    showEmail: true,
    showPhone: true,
    showAddress: true,
    showWebsite: true,
    darkTheme: false,
    compactView: false,
  })

  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSaveCustomization = () => {
    // Here you would typically save to your backend or local storage
    Alert.alert("Success", "Customization settings saved successfully!", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ])
  }

  const SettingItem = ({
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
        trackColor={{ false: "#767577", true: COLORS.primary }}
        thumbColor={value ? COLORS.white : "#f4f3f4"}
      />
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialIcons
              name='palette'
              size={28}
              color={COLORS.primary}
              style={styles.titleIcon}
            />
            <Text style={styles.headerTitle}>Customize Card</Text>
          </View>
          <Text style={styles.subtitle}>
            Personalize how your business card appears
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.contentWrapper}
        showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {/* Visibility Settings */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons
                name='visibility'
                size={20}
                color={COLORS.primary}
              />
              <Text style={styles.sectionTitle}>Field Visibility</Text>
            </View>

            <View style={styles.sectionContent}>
              <SettingItem
                title='Show Email'
                description='Display email address on your card'
                value={settings.showEmail}
                onToggle={() => handleSettingChange("showEmail")}
              />
              <SettingItem
                title='Show Phone'
                description='Display phone number on your card'
                value={settings.showPhone}
                onToggle={() => handleSettingChange("showPhone")}
              />
              <SettingItem
                title='Show Address'
                description='Display business address on your card'
                value={settings.showAddress}
                onToggle={() => handleSettingChange("showAddress")}
              />
              <SettingItem
                title='Show Website'
                description='Display website URL on your card'
                value={settings.showWebsite}
                onToggle={() => handleSettingChange("showWebsite")}
              />
            </View>
          </View>

          {/* Appearance Settings */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons
                name='color-lens'
                size={20}
                color={COLORS.primary}
              />
              <Text style={styles.sectionTitle}>Appearance</Text>
            </View>

            <View style={styles.sectionContent}>
              <SettingItem
                title='Dark Theme'
                description='Use dark theme for your card'
                value={settings.darkTheme}
                onToggle={() => handleSettingChange("darkTheme")}
              />
              <SettingItem
                title='Compact View'
                description='Show information in a more compact layout'
                value={settings.compactView}
                onToggle={() => handleSettingChange("compactView")}
              />
            </View>
          </View>

          {/* Save Button */}
          <View style={styles.buttonContainer}>
            <CustomButton
              title='Save Customization'
              onPress={handleSaveCustomization}
              iconName='save'
              backgroundColor={COLORS.primary}
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
  buttonContainer: {
    marginTop: 20,
  },
  cancelButton: {
    marginTop: 8,
  },
})

export default CardCustomizationScreen
