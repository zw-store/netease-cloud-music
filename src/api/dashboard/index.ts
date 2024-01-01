import request from '@/utils/request'
import { responseOBj } from './types'
/**
 * @description: 获取用户歌单
 * @param {Object} params
 * @param {String} params.uid 用户UID
 * @param {String} params.limit 返回数量 , 默认为 30
 * @param {String} params.offset 偏移数量，用于分页 , 如 :( 页数 -1)\*30, 其中 30 为 limit 的值 , 默认为 0
 * @returns {Promise}
 */
interface params_API_playlist_Obj {
  uid: number | string
  limit?: number
  offset?: number
}
export function API_playlist(
  params: params_API_playlist_Obj,
): Promise<responseOBj> {
  return request({
    url: '/user/playlist',
    params,
  })
}

/**
 * @description: 获取歌单所有歌曲
 * @param {Object} params
 * @param {String} params.id 歌单 id
 * @param {String} params.limit 限制获取歌曲的数量，默认值为当前歌单的歌曲数量
 * @param {String} params.offset 默认值为0
 * @returns {Promise}
 */
interface params_API_playlist_detail_Obj {
  id: number | string
  s?: number // 歌单最近的 s 个收藏者,默认为 8
}
export function API_playlist_detail(
  params: params_API_playlist_detail_Obj,
): Promise<any> {
  return request({
    url: '/playlist/detail',
    params,
  })
}

/**
 * @description: 获取歌单所有歌曲
 * @param {Object} params
 * @param {String} params.id 歌单 id
 * @param {String} params.limit 限制获取歌曲的数量，默认值为当前歌单的歌曲数量
 * @param {String} params.offset 默认值为0
 * @returns {Promise}
 */
interface params_API_playlist_track_all_Obj {
  id: number | string
  limit?: number
  offset?: number
}
export function API_playlist_track_all(
  params: params_API_playlist_track_all_Obj,
): Promise<any> {
  return request({
    url: '/playlist/track/all',
    params,
  })
}

/**
 * @description: 获取歌单所有歌曲
 * @param {Object} params
 * @param {String} params.id 歌单 id
 * @param {String} params.limit 限制获取歌曲的数量，默认值为当前歌单的歌曲数量
 * @param {String} params.offset 默认值为0
 * @returns {Promise}
 */
interface params_API_song_url_Obj {
  id: number | string
  br?: number // 码率,默认设置了 999000 即最大码率,如果要 320k 则可设置为 320000,其他类推
}
export function API_song_url(params: params_API_song_url_Obj): Promise<any> {
  return request({
    url: '/song/url/v1',
    params,
  })
}

export type { responseOBj }
