// import api from './ClientApi';
import { Alert } from 'react-native';
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { endpoints } from './ClientApi';
import api from './ClientApi';


// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

//testing
// export const API = {
//     getData : (endpoint: string) => {
//         return api.get(endpoint)
//     }
// }


// GET requests
export async function getData(endpoint: string, params?: object) {
  try {
      
    const response = await api.get(endpoint, { params });
    return response;
} catch (error: any) {                           
    console.error(`GET ${endpoint} failed:`, error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch data');
  }
}

// POST requests
export async function postData(endpoint: string, payload: object, params?: object) {
  try {
    const response = await api.post(endpoint, payload, params);
    return response;
    
  } catch (error: any) {
    console.error(`POST ${endpoint} failed:`, error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to create data');
  }
}

// PUT requests
export async function putData(endpoint: string, payload: object ,params?: object) {
  try {
    const response = await api.put(endpoint, payload, params);
    return response;
  } catch (error: any) {
    console.error(`PUT ${endpoint} failed:`, error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to update data');
  }
}

// DELETE requests
export async function deleteData(endpoint: string, params?: object) {
  try {
    const response = await api.delete(endpoint, params);
    return response;
  } catch (error: any) {
    console.error(`DELETE ${endpoint} failed:`, error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to delete data');
  }
}

// Optional: Helper function for common error handling
export function handleApiError(error: any, customMessage?: string) {
  const message = customMessage || error.message || 'An error occurred';
  console.error('API Error:', error);
  Alert.alert('Error', message);
}
