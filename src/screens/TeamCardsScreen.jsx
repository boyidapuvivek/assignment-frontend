import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { cardAPI } from "../utils/api"
import CardForm from "../components/CardForm"
import CardList from "../components/CardList"
import LoadingSpinner from "../components/LoadingSpinner"

export default function TeamCardsScreen() {
  const [teamCards, setTeamCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchTeamCards()
  }, [])

  const fetchTeamCards = async () => {
    try {
      const response = await cardAPI.getTeamCards()
      setTeamCards(response.data)
    } catch (error) {
      Alert.alert("Error", "Failed to fetch team cards")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCard = async (formData) => {
    setLoading(true)
    try {
      await cardAPI.createTeamCard(formData)
      setIsCreating(false)
      fetchTeamCards()
      Alert.alert("Success", "Team member created successfully!")
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to create team member"
      )
      setLoading(false)
    }
  }

  const handleDeleteCard = async (cardId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this team member?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await cardAPI.deleteTeamCard(cardId)
              fetchTeamCards()
              Alert.alert("Success", "Team member deleted successfully!")
            } catch (error) {
              Alert.alert("Error", "Failed to delete team member")
            }
          },
        },
      ]
    )
  }

  if (loading && !isCreating) {
    return <LoadingSpinner />
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {!isCreating && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsCreating(true)}>
            <Ionicons
              name='add'
              size={24}
              color='#fff'
            />
          </TouchableOpacity>
        )}
      </View>

      {isCreating ? (
        <ScrollView>
          <CardForm
            onSave={handleCreateCard}
            onCancel={() => setIsCreating(false)}
            showCancel={true}
            isCreating={true}
            title='Create Team Member'
          />
        </ScrollView>
      ) : (
        <CardList
          cards={teamCards}
          onDelete={handleDeleteCard}
          emptyMessage='No team members yet. Create your first team member!'
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
})
