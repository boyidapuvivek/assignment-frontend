import React, { useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function CardDisplay({ user }) {
  useEffect(() => {
    console.log(user)
  }, [user])

  const InfoRow = ({ icon, label, value }) => {
    if (!value) return null

    return (
      <View style={styles.infoRow}>
        <Ionicons
          name={icon}
          size={20}
          color='#2196F3'
        />
        <View style={styles.infoText}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons
            name='person'
            size={40}
            color='#fff'
          />
        </View>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.details}>
        <InfoRow
          icon='call'
          label='Phone'
          value={user?.phoneNumber}
        />
        <InfoRow
          icon='business'
          label='Business Name'
          value={user?.businessName}
        />
        <InfoRow
          icon='mail'
          label='Business Email'
          value={user?.businessEmail}
        />
        <InfoRow
          icon='call'
          label='Business Number'
          value={user?.businessNumber}
        />
        <InfoRow
          icon='location'
          label='Location'
          value={user?.location}
        />

        {user?.businessDescription && (
          <View style={styles.descriptionContainer}>
            <View style={styles.infoRow}>
              <Ionicons
                name='document-text'
                size={20}
                color='#2196F3'
              />
              <View style={styles.infoText}>
                <Text style={styles.label}>Business Description</Text>
                <Text style={styles.description}>
                  {user.businessDescription}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    backgroundColor: "#2196F3",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  details: {
    padding: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  infoText: {
    marginLeft: 15,
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#666",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginTop: 2,
  },
  descriptionContainer: {
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginTop: 2,
    lineHeight: 22,
  },
})
