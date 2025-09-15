import React from "react"
import { View, Text, ScrollView, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import BusinessCardsDisplay from "./BusinessesCardDisplay"
import { useNavigation } from "@react-navigation/native"

interface Card {
  id: string
  name?: string
  email?: string
  phone?: string
  role?: string
  department?: string
  profile_image?: string
  company?: string
  business_description?: string
  business_phone?: string
  business_email?: string
  business_cover_photo?: string
  website?: string
  address?: string
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
  gallery?: string[]
  theme?: string
  cardDesign?: {
    theme: string
    primaryColor: string
    secondaryColor: string
  }
  [key: string]: any
}

interface CardListProps {
  cards: Card[]
  emptyMessage: string
}

const CardList: React.FC<CardListProps> = ({ cards, emptyMessage }) => {
  const navigation = useNavigation<any>()

  const handleCardPress = (card: Card) => {
    navigation.navigate("DetailedCardScreen", {
      businessCard: {
        ...card,
        gallery: card.gallery?.map((img) => ({ url: img })) || [],
      },
    })
  }

  if (cards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name='search'
          size={64}
          color='#E5E7EB'
        />
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}>
      {cards.map((card) => (
        <View
          key={card.id}
          style={styles.cardContainer}>
          <BusinessCardsDisplay
            businessCard={{
              ...card,
              gallery: card.gallery?.map((img) => ({ url: img })) || [],
            }}
            onPress={() => handleCardPress(card)}
          />
        </View>
      ))}
    </ScrollView>
  )
}

export default CardList

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
    minHeight: 300,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 24,
    fontWeight: "500",
  },
  cardContainer: {
    marginBottom: 16,
  },
})
