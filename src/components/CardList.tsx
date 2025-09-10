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

interface Card {
  id: string
  // Add other card properties as needed
  [key: string]: any
}

interface CardListProps {
  cards: Card[]
  onDelete: (cardId: string) => void
  emptyMessage: string
}

interface TrashButtonProps {
  cardId: string
}

const CardList: React.FC<CardListProps> = ({
  cards,
  onDelete,
  emptyMessage,
}) => {
  const TrashButton: React.FC<TrashButtonProps> = ({ cardId }) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => onDelete(cardId)}>
      <Ionicons
        name='trash'
        size={18}
        color='#fff'
      />
    </TouchableOpacity>
  )

  if (cards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name='documents-outline'
          size={80}
          color='#ccc'
        />
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    )
  }

  return (
    <ScrollView>
      {cards.map((card) => (
        <View
          key={card.id}
          style={styles.cardContainer}>
          <CardDisplay businessCard={card}>
            <TrashButton cardId={card.id} />
          </CardDisplay>
        </View>
      ))}
    </ScrollView>
  )
}

export default CardList

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
    marginBottom: 50,
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
