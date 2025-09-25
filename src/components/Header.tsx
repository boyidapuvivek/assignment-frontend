import React, { useEffect } from "react"
import { StyleSheet, View, TouchableOpacity, Image, Text } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { useNavigation, CommonActions } from "@react-navigation/native"
import { useAuth } from "@context/AuthContext"
import { COLORS } from "@utils/constants"
import Logo from "@assets/icons/icon_logo.svg"
import { BASE_URL, IMAGE_BASE_URL } from "@api/ClientApi"

const Header = ({ outOfTabNavigation }: boolean) => {
  const navigation = useNavigation()
  const { user } = useAuth()

  const handleLogoPress = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "Main",
            params: { screen: "MyCard" },
          },
        ],
      })
    )
  }

  const handleNotificationPress = () => {
    // Placeholder for notification functionality
    console.log("Notification pressed")
  }

  const handleProfilePress = () => {
    navigation.navigate("Profile")
  }

  const getProfileImageUri = () => {
    if (profile?.user?.profile_image) {
      // Check if it's a full URL or relative path
      if (profile.user.profile_image.startsWith("http")) {
        return profile.user.profile_image
      } else {
        return `${IMAGE_BASE_URL}/${user.profile_image}`
      }
    }
    return null
  }

  return (
    <View style={styles.container}>
      {/* Logo */}
      <TouchableOpacity
        onPress={handleLogoPress}
        style={styles.logoContainer}>
        <Logo
          width={40}
          height={40}
        />
      </TouchableOpacity>

      {/* Right side icons */}
      <View style={styles.rightContainer}>
        {/* Notification icon */}
        <TouchableOpacity
          onPress={handleNotificationPress}
          style={styles.iconButton}>
          <MaterialIcons
            name='notifications-none'
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>

        {/* Profile picture */}
        <TouchableOpacity
          onPress={handleProfilePress}
          style={styles.profileButton}>
          {user.profile_image ? (
            //⚠️
            <Image
              source={{ uri: `${IMAGE_BASE_URL}${user.profile_image}` }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profilePlaceholder}>
              <MaterialIcons
                name='person'
                size={20}
                color='#fff'
              />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    height: "auto",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  logoContainer: {
    padding: 8,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconButton: {
    padding: 8,
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },
  profilePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
})
