// DetailedCardScreen.tsx
import React from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import CardDisplay from "../components/CardDisplay"
import { COLORS } from "../utils/constants"
import { ScrollView } from "react-native-gesture-handler"
import Header from "../components/Header"

interface BusinessCard {
  phone?: string
  email?: string
  address?: string
  company?: string
  business_email?: string
  business_phone?: string
  website?: string
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
  gallery?: Array<{
    url: string
  }>
  business_cover_photo?: string
  profile_image?: string
  name?: string
  role?: string
  business_description?: string
}

interface DetailedCardScreenProps {
  route: {
    params: {
      businessCard: BusinessCard
    }
  }
  navigation: any
}

const DetailedCardScreen: React.FC<DetailedCardScreenProps> = ({
  route,
  navigation,
}) => {
  const { businessCard } = route.params

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons
            name='arrow-back'
            size={24}
            color='#333'
          />
        </TouchableOpacity>
        {/* <Text style={styles.headerTitle}>Business Card</Text> */}
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Card Display */}
        <View style={styles.cardContainer}>
          <CardDisplay businessCard={businessCard} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default DetailedCardScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  cardContainer: {
    flex: 1,
    padding: 20,
  },
})
