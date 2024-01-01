import WebStorageCache from 'web-storage-cache'

type CacheType = 'localStorage' | 'sessionStorage'

export const CACHE_KEY = {
  IS_DARK: 'isDark',
  USER: 'user',
  LANG: 'lang',
  THEME: 'theme',
  LAYOUT: 'layout',
  DICT_CACHE: 'dictCache',
}

export const useCache = (type: CacheType = 'sessionStorage') => {
  const wsCache: WebStorageCache = new WebStorageCache({ storage: type })

  return {
    wsCache,
  }
}
