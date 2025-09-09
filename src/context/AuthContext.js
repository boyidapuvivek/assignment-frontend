import React, { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { authAPI } from "../utils/api"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token")
      const storedUser = await AsyncStorage.getItem("user")
      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Auth state check error:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password)
      console.log("😊", response)
      const { token: newToken, user: userData } = response.data

      await AsyncStorage.setItem("token", newToken)
      await AsyncStorage.setItem("user", JSON.stringify(userData))
      setToken(newToken)
      setUser(userData)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      }
    }
  }

  const register = async (username, email, password) => {
    try {
      // Call send-otp API instead of direct registration
      const response = await authAPI.sendOTP(username, email, password)
      console.log("OTP sent:", response)

      return {
        success: true,
        requiresOTP: true,
        message: response.data?.message || "OTP sent successfully",
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      }
    }
  }

  const verifyOTPAndLogin = async (email, otp) => {
    try {
      const response = await authAPI.verifyOTP(email, otp)
      console.log("OTP verified:", response)

      if (response.data?.token && response.data?.user) {
        const { token: newToken, user: userData } = response.data

        await AsyncStorage.setItem("token", newToken)
        await AsyncStorage.setItem("user", JSON.stringify(userData))
        setToken(newToken)
        setUser(userData)

        return { success: true }
      }

      return {
        success: false,
        message: response.data?.message || "OTP verification failed",
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "OTP verification failed",
      }
    }
  }

  const loginWithToken = async (token, userData) => {
    try {
      await AsyncStorage.setItem("token", token)
      await AsyncStorage.setItem("user", JSON.stringify(userData))
      setToken(token)
      setUser(userData)
      return { success: true }
    } catch (error) {
      console.error("Token login error:", error)
      return { success: false, message: "Failed to authenticate with token" }
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token")
      await AsyncStorage.removeItem("user")
      setToken(null)
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const updateUser = (userData) => {
    setUser(userData)
    AsyncStorage.setItem("user", JSON.stringify(userData))
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    verifyOTPAndLogin,
    loginWithToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
