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
  if (cards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name='people-outline'
          size={64}
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
          key={card.id}
          style={styles.cardContainer}>
          <CardDisplay
            businessCard={{
              name: card.name,
              email: card.email,
              phone: card.phone,
              role: card.role,
              company: card.company,
              business_description: card.business_description,
              business_phone: card.business_phone,
              business_email: card.business_email,
              website: card.website,
              address: card.address,
              services: card.services || [],
              products: card.products || [],
              gallery: card.gallery?.map((img) => ({ url: img })) || [],
              business_cover_photo: card.business_cover_photo,
              profile_image: card.profile_image,
            }}
          />
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
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 24,
  },
  cardContainer: {
    marginBottom: 24,
    position: "relative",
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#f44336",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
})
