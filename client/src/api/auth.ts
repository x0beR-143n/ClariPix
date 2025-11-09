// src/api/auth.ts
import { axiosBase, axiosAuth } from './api'
import { useAuthStore } from '../store/authStore'
import { RegisterDTO } from '../interfaces/auth'
import axios from 'axios'

export const login = async (email: string, password: string) => {
  try {
    const { data } = await axiosBase.post('/auth/login', { email, password })

    const user = data?.data?.user ?? data?.user
    const token = data?.data?.token ?? data?.data?.token

    if (!user || !token) {
      throw { code: 'INVALID_CREDENTIALS', message: 'Incorrect Email or Password.' } 
    }

    useAuthStore.getState().login(user, token)
    return { user, accessToken: token }
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        throw { code: 'NETWORK', message: 'Network Error' }
      }
      throw {
        code: 'INVALID_CREDENTIALS',
        message: 'Incorrect Email or Password.',
      } 
    }
    throw { code: 'NETWORK', message: 'Network Error' } 
  }
}

export const register = async (payload: RegisterDTO) => {
  try {
    const { data } = await axiosBase.post('/auth/register', payload)

    // server có thể bọc trong data.data
    const user = data?.data?.user ?? data?.user
    const token = data?.data?.token ?? data?.token

    if (!user || !token) {
      throw { code: 'SERVER', message: 'Server Error' } 
    }

    useAuthStore.getState().login(user, token)
    return { user, accessToken: token }
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        throw { code: 'NETWORK', message: 'Network Error' } 
      }

      const status = err.response.status
      const serverMsg = (err.response.data)?.message

      if (status === 400) {
        throw {
          code: 'VALIDATION',
          message: 'Validation failed',
          details: (err.response.data)?.errors,
        }
      }

      if (status === 409) {
        throw { code: 'EMAIL_EXISTS', message: 'Email dupplication' } 
      }

      if (status === 500) {
        throw { code: 'SERVER', message: 'Internal server error' }
      }

      throw { code: 'UNKNOWN', message: serverMsg || 'Registration failed' } 
    }

    throw { code: 'NETWORK', message: 'Network Error' }
  }
}

export const fetchProfile = async () => {
  const { data } = await axiosAuth.get('/user/profile')
  return data
}

export const logout = () => {
  useAuthStore.getState().logout()
}
