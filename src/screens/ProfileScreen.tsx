import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native"
import { MaterialIcons, Ionicons, Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useAuth } from "@context/AuthContext"
import LoadingSpinner from "@components/LoadingSpinner"
import { COLORS } from "@utils/constants"
import Header from "@components/Header"
import { IMAGE_BASE_URL } from "@api/ClientApi"

export default function ProfileScreen() {
  const navigation = useNavigation()
  const { user, profile, fetchProfile, logout } = useAuth()
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (!profile) {
      fetchProfile()
    }
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchProfile()
    setRefreshing(false)
  }

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: logout,
      },
    ])
  }

  const getImageUri = (imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith("http")) {
      return imagePath
    } else {
      return `${IMAGE_BASE_URL}${imagePath}`
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (!profile) {
    return <LoadingSpinner />
  }

  const profileData = profile.user

  return (
    <View style={styles.container}>
      <Header />
      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          showsVerticalScrollIndicator={false}>
          {/* Header with Cover Image */}
          <View style={styles.headerContainer}>
            {getImageUri(profileData.cover_image) ? (
              <Image
                source={{ uri: getImageUri(profileData.cover_image) }}
                style={styles.coverImage}
                resizeMode='cover'
              />
            ) : (
              <View style={styles.defaultCoverImage}>
                <MaterialIcons
                  name='landscape'
                  size={60}
                  color='#fff'
                />
              </View>
            )}

            {/* Back button */}
            {/* <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Ionicons
              name='arrow-back'
              size={24}
              color='#fff'
            />
          </TouchableOpacity> */}

            {/* Edit Profile Button */}
            <TouchableOpacity style={styles.editButton}>
              <Feather
                name='edit'
                size={16}
                color='#333'
              />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>

            <View style={styles.textBackdrop} />
            {/* Profile Content */}
            <View style={styles.profileHeader}>
              {/* Semi-transparent background for better text visibility */}

              {/* Profile Image */}
              <View style={styles.profileImageContainer}>
                {getImageUri(profileData.profile_image) ? (
                  <Image
                    source={{ uri: getImageUri(profileData.profile_image) }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.defaultProfileImage}>
                    <MaterialIcons
                      name='person'
                      size={40}
                      color='#fff'
                    />
                  </View>
                )}
              </View>

              {/* User Info */}
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{profileData.name}</Text>
                <Text style={styles.userRole}>
                  {profileData.role || "User"}
                </Text>
              </View>
            </View>
          </View>

          {/* About Section */}
          <View style={styles.aboutContainer}>
            <Text style={styles.aboutTitle}>About</Text>

            <View style={styles.aboutContent}>
              {/* Phone */}
              <View style={styles.aboutItem}>
                <View style={styles.aboutIcon}>
                  <Feather
                    name='phone'
                    size={18}
                    color='#666'
                  />
                </View>
                <Text style={styles.aboutText}>{profileData.mobile}</Text>
              </View>

              {/* Email */}
              <View style={styles.aboutItem}>
                <View style={styles.aboutIcon}>
                  <Feather
                    name='mail'
                    size={18}
                    color='#666'
                  />
                </View>
                <Text style={styles.aboutText}>{profileData.email}</Text>
              </View>

              {/* Joined Date */}
              <View style={styles.aboutItem}>
                <View style={styles.aboutIcon}>
                  <Feather
                    name='calendar'
                    size={18}
                    color='#666'
                  />
                </View>
                <Text style={styles.aboutText}>
                  Joined {formatDate(profileData.created_at)}
                </Text>
              </View>

              {/* Plan */}
              <View style={styles.aboutItem}>
                <View style={styles.aboutIcon}>
                  <Feather
                    name='star'
                    size={18}
                    color='#666'
                  />
                </View>
                <Text style={styles.aboutText}>
                  {profileData.plan
                    ? profileData.plan.charAt(0).toUpperCase() +
                      profileData.plan.slice(1)
                    : "Basic"}{" "}
                  Plan
                </Text>
              </View>

              {profile.hasCompany && (
                <View style={styles.aboutItem}>
                  <View style={styles.aboutIcon}>
                    <Feather
                      name='briefcase'
                      size={18}
                      color='#666'
                    />
                  </View>
                  <Text style={styles.aboutText}>Has Company</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
      {/* Additional Actions */}
      <View style={styles.actionsContainer}>
        {/* <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons
              name='settings'
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.actionButtonText}>Settings</Text>
          </TouchableOpacity> */}

        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={handleLogout}>
          <MaterialIcons
            name='logout'
            size={20}
            color='#EF4444'
          />
          <Text style={[styles.actionButtonText, styles.logoutButtonText]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 40,
    justifyContent: "space-between",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 30,
  },
  headerContainer: {
    height: 280,
    position: "relative",
    overflow: "hidden",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  defaultCoverImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#3F51B5",
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  profileHeader: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  textBackdrop: {
    position: "absolute",
    bottom: -15,
    left: -15,
    right: -15,
    top: -15,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    zIndex: 0,
  },
  profileImageContainer: {
    marginRight: 20,
    zIndex: 1,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#fff",
  },
  defaultProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  userInfo: {
    flex: 1,
    zIndex: 1,
  },
  userName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  userRole: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.95)",
    fontWeight: "400",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  aboutContainer: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  aboutTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
  },
  aboutContent: {
    gap: 16,
  },
  aboutItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  aboutIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  aboutText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "400",
    flex: 1,
  },
  actionsContainer: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  logoutButtonText: {
    color: "#EF4444",
  },
})
