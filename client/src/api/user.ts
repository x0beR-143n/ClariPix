// src/api/user.ts
import { axiosAuth } from './api'

export const setPreferences = async (preferences: string[]) => {
  preferences = preferences.map(pref => pref.toLowerCase())
  const { data } = await axiosAuth.post('/users/preferences', { preferences })
  return data
}

