import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

const BASE_URL = "http://192.168.2.119:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
})

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Helper function to create FormData - FIXED VERSION
const createFormData = (data, imageFiles = {}) => {
  const formData = new FormData()

  // Add text fields
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
      formData.append(key, String(data[key]))
    }
  })

  // Add image files - CORRECTED FORMAT
  if (imageFiles.avatar) {
    formData.append("avatar", {
      uri: imageFiles.avatar.uri,
      type: "image/jpeg",
      name: "avatar.jpg",
    })
  }

  if (imageFiles.coverImage) {
    formData.append("coverImage", {
      uri: imageFiles.coverImage.uri,
      type: "image/jpeg",
      name: "cover.jpg",
    })
  }

  return formData
}

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
  updateProfile: (data, imageFiles = {}) => {
    const hasImages = Object.keys(imageFiles).some((key) => imageFiles[key])

    if (hasImages) {
      const formData = createFormData(data, imageFiles)
      return api.put("/users/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: () => formData, // Important for React Native
      })
    } else {
      // Send as JSON if no images
      return api.put("/users/profile", data)
    }
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
  createTeamCard: (data, imageFiles = {}) => {
    const hasImages = Object.keys(imageFiles).some((key) => imageFiles[key])

    if (hasImages) {
      const formData = createFormData(data, imageFiles)
      return api.post("/cards/team", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: () => formData,
      })
    } else {
      return api.post("/cards/team", data)
    }
  },
  createBusinessCard: (data, imageFiles = {}) => {
    const hasImages = Object.keys(imageFiles).some((key) => imageFiles[key])

    if (hasImages) {
      const formData = createFormData(data, imageFiles)
      return api.post("/cards/business", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: () => formData,
      })
    } else {
      return api.post("/cards/business", data)
    }
  },
  updateTeamCard: (id, data, imageFiles = {}) => {
    const hasImages = Object.keys(imageFiles).some((key) => imageFiles[key])

    if (hasImages) {
      const formData = createFormData(data, imageFiles)
      return api.put(`/cards/team/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: () => formData,
      })
    } else {
      return api.put(`/cards/team/${id}`, data)
    }
  },
  updateBusinessCard: (id, data, imageFiles = {}) => {
    const hasImages = Object.keys(imageFiles).some((key) => imageFiles[key])

    if (hasImages) {
      const formData = createFormData(data, imageFiles)
      return api.put(`/cards/business/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: () => formData,
      })
    } else {
      return api.put(`/cards/business/${id}`, data)
    }
  },
  deleteTeamCard: (id) => {
    return api.delete(`/cards/team/${id}`)
  },
  deleteBusinessCard: (id) => {
    return api.delete(`/cards/business/${id}`)
  },
}
