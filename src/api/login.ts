import request from '@/utils/request'

/**
 * @description: 用户登录
 * @param {Object} params
 * @param {String} params.phone 手机号码
 * @param {String} params.password 密码
 * @returns {Promise}
 */
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
export function API_login(params): Promise<UserVO> {
  return request({
    url: '/login/cellphone',
    params,
  })
}
