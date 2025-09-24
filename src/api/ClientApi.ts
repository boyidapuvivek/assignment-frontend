import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import { useEffect } from "react"
import CardCustomizationScreen from "../screens/CardCustomizationScreen"

const BASE_URL = "https://connectree.co/api"
const IMAGE_BASE_URL = "https://connectree.co"

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

// Add response interceptor for better error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Axios error:', error);
    return Promise.reject(error);
  }
);

export const endpoints = {

  //AUTH APIs
  login: `${BASE_URL}/auth/login`,
  register: `${BASE_URL}/auth/send-otp`,
  forgotPassword: `${BASE_URL}/auth/forgot-password`,
  getProfile: `${BASE_URL}/auth/me`,

  // OTP APIs
  sendOTP: `${BASE_URL}/auth/send-otp`,
  verifyOTP: `${BASE_URL}/auth/verify-otp`,
  verifyResetOTP: `${BASE_URL}/auth/verify-reset-otp`,
  resendOTP: `${BASE_URL}/auth/send-otp`,

  //CardCustomizations
  cardCustomization: (id: string) => `${BASE_URL}/card-customization/${id}`,

  // Leads endpoints
  getLeads: `${BASE_URL}/leads/my-leads`,
  updateLeadStatus: (id: string) => `${BASE_URL}/leads/${id}/status`,

  // My Card endpoints
  getUserBusinessCard: `${BASE_URL}/business-cards/user`,
  updateBusinessCard: (id: string) => `${BASE_URL}/business-cards/${id}`,
  getBussinessCardById: (id: string) => `${BASE_URL}/business-cards/${id}`,
  createBusinessCard: `${BASE_URL}/business-cards`,

  // Saved Cards endpoints
  getSavedCards: `${BASE_URL}/business-cards/saved`,
  saveCard: (id: string) => `${BASE_URL}/business-cards/save/${id}`,
  unsaveCard: (id: string) => `${BASE_URL}/business-cards/unsave/${id}`,
  saveStatus: (id: string) => `${BASE_URL}/business-cards/save-status/${id}`,

  // Team Cards endpoints
  getTeamCards: `${BASE_URL}/team-card`,
  createTeamCard: `${BASE_URL}/team-card/create`,
  deleteTeamCard: (id: string) => `${BASE_URL}/team-card/${id}`,

  // Business Cards endpoints
  getBusinessCards: `${BASE_URL}/business-cards`,
  
  deleteBusinessCard: (id: string) => `${BASE_URL}/business-cards/${id}`,

  submitLeads: `${BASE_URL}/leads/submit`,
  sendMyCard: `${BASE_URL}/send-my-card/`,
};

export default api
export {BASE_URL,IMAGE_BASE_URL}