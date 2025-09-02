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
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEdit}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {isEditing ? (
        <CardForm
          initialData={user}
          onSave={handleSave}
          onCancel={() => user?.isProfileComplete && setIsEditing(false)}
          showCancel={user?.isProfileComplete}
        />
      ) : (
        <CardDisplay user={user} />
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
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
})
