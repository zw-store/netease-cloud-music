import router from './.'
import { useNProgress } from '@/hooks/useNProgress'
import { getAccessToken, removeToken } from '@/utils/auth'
import { usePageLoading } from '@/hooks/usePageLoading'
import { useTitle } from '@/hooks/useTitle'
import { useUserStoreWithOut } from '@/store/modules/user'
const { start, done } = useNProgress()
const { loadStart, loadDone } = usePageLoading()
const whiteList = ['/login']

let userStore
router.beforeEach((to, from, next) => {
  start()
  loadStart()
  userStore = useUserStoreWithOut()
  if (getAccessToken()) {
    hasToken(to, from, next)
  } else {
    voidToken(to, from, next)
  }
})

router.afterEach((to) => {
  useTitle(to?.meta?.title as string)
  done()
  loadDone()
})

function hasToken(to, from, next) {
  if (to.path === '/login') {
    next({ path: '/' })
  } else {
    if (userStore.getIsSetUser) return next()

    next({ ...to, replace: true })
  }
}

function voidToken(to, _from, next) {
  userStore.loginOut()
  if (whiteList.indexOf(to.path) !== -1) return next()
  next(`/login?redirect=${to.fullPath}`)
}
