import { store } from '../index'
import { defineStore } from 'pinia'
import { getAccessToken, removeToken } from '@/utils/auth'
import { CACHE_KEY, useCache } from '@/hooks/useCache'

const { wsCache } = useCache()

interface UserVO {
  account: any
  bindings: any
  code: number
  cookie: string
  loginType: number
  profile: any
  token: string
  message: string
}
interface UserInfoVO {
  isSetUser: boolean
  user: UserVO
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserInfoVO => ({
    isSetUser: false,
    user: {
      account: {},
      bindings: [],
      code: 0,
      cookie: '',
      loginType: 0,
      profile: {},
      token: '',
      message: '',
    },
  }),
  getters: {
    getIsSetUser(): boolean {
      return this.isSetUser
    },
    getUser(): UserVO {
      return this.user
    },
  },
  actions: {
    setUserInfoAction(userInfo: UserVO) {
      if (!getAccessToken()) {
        this.resetState()
        return null
      }
      this.isSetUser = true
      this.user = userInfo
    },
    loginOut() {
      removeToken()
      wsCache.clear()
      this.resetState()
    },
    resetState() {
      this.isSetUser = false
      this.user = {
        account: {},
        bindings: [],
        code: 0,
        cookie: '',
        loginType: 0,
        profile: {},
        token: '',
        message: '',
      }
    },
  },
  persist: {
    key: 'user',
    storage: window.sessionStorage,
    paths: ['isSetUser', 'user'],
  },
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
