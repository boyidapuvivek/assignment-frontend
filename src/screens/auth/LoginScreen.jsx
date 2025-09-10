import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native"
import { useAuth } from "../../context/AuthContext"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { authAPI } from "../../utils/api"
import { makeRedirectUri, useAuthRequest } from "expo-auth-session"
import * as WebBrowser from "expo-web-browser"
import Logo from "../../../assets/logo.svg"
import Google from "../../../assets/icons/google_icon.svg"
import { COLORS } from "../../utils/constants"

// This is required for web browser to close properly
WebBrowser.maybeCompleteAuthSession()

// Google OAuth discovery endpoints
const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://www.googleapis.com/oauth2/v4/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
}

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    newPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const { login, register, googleLogin } = useAuth()
  const navigation = useNavigation()

  // Google OAuth setup
  const redirectUri = makeRedirectUri({
    scheme: "businesscardapp", // Your existing scheme
    path: "auth",
  })

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId:
        process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ||
        "927800798267-osn2cmpqovt0rnmh6aspnrte5clf54o4.apps.googleusercontent.com",
      scopes: ["openid", "profile", "email"],
      redirectUri,
      responseType: "code", // Use authorization code flow for better security
    },
    discovery
  )

  // Handle Google OAuth response
  useEffect(() => {
    if (response?.type === "success") {
      handleGoogleAuthSuccess(response.params.code)
    } else if (response?.type === "error") {
      console.error("Google auth error:", response.error)
      Alert.alert(
        "Login Error",
        response.error?.message || "Google authentication failed"
      )
      setGoogleLoading(false)
    } else if (response?.type === "dismiss" || response?.type === "cancel") {
      console.log("Google auth cancelled")
      setGoogleLoading(false)
    }
  }, [response])

  const handleGoogleAuthSuccess = async (authCode) => {
    try {
      console.log("Received auth code:", authCode)

      // Send authorization code to backend
      const result = await authAPI.googleMobileAuth(authCode)

      if (result.data.success) {
        // Use existing googleLogin function from AuthContext
        const loginResult = await googleLogin(
          result.data.token,
          result.data.user
        )

        if (loginResult.success) {
          console.log("Google login successful")
          // Navigation will be handled by AuthContext
        } else {
          Alert.alert(
            "Login Error",
            loginResult.message || "Failed to complete Google login"
          )
        }
      } else {
        Alert.alert(
          "Login Error",
          result.data.message || "Google authentication failed"
        )
      }
    } catch (error) {
      console.error("Google auth backend error:", error)
      Alert.alert(
        "Login Error",
        error.response?.data?.message || "Failed to authenticate with server"
      )
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (isForgotPassword) {
      if (!formData.email || !formData.newPassword) {
        Alert.alert("Error", "Please enter email and new password")
        return
      }
      handleForgotPassword()
    } else if (isLogin) {
      if (!formData.email || !formData.password) {
        Alert.alert("Error", "Please fill in all required fields")
        return
      }
      handleLogin()
    } else {
      if (
        !formData.email ||
        !formData.password ||
        !formData.username ||
        !formData.confirmPassword
      ) {
        Alert.alert("Error", "Please fill in all required fields")
        return
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert("Error", "Passwords don't match")
        return
      }
      if (!agreeToTerms) {
        Alert.alert("Error", "Please agree to the Terms of Service")
        return
      }
      handleRegister()
    }
  }

  const handleLogin = async () => {
    setLoading(true)
    try {
      const result = await login(formData.email, formData.password)
      if (!result.success) {
        Alert.alert("Error", result.message)
      }
      // If login is successful, user state will be updated automatically and navigation will happen
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    setLoading(true)
    try {
      const result = await register(
        formData.username,
        formData.email,
        formData.password
      )
      if (result.success && result.requiresOTP) {
        // Navigate to OTP screen after successful OTP send
        navigation.navigate("OTPScreen", {
          email: formData.email,
          username: formData.username,
          password: formData.password,
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

  const handleForgotPassword = async () => {
    setLoading(true)
    try {
      const response = await authAPI.forgotPassword(
        formData.email,
        formData.newPassword
      )
      Alert.alert(
        "Success",
        "Password updated successfully! You can now login with your new password.",
        [
          {
            text: "OK",
            onPress: () => {
              setIsForgotPassword(false)
              setIsLogin(true)
              setFormData({
                username: "",
                email: formData.email,
                password: "",
                confirmPassword: "",
                newPassword: "",
              })
            },
          },
        ]
      )
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update password"
      Alert.alert("Error", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    if (!request) {
      Alert.alert("Error", "Google sign-in is not ready yet. Please try again.")
      return
    }

    setGoogleLoading(true)

    try {
      console.log("Starting Google OAuth flow with redirect URI:", redirectUri)
      // This will trigger the Google sign-in flow
      await promptAsync()
      // Response will be handled in useEffect
    } catch (error) {
      console.error("Google sign-in error:", error)
      Alert.alert(
        "Login Error",
        error.message || "Failed to start Google sign-in"
      )
      setGoogleLoading(false)
    }
  }

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const switchToLogin = () => {
    setIsForgotPassword(false)
    setIsLogin(true)
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      newPassword: "",
    })
  }

  const switchToRegister = () => {
    setIsForgotPassword(false)
    setIsLogin(false)
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      newPassword: "",
    })
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps='handled'>
        {/* Header with Logo */}
        <View style={styles.header}>
          <Logo
            width={150}
            height={50}
          />
        </View>

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
          {!isForgotPassword && (
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, isLogin && styles.activeTab]}
                onPress={switchToLogin}>
                <Text style={[styles.tabText, isLogin && styles.activeTabText]}>
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, !isLogin && styles.activeTab]}
                onPress={switchToRegister}>
                <Text
                  style={[styles.tabText, !isLogin && styles.activeTabText]}>
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Form Fields */}
          <View style={styles.form}>
            {!isLogin && !isForgotPassword && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder='Enter your full name'
                  value={formData.username}
                  onChangeText={(value) => updateFormData("username", value)}
                  autoCapitalize='words'
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder='Enter your email'
                value={formData.email}
                onChangeText={(value) => updateFormData("email", value)}
                keyboardType='email-address'
                autoCapitalize='none'
              />
            </View>

            {!isForgotPassword && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder='Enter your password'
                    value={formData.password}
                    onChangeText={(value) => updateFormData("password", value)}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}>
                    <Ionicons
                      name={showPassword ? "eye" : "eye-off"}
                      size={20}
                      color='#666'
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {!isLogin && !isForgotPassword && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder='Confirm your password'
                    value={formData.confirmPassword}
                    onChangeText={(value) =>
                      updateFormData("confirmPassword", value)
                    }
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}>
                    <Ionicons
                      name={showConfirmPassword ? "eye" : "eye-off"}
                      size={20}
                      color='#666'
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {isForgotPassword && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>New Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder='Enter your new password'
                  value={formData.newPassword}
                  onChangeText={(value) => updateFormData("newPassword", value)}
                  secureTextEntry
                />
              </View>
            )}

            {/* Terms of Service Checkbox for Registration */}
            {!isLogin && !isForgotPassword && (
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setAgreeToTerms(!agreeToTerms)}>
                <View
                  style={[
                    styles.checkbox,
                    agreeToTerms && styles.checkboxChecked,
                  ]}>
                  {agreeToTerms && (
                    <Ionicons
                      name='checkmark'
                      size={12}
                      color='#fff'
                    />
                  )}
                </View>
                <Text style={styles.checkboxText}>
                  I agree to the{" "}
                  <Text style={styles.linkText}>Terms of Service</Text>
                </Text>
              </TouchableOpacity>
            )}

            {/* Main Action Button */}
            <TouchableOpacity
              style={[
                styles.mainButton,
                (loading || (!agreeToTerms && !isLogin && !isForgotPassword)) &&
                  styles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={
                loading || (!agreeToTerms && !isLogin && !isForgotPassword)
              }>
              <Text style={styles.mainButtonText}>
                {loading
                  ? "Please wait..."
                  : isForgotPassword
                  ? "Update Password"
                  : isLogin
                  ? "Login"
                  : "Register & Send OTP"}
              </Text>
            </TouchableOpacity>

            {/* Continue With Section for Login */}
            {isLogin && !isForgotPassword && (
              <>
                <Text style={styles.continueWithText}>CONTINUE WITH</Text>
                <TouchableOpacity
                  style={[
                    styles.googleButton,
                    googleLoading && styles.buttonDisabled,
                  ]}
                  onPress={handleGoogleLogin}
                  disabled={!request || googleLoading}>
                  {googleLoading ? (
                    <ActivityIndicator
                      size='small'
                      color='#666'
                    />
                  ) : (
                    <Google
                      width={20}
                      height={20}
                    />
                  )}
                  <Text style={styles.googleButtonText}>
                    {googleLoading ? "Connecting..." : "Google"}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* Footer Links */}
            <View style={styles.footer}>
              {isLogin && !isForgotPassword && (
                <TouchableOpacity onPress={() => setIsForgotPassword(true)}>
                  <Text style={[styles.footerText, styles.linkText]}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              )}

              {!isForgotPassword && (
                <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                  <Text style={styles.footerText}>
                    {isLogin
                      ? "Don't have an account? "
                      : "Already have an account? "}
                    <Text style={styles.linkText}>
                      {isLogin ? "Register now" : "Click here to Login"}
                    </Text>
                  </Text>
                </TouchableOpacity>
              )}

              {isForgotPassword && (
                <TouchableOpacity onPress={switchToLogin}>
                  <Text style={[styles.footerText, styles.linkText]}>
                    Back to Login
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

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
    marginBottom: 30,
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
  form: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#e1e1e1",
    borderRadius: 4,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#4A90E2",
    borderColor: "#4A90E2",
  },
  checkboxText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  linkText: {
    color: "#4A90E2",
    fontWeight: "500",
  },
  mainButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 25,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  mainButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  continueWithText: {
    textAlign: "center",
    fontSize: 12,
    color: "#999",
    marginBottom: 15,
    letterSpacing: 1,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e1e1e1",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 20,
  },
  googleButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
})
