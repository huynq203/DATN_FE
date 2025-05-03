import { Customer } from 'src/types/customer.type'

export const saveAccessToken = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}

export const saveRefreshToken = (refresh_token: string) => {
  localStorage.setItem('refresh_token', refresh_token)
}

export const saveProfile = (profile: Customer) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}

export const getAccessTokenFromLS = () => {
  return localStorage.getItem('access_token') || ''
}

export const getRefreshTokenFromLS = () => {
  return localStorage.getItem('refresh_token') || ''
}

export const getProfileFromLS = () => {
  const profile = localStorage.getItem('profile')
  return profile ? JSON.parse(profile) : null
}

export const clearAccessToken = () => {
  localStorage.removeItem('access_token')
}

export const clearLS = () => {
  localStorage.clear()
}
