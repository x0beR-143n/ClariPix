// src/api/user.ts
import { axiosAuth } from './api'

export const setPreferences = async (preferences: string[]) => {
  const { data } = await axiosAuth.post('/users/preferences', { preferences })
  return data
}

