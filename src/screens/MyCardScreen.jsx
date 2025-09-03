import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native"
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Digital Business Card</Text>
      </View>

      {isEditing ? (
        <CardForm
          initialData={user}
          onSave={handleSave}
          onCancel={() => user?.isProfileComplete && setIsEditing(false)}
          showCancel={user?.isProfileComplete}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.dataContainer}>
            <CardDisplay
              user={user}
              title={"My Digital Bussiness Card"}
            />
            <View style={styles.quickActions}>
              <Text>Quick Actions</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleEdit}>
                <Text style={styles.editButtonText}>Edit Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 40,
    paddingTop: 20,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  editButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  quickActions: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderColor: COLORS.border,
    gap: 10,
  },
  dataContainer: {
    gap: 30,
    paddingBottom: 50,
  },
})
