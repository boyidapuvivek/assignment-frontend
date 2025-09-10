import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

const BASE_URL = "http://192.168.3.172:5000/api"

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

// Enhanced helper function to create FormData with support for arrays and objects
const createFormData = (data, imageFiles = {}) => {
  const formData = new FormData()
  // Add text fields with support for nested objects and arrays
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
      if (typeof data[key] === "object" && !Array.isArray(data[key])) {
        // Handle nested objects (like socialMediaLinks)
        formData.append(key, JSON.stringify(data[key]))
      } else if (Array.isArray(data[key])) {
        // Handle arrays (like services, products, gallery)
        formData.append(key, JSON.stringify(data[key]))
      } else {
        formData.append(key, String(data[key]))
      }
    }
  })

  // Add single image files
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

  // Add gallery images
  if (imageFiles.gallery && Array.isArray(imageFiles.gallery)) {
    imageFiles.gallery.forEach((image, index) => {
      formData.append("gallery", {
        uri: image.uri,
        type: "image/jpeg",
        name: `gallery_${index}.jpg`,
      })
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
  forgotPassword: (email, newPassword) => {
    return api.post("/auth/forgot-password", { email, newPassword })
  },
  // OTP APIs
  sendOTP: (name, email, password) => {
    return api.post("/auth/send-otp", { name, email, password })
  },
  verifyOTP: (email, otp) => {
    return api.post("/auth/verify-otp", { email, otp })
  },
  verifyResetOTP: (email, otp) => {
    return api.post("/auth/verify-reset-otp", { email, otp })
  },
  resendOTP: (email) => {
    return api.post("/auth/send-otp", { email })
  },
  // Updated Google Auth APIs
  googleCallback: (code, state) => {
    return api.post("/auth/google/callback", { code, state })
  },
  // New mobile Google auth endpoint
  googleMobileAuth: (authCode) => {
    return api.post("/auth/google/mobile", { code: authCode })
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
        transformRequest: () => formData,
      })
    } else {
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
  getUserBusinessCards: () => {
    return api.get("/business-cards/user")
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
    const hasImages = Object.keys(imageFiles).some(
      (key) =>
        imageFiles[key] &&
        (!Array.isArray(imageFiles[key]) || imageFiles[key].length > 0)
    )
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
    const hasImages = Object.keys(imageFiles).some(
      (key) =>
        imageFiles[key] &&
        (!Array.isArray(imageFiles[key]) || imageFiles[key].length > 0)
    )
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
