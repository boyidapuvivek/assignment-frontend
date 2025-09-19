import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { useAuth } from "../../context/AuthContext"
import { useNavigation } from "@react-navigation/native"
import { authAPI } from "../../utils/api"
import { makeRedirectUri, useAuthRequest } from "expo-auth-session"
import * as WebBrowser from "expo-web-browser"
import Logo from "../../../assets/logo.svg"
import { COLORS } from "../../utils/constants"
import { FormData, AuthResult } from "../types/auth"

// Import form components
import LoginForm from "../../components/auth/LoginForm"
import RegisterForm from "../../components/auth/RegisterForm"
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm"

import {
  GoogleSignin,
  isSuccessResponse,
  isCancelledResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin"

type AuthMode = "login" | "register" | "forgot"

const AuthScreen: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>("login")
  const [loading, setLoading] = useState<boolean>(false)
  const [googleLoading, setGoogleLoading] = useState<boolean>(false)

  const { login, register, googleLogin } = useAuth()
  const navigation = useNavigation()

  const handleLogin = async (data: Partial<FormData>): Promise<void> => {
    setLoading(true)
    try {
      const result = await login(data.email!, data.password!)
      if (!result.success) {
        Alert.alert("Error", result.message)
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (data: Partial<FormData>): Promise<void> => {
    setLoading(true)
    const { name, email, password } = data
    try {
      const result = await register(name, email, password)

      if (result.success && result.requiresOTP) {
        navigation.navigate("OTPScreen", {
          email: data.email,
          name: data.name,
          password: data.password,
          isRegistration: true,
        })
      } else if (!result.success) {
        Alert.alert("Error", result.message)
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (
    data: Partial<FormData>
  ): Promise<void> => {
    setLoading(true)
    try {
      await authAPI.forgotPassword(data.email!, data.newPassword!)

      Alert.alert(
        "Success",
        "Password updated successfully! You can now login with your new password.",
        [
          {
            text: "OK",
            onPress: () => {
              setAuthMode("login")
            },
          },
        ]
      )
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update password"
      Alert.alert("Error", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const response = GoogleSignin.signIn()

      if (isSuccessResponse(response)) {
        const { idToken, user } = response.data
        const { name, email } = user
      }
    } catch (error) {}
  }

  const renderTabNavigation = (): JSX.Element | null => {
    if (authMode === "forgot") return null

    return (
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, authMode === "login" && styles.activeTab]}
          onPress={() => setAuthMode("login")}>
          <Text
            style={[
              styles.tabText,
              authMode === "login" && styles.activeTabText,
            ]}>
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, authMode === "register" && styles.activeTab]}
          onPress={() => setAuthMode("register")}>
          <Text
            style={[
              styles.tabText,
              authMode === "register" && styles.activeTabText,
            ]}>
            Register
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderCurrentForm = (): JSX.Element => {
    switch (authMode) {
      case "login":
        return (
          <LoginForm
            onSubmit={handleLogin}
            loading={loading}
            onSwitchMode={() => setAuthMode("register")}
            onForgotPassword={() => setAuthMode("forgot")}
            onGoogleLogin={handleGoogleLogin}
            googleLoading={googleLoading}
          />
        )
      case "register":
        return (
          <RegisterForm
            onSubmit={handleRegister}
            loading={loading}
            onSwitchMode={() => setAuthMode("login")}
          />
        )
      case "forgot":
        return (
          <ForgotPasswordForm
            onSubmit={handleForgotPassword}
            loading={loading}
            onBackToLogin={() => setAuthMode("login")}
          />
        )
      default:
        return (
          <LoginForm
            onSubmit={handleLogin}
            loading={loading}
            onGoogleLogin={handleGoogleLogin}
            googleLoading={googleLoading}
          />
        )
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.header}>
        <Logo
          width={180}
          height={80}
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}>
        {/* Header with Logo */}

        {/* Main Card */}
        <View style={styles.card}>
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <Text style={styles.welcomeTitle}>Welcome to Connectree</Text>
            <Text style={styles.subtitle}>
              Your professional business networking platform
            </Text>
          </View>

          {/* Tab Navigation */}
          {renderTabNavigation()}

          {/* Current Form */}
          {renderCurrentForm()}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default AuthScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 0,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginTop: 20,
    gap: 20,
  },
  cardHeader: {
    alignItems: "center",
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f1f3f4",
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 4,
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#333",
    fontWeight: "600",
  },
})
