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
} from "react-native"
import { useAuth } from "../../context/AuthContext"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { authAPI } from "../../utils/api"
import Logo from "../../../assets/logo.svg"
import Google from "../../../assets/icons/google_icon.svg"
import { COLORS } from "../../utils/constants"

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

  const { login, register } = useAuth()
  const navigation = useNavigation()

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
      // If login is successful, user state will be updated automatically
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

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleGoogleLogin = () => {
    // Implement Google login logic here
    Alert.alert("Info", "Google login functionality to be implemented")
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <Logo
            width={120}
            height={40}
          />
        </View>

        {/* Main Card */}
        <View style={styles.card}>
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
                  value={formData.newPassword}
                  onChangeText={(value) => updateFormData("newPassword", value)}
                  secureTextEntry
                />
              </View>
            )}

            {/* Terms of Service Checkbox for Registration */}
            {!isLogin && !isForgotPassword && (
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    agreeToTerms && styles.checkboxChecked,
                  ]}
                  onPress={() => setAgreeToTerms(!agreeToTerms)}>
                  {agreeToTerms && (
                    <Ionicons
                      name='checkmark'
                      size={12}
                      color='#fff'
                    />
                  )}
                </TouchableOpacity>
                <Text style={styles.checkboxText}>
                  I agree to the{" "}
                  <Text style={styles.linkText}>Terms of Service</Text>
                </Text>
              </View>
            )}

            {/* Main Action Button */}
            <TouchableOpacity
              style={[styles.mainButton, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}>
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
                  style={styles.googleButton}
                  onPress={handleGoogleLogin}>
                  <Google
                    width={20}
                    height={20}
                  />
                  <Text style={styles.googleButtonText}>Google</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Footer Links */}
            <View style={styles.footer}>
              {isLogin && !isForgotPassword && (
                <TouchableOpacity onPress={() => setIsForgotPassword(true)}>
                  <Text style={styles.footerText}>
                    <Text style={styles.linkText}>Forgot Password?</Text>
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
                  <Text style={styles.footerText}>
                    <Text style={styles.linkText}>Back to Login</Text>
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
