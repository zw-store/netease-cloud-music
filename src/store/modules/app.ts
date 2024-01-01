import { defineStore } from 'pinia'
import { store } from '../index'
import { ElMessage } from 'element-plus'
import { CACHE_KEY, useCache } from '@/hooks/useCache'

type ElementPlusSize = 'default' | 'small' | 'large'
const { wsCache } = useCache()
interface AppState {
  pageLoading: boolean
  title: string
  sizeMap: ElementPlusSize[]
}

export const useAppStore = defineStore('app', {
  state: (): AppState => {
    return {
      sizeMap: ['default', 'large', 'small'],
      title: import.meta.env.VITE_APP_TITLE, // 标题
      pageLoading: false, // 路由跳转loading
    }
  },
  getters: {
    getPageLoading(): boolean {
      return this.pageLoading
    },
    getTitle(): string {
      return this.title
    },
    getSizeMap(): ElementPlusSize[] {
      return this.sizeMap
    },
  },
  actions: {
    setPageLoading(pageLoading: boolean) {
      this.pageLoading = pageLoading
    },

    setTitle(title: string) {
      this.title = title
    },
  },
})

export const useAppStoreWithOut = () => {
  return useAppStore(store)
}
