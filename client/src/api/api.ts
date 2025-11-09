// src/api/axiosInstance.ts
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const BASEURL = 'http://localhost:3618'

// Base config
export const axiosBase = axios.create({
  baseURL: BASEURL,
  withCredentials: false,
})

// Config thêm token
export const axiosAuth = axios.create({
  baseURL: BASEURL,
  withCredentials: false,
})

axiosAuth.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
