import axios from 'axios'
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus'
import { getAccessToken, removeToken } from '@/utils/auth'

const API_baseURL = import.meta.env.VITE_APP_BASE_API
export const isRelogin = { show: false }
export const RESPONSE_INCLUDES_CODE = [0, 200]

interface baseconf {
  baseURL?: string
  timeout?: number
  headers?: any
  isToken?: boolean
}

class Request {
  private _ins: any

  constructor(conf: baseconf = {}) {
    const _ins = axios.create({
      baseURL: API_baseURL,
      timeout: 1000 * 10,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      ...conf,
    })

    this._ins = _ins

    this.interceptors()
  }

  interceptors() {
    this._ins.interceptors.request.use(
      (config) => {
        const isToken = (config.headers || {}).isToken === false
        if (getAccessToken() && !isToken) {
          config.headers['Authorization'] = 'Bearer ' + getAccessToken()
        }
        return config
      },
      (error) => {
        console.error(error)
        return Promise.reject(error)
      },
    )

    this._ins.interceptors.response.use(
      async (response) => {
        if (
          response.request.responseType === 'blob' ||
          response.request.responseType === 'arraybuffer'
        ) {
          return response
        }
        const code = response.data.code
        if (code === 401) {
          if (isRelogin.show)
            return Promise.reject('无效的会话，或者会话已过期，请重新登录。')

          const confirmText = await ElMessageBox.confirm(
            '登录状态已过期，您可以继续留在该页面，或者重新登录',
            '系统提示',
            {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning',
            },
          ).catch((err) => err)
          if (confirmText !== 'confirm') return (isRelogin.show = false)
          Promise.reject('error')
          isRelogin.show = false
          removeToken()
          location.href = '/login'
        } else if (code !== 200) {
          ElNotification.error({ title: response.data.msg })
          return Promise.reject('error')
        }

        return {
          originresponse: response,
          data: [],
          ...response.data,
        }
      },
      (error) => {
        ElMessage({
          type: 'error',
          message: error.message,
          duration: 1000 * 5,
        })

        return Promise.reject(error)
      },
    )
  }

  request(conf) {
    return this._ins.request(conf)
  }

  get instance() {
    return this._ins
  }
}

export { API_baseURL, Request }
export default new Request().instance

export const downloadFile = (title, url) => {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = title
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)
    })
    .catch((error) => {
      console.error('Error downloading file:', error)
    })
}
