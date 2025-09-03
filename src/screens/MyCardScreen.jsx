import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import { userAPI } from "../utils/api"
import CardForm from "../components/CardForm"
import CardDisplay from "../components/CardDisplay"
import LoadingSpinner from "../components/LoadingSpinner"
import { COLORS } from "../utils/constants"

export default function MyCardScreen() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(!user?.isProfileComplete)
  const [loading, setLoading] = useState(false)

  const handleSave = async (formData) => {
    setLoading(true)
    try {
      const response = await userAPI.updateProfile(formData)
      updateUser(response.data.user)
      setIsEditing(false)
      Alert.alert("Success", "Profile updated successfully!")
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update profile"
      )
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
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
            <MaterialIcons
              name='account-circle'
              size={32}
              color={COLORS.primary}
              style={styles.titleIcon}
            />
            <Text style={styles.headerTitle}>My Digital Business Card</Text>
          </View>
          <Text style={styles.subtitle}>
            {user?.isProfileComplete
              ? "Your personal business card"
              : "Complete your profile to get started"}
          </Text>
        </View>
      </View>

      {/* Content Section */}
      <ScrollView
        style={styles.contentWrapper}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
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
                  {user?.isProfileComplete
                    ? "Edit Your Card"
                    : "Create Your Card"}
                </Text>
              </View>
              <CardForm
                onSubmit={handleSave}
                onCancel={
                  user?.isProfileComplete && (() => setIsEditing(false))
                }
                showCancel={user?.isProfileComplete}
                initialData={user}
              />
            </View>
          ) : (
            <>
              {/* Card Display Section */}
              <View style={styles.cardContainer}>
                <CardDisplay user={user} />
              </View>

              {/* Quick Actions Section */}
              <View style={styles.actionsContainer}>
                <View style={styles.actionsHeader}>
                  <MaterialIcons
                    name='settings'
                    size={20}
                    color='#6b7280'
                  />
                  <Text style={styles.actionsTitle}>Quick Actions</Text>
                </View>

                <TouchableOpacity
                  style={styles.editButton}
                  onPress={handleEdit}
                  activeOpacity={0.8}>
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
    backgroundColor: "#f8f9fa",
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
