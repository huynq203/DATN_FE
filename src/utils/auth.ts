export const saveAccessToken = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}
export const saveProfile = (profile: object) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
export const clearAccessToken = () => {
  localStorage.removeItem('access_token')
}

export const getAccessTokenFromLS = () => {
  return localStorage.getItem('access_token') || ''
}
