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
import { useAuth } from "../context/AuthContext"
import { Ionicons } from "@expo/vector-icons"
import { authAPI } from "../utils/api"

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    newPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()

  const handleSubmit = async () => {
    if (isForgotPassword) {
      // Handle forgot password
      if (!formData.email || !formData.newPassword) {
        Alert.alert("Error", "Please enter email and new password")
        return
      }
      handleForgotPassword()
    } else if (isLogin) {
      // Handle login
      if (!formData.email || !formData.password) {
        Alert.alert("Error", "Please fill in all required fields")
        return
      }
      handleLogin()
    } else {
      // Handle registration
      if (!formData.email || !formData.password || !formData.username) {
        Alert.alert("Error", "Please fill in all required fields")
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
      if (!result.success) {
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

  const switchToForgotPassword = () => {
    setIsForgotPassword(true)
    setIsLogin(false)
    setFormData({ username: "", email: "", password: "", newPassword: "" })
  }

  const switchToLogin = () => {
    setIsForgotPassword(false)
    setIsLogin(true)
    setFormData({ username: "", email: "", password: "", newPassword: "" })
  }

  const switchToRegister = () => {
    setIsForgotPassword(false)
    setIsLogin(false)
    setFormData({ username: "", email: "", password: "", newPassword: "" })
  }

  const getHeaderTitle = () => {
    if (isForgotPassword) return "Reset Password"
    return isLogin ? "Welcome back!" : "Create your account"
  }

  const getButtonText = () => {
    if (loading) return "Please wait..."
    if (isForgotPassword) return "Update Password"
    return isLogin ? "Login" : "Register"
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Ionicons
            name='card'
            size={50}
            color='#2196F3'
          />
          <Text style={styles.title}>Connect</Text>
          <Text style={styles.subtitle}>{getHeaderTitle()}</Text>
        </View>

        <View style={styles.form}>
          {!isLogin && !isForgotPassword && (
            <View style={styles.inputContainer}>
              <Ionicons
                name='person'
                size={20}
                color='#666'
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder='Username'
                value={formData.username}
                onChangeText={(value) => updateFormData("username", value)}
                autoCapitalize='none'
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Ionicons
              name='mail'
              size={20}
              color='#666'
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder='Email'
              value={formData.email}
              onChangeText={(value) => updateFormData("email", value)}
              keyboardType='email-address'
              autoCapitalize='none'
            />
          </View>

          {!isForgotPassword && (
            <View style={styles.inputContainer}>
              <Ionicons
                name='lock-closed'
                size={20}
                color='#666'
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder='Password'
                value={formData.password}
                onChangeText={(value) => updateFormData("password", value)}
                secureTextEntry
              />
            </View>
          )}

          {isForgotPassword && (
            <View style={styles.inputContainer}>
              <Ionicons
                name='key'
                size={20}
                color='#666'
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder='New Password'
                value={formData.newPassword}
                onChangeText={(value) => updateFormData("newPassword", value)}
                secureTextEntry
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}>
            <Text style={styles.buttonText}>{getButtonText()}</Text>
          </TouchableOpacity>

          {isLogin && !isForgotPassword && (
            <TouchableOpacity
              style={styles.forgotButton}
              onPress={switchToForgotPassword}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          {!isForgotPassword && (
            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.switchText}>
                {isLogin
                  ? "Don't have an account? Register"
                  : "Already have an account? Login"}
              </Text>
            </TouchableOpacity>
          )}

          {isForgotPassword && (
            <TouchableOpacity
              style={styles.switchButton}
              onPress={switchToLogin}>
              <Text style={styles.switchText}>Back to Login</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  form: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2196F3",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotButton: {
    marginTop: 15,
    alignItems: "center",
  },
  forgotText: {
    color: "#2196F3",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  switchButton: {
    marginTop: 20,
    alignItems: "center",
  },
  switchText: {
    color: "#2196F3",
    fontSize: 14,
  },
})
