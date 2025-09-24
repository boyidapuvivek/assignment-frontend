import React, { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { authAPI } from "../utils/api"
import { getData, postData } from "../api/apiServices"
import { endpoints } from "../api/ClientApi"

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
  const [profile, setProfile] = useState(null)

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
        // Fetch fresh profile data
        await fetchProfile(storedToken)
      }
    } catch (error) {
      console.error("Auth state check error:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProfile = async (authToken = null) => {
    try {
      const tokenToUse = authToken || token
      if (!tokenToUse) return

      const response = await getData(endpoints.getProfile)
      if (response.data?.user) {
        setProfile(response.data)
        // Update user data as well
        setUser(response.data.user)
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user))
      }
    } catch (error) {
      console.error("Profile fetch error:", error)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await postData(endpoints.login, { email, password })
      const { token: newToken, user: userData } = response.data

      await AsyncStorage.setItem("token", newToken)
      await AsyncStorage.setItem("user", JSON.stringify(userData))

      setToken(newToken)
      setUser(userData)

      // Fetch profile data after login
      await fetchProfile(newToken)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      }
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await postData(endpoints.register, {
        name,
        email,
        password,
      })
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
      // const response = await authAPI.verifyOTP(email, otp)
      const payload = { email, otp }
      const response = await postData(endpoints.verifyOTP, payload)
      console.log("OTP verified:", response)

      if (response.data?.token && response.data?.user) {
        const { token: newToken, user: userData } = response.data

        await AsyncStorage.setItem("token", newToken)
        await AsyncStorage.setItem("user", JSON.stringify(userData))

        setToken(newToken)
        setUser(userData)

        // Fetch profile data after verification
        await fetchProfile(newToken)

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

  const googleLogin = async (code, state) => {
    try {
      const response = await authAPI.googleCallback(code, state)
      console.log("Google login response:", response)

      if (response.data?.token && response.data?.user) {
        const { token: newToken, user: userData } = response.data

        await AsyncStorage.setItem("token", newToken)
        await AsyncStorage.setItem("user", JSON.stringify(userData))

        setToken(newToken)
        setUser(userData)

        // Fetch profile data after Google login
        await fetchProfile(newToken)

        return { success: true }
      }

      return {
        success: false,
        message: response.data?.message || "Google login failed",
      }
    } catch (error) {
      console.error("Google login error:", error)
      return {
        success: false,
        message: error.response?.data?.message || "Google login failed",
      }
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token")
      await AsyncStorage.removeItem("user")
      setToken(null)
      setUser(null)
      setProfile(null)
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
    profile,
    login,
    register,
    logout,
    updateUser,
    verifyOTPAndLogin,
    googleLogin,
    fetchProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
