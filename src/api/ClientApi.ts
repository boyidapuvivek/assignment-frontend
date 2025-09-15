import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import { useEffect } from "react"
const BASE_URL = "http://192.168.3.172:5000/api"

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


export const endpoints = {

  //AUTH APIs
  login: `${BASE_URL}/auth/login`,
  register: `${BASE_URL}/auth/register`,
  forgotPassword: `${BASE_URL}/auth/forgot-password`,
  getProfile: `${BASE_URL}/auth/me`,

  // OTP APIs
  sendOTP: `${BASE_URL}/auth/send-otp`,
  verifyOTP: `${BASE_URL}/auth/verify-otp`,
  verifyResetOTP: `${BASE_URL}/auth/verify-reset-otp`,
  resendOTP: `${BASE_URL}/auth/send-otp`,


  // Leads endpoints
  getLeads: `${BASE_URL}/leads/my-leads`,
  updateLeadStatus: (id: string) => `${BASE_URL}/leads/${id}/status`,

  // My Card endpoints
  getUserBusinessCard: `${BASE_URL}/business-cards/user`,
  updateBusinessCard: (id: string) => `${BASE_URL}/business-cards/${id}`,
  createBusinessCard: `${BASE_URL}/business-cards`,

  // Saved Cards endpoints
  getSavedCards: `${BASE_URL}/business-cards/saved`,
  saveCard:(id: string) => `${BASE_URL}/business-cards/save/${id}`,
  unsaveCard: (id: string) => `${BASE_URL}/business-cards/unsave/${id}`,
  saveStatus: (id: string) => `${BASE_URL}/business-cards/save-status/${id}`,

  // Team Cards endpoints
  getTeamCards: `${BASE_URL}/team-card`,
  deleteTeamCard: (id: string) => `${BASE_URL}/team-card/${id}`,

  // Business Cards endpoints
  getBusinessCards: `${BASE_URL}/business-cards`,
  deleteBusinessCard: (id: string) => `${BASE_URL}/business-cards/${id}`,


};

export default api