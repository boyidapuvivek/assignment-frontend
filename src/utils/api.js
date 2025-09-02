import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

const BASE_URL = "http://192.168.2.119:5000/api"

// Create axios instance
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

// Auth API
export const authAPI = {
  login: (email, password) => {
    return api.post("/auth/login", { email, password })
  },
  register: (username, email, password) => {
    return api.post("/auth/register", { username, email, password })
  },
}

// User API
export const userAPI = {
  getProfile: () => {
    return api.get("/users/profile")
  },
  updateProfile: (data) => {
    return api.put("/users/profile", data)
  },
}

// Card API
export const cardAPI = {
  getMyCard: () => {
    return api.get("/cards/my-card")
  },
  getTeamCards: () => {
    return api.get("/cards/team")
  },
  getBusinessCards: () => {
    return api.get("/cards/business")
  },
  createTeamCard: (data) => {
    return api.post("/cards/team", data)
  },
  createBusinessCard: (data) => {
    return api.post("/cards/business", data)
  },
  updateTeamCard: (id, data) => {
    return api.put(`/cards/team/${id}`, data)
  },
  updateBusinessCard: (id, data) => {
    return api.put(`/cards/business/${id}`, data)
  },
  deleteTeamCard: (id) => {
    return api.delete(`/cards/team/${id}`)
  },
  deleteBusinessCard: (id) => {
    return api.delete(`/cards/business/${id}`)
  },
}
