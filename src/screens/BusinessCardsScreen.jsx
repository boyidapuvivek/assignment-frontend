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

export default function BusinessCardsScreen() {
  const [businessCards, setBusinessCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchBusinessCards()
  }, [])

  const fetchBusinessCards = async () => {
    try {
      const response = await cardAPI.getBusinessCards()
      setBusinessCards(response.data)
    } catch (error) {
      Alert.alert("Error", "Failed to fetch business cards")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCard = async (formData) => {
    setLoading(true)
    try {
      await cardAPI.createBusinessCard(formData)
      setIsCreating(false)
      fetchBusinessCards()
      Alert.alert("Success", "Business card created successfully!")
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to create business card"
      )
      setLoading(false)
    }
  }

  const handleDeleteCard = async (cardId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this business card?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await cardAPI.deleteBusinessCard(cardId)
              fetchBusinessCards()
              Alert.alert("Success", "Business card deleted successfully!")
            } catch (error) {
              Alert.alert("Error", "Failed to delete business card")
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
        <Text style={styles.title}>Business Cards</Text>
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
            title='Create Business Card'
          />
        </ScrollView>
      ) : (
        <CardList
          cards={businessCards}
          onDelete={handleDeleteCard}
          emptyMessage='No business cards yet. Create your first business card!'
        />
      )}
    </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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
