import { useCache } from '@/hooks/useCache'
const { wsCache } = useCache()

interface AccessType {
  cookie: string
  token: string
}

const cookie = 'MUSIC_COOKIE'
const token = 'MUSIC_TOKEN'

export const setToken = (params: AccessType) => {
  wsCache.set(cookie, params.cookie, { exp: 60 * 60 * 24 * 7 })
  wsCache.set(token, params.token)
}

export const getAccessToken = () => {
  return wsCache.get(token)
}

export const getAccessCookie = () => {
  return wsCache.get(cookie)
}

export const removeToken = () => {
  wsCache.delete(cookie)
  wsCache.delete(token)
}
