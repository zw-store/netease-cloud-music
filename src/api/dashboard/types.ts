export interface UserMusicPreferences {
  subscribers: any[]
  subscribed: boolean
  creator: {
    defaultAvatar: boolean
    province: number
    authStatus: number
    followed: boolean
    avatarUrl: string
    accountStatus: number
    gender: number
    city: number
    birthday: number
    userId: number
    userType: number
    nickname: string
    signature: string
    description: string
    detailDescription: string
    avatarImgId: number
    backgroundImgId: number
    backgroundUrl: string
    authority: number
    mutual: boolean
    expertTags: null | any // 如果可用，请填写正确的类型
    experts: null | any // 如果可用，请填写正确的类型
    djStatus: number
    vipType: number
    remarkName: null | any // 如果可用，请填写正确的类型
    authenticationTypes: number
    avatarDetail: null | any // 如果可用，请填写正确的类型
    anchor: boolean
    avatarImgIdStr: string
    backgroundImgIdStr: string
    avatarImgId_str: string
  }
  artists: null | any // 如果可用，请填写正确的类型
  tracks: null | any // 如果可用，请填写正确的类型
  top: boolean
  updateFrequency: null | any // 如果可用，请填写正确的类型
  backgroundCoverId: number
  backgroundCoverUrl: null | string // 如果可用，请填写正确的类型
  titleImage: number
  titleImageUrl: null | string // 如果可用，请填写正确的类型
  englishTitle: null | string // 如果可用，请填写正确的类型
  opRecommend: boolean
  recommendInfo: null | any // 如果可用，请填写正确的类型
  subscribedCount: number
  cloudTrackCount: number
  userId: number
  totalDuration: number
  coverImgId: number
  privacy: number
  trackUpdateTime: number
  trackCount: number
  updateTime: number
  commentThreadId: string
  coverImgUrl: string
  specialType: number
  anonimous: boolean // 请注意，“anonimous” 是一个拼写错误，应为“anonymous”
  createTime: number
  highQuality: boolean
  newImported: boolean
  trackNumberUpdateTime: number
  playCount: number
  adType: number
  description: null | string // 如果可用，请填写正确的类型
  tags: any[] // 如果可用，请填写正确的类型
  ordered: boolean
  status: number
  name: string
  id: number
  coverImgId_str: string
  sharedUsers: null | any // 如果可用，请填写正确的类型
  shareStatus: null | any // 如果可用，请填写正确的类型
  copied: boolean
}
export interface responseOBj {
  code: number
  playlist: Array<UserMusicPreferences>
  more: boolean
  version: string
}
