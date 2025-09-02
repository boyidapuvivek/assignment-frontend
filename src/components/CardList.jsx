import React from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import CardDisplay from "./CardDisplay"

export default function CardList({ cards, onDelete, emptyMessage }) {
  if (cards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name='card-outline'
          size={60}
          color='#ccc'
        />
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    )
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {cards.map((card) => (
        <View
          key={card._id}
          style={styles.cardContainer}>
          <CardDisplay user={card} />
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(card._id)}>
            <Ionicons
              name='trash'
              size={20}
              color='#fff'
            />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 40,
  },
  cardContainer: {
    marginBottom: 20,
    position: "relative",
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#f44336",
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: "center",
    alignItems: "center",
  },
})
