<!--
 * Copyright ©
 * #  
 * @author: zw
 * @date: 2023-12-30 
 -->

<script setup name="Dashboard">
import { timestampFormat, titleWithDuplicate } from '@/utils'
import { ElMessageBox, ElMessage } from 'element-plus'
import { downloadFile } from '@/utils/request'
import { useCacheJoin } from '@/hooks/useCacheJoin'
import { useUserStoreWithOut } from '@/store/modules/user'
import {
  API_playlist,
  API_playlist_detail,
  API_song_url,
} from '@/api/dashboard'

const userStore = useUserStoreWithOut()
const cacheJoin = useCacheJoin()
const tableRef = ref(null)
const dialogFormRef = ref(null)

const free = [0, 8]
const music_type = {
  0: '免费',
  1: 'VIP',
  8: '免费',
  4: '付费',
}

const levelOptions = [
  { label: '标准', value: 'standard' },
  { label: '较高', value: 'higher' },
  { label: '极高', value: 'exhigh' },
  { label: '无损', value: 'lossless' },
  { label: 'Hi-Res', value: 'hires' },
  { label: '高清环绕声', value: 'jyeffect' },
  { label: '沉浸环绕声', value: 'sky' },
  { label: '超清母带', value: 'jymaster' },
]

const activeIndex = reactive({
  index: 0,
  label: '',
  oldIndex: 0,
})

const table = reactive({
  datas: [],
  sels: [],
  loading: false,
})

const downloadDialog = reactive({
  visible: false,
  row: null,
  form: {
    level: 'exhigh',
    fee: false,
  },
})

const getList = async () => {
  try {
    const params = {
      uid: userStore.user.profile.userId,
      limit: 30,
      offset: 0,
    }
    table.loading = true
    const { code, playlist } = await API_playlist(params)
    if (code !== 200) throw new Error('获取歌单失败')
    const series = await Promise.all(
      playlist
        .sort((a, b) => a.createTime - b.createTime)
        .map(async (item) => {
          const res = await API_playlist_detail({ id: item.id })
          const name = item.name.replace(/(.*)(喜欢的音乐)/, '我$2')
          return [name, res.playlist.tracks]
        }),
    )

    table.datas = series
    activeIndex.label = series[0][0]
  } catch (error) {
    console.error(error)
  } finally {
    table.loading = false
  }
}

const download = async () => {
  try {
    const { row } = downloadDialog
    if (!row) throw new Error('下载文件错误：未指定下载条目')
    const { fee, level } = downloadDialog.form
    if (!fee && !free.includes(row.fee)) {
      const confirmText = await ElMessageBox.confirm(
        `该歌曲为${music_type[row.fee]}歌曲，是否继续下载？`,
        '提示',
        {
          confirmButtonText: '下载',
          cancelButtonText: '取消',
          type: 'warning',
        },
      ).catch((err) => err)
      if (confirmText !== 'confirm') return
    }
    const params = { id: row.id, level }
    const { code, data } = await API_song_url(params)
    if (code !== 200) throw new Error('获取歌曲url失败')
    const first = data[0]
    if (first.code !== 200) throw new Error(`【${row.name}】歌曲url失败`)
    cacheJoin.setItem(activeIndex.label, row.id)
    const title = titleWithDuplicate(
      `${row.name} - ${row.ar[0].name} - ${row.al.name}`,
      first.type,
    )
    downloadFile(title, first.url)
  } catch (error) {
    console.error(error)
    ElMessage.error('下载文件错误：' + error)
  } finally {
    downloadDialog.visible = false
  }
}

const batchClick = async () => {
  const index = activeIndex.index
  const selection = tableRef.value[index].getSelectionRows()
  const { fee, level } = downloadDialog.form

  downloadDialog.visible = false
  ElMessage.success(`正在下载，请勿关闭页面，下载完成后会自动提示。`)
  const breakCount = selection.filter((item) => !free.includes(item.fee)).length
  if (!fee && breakCount > 0) {
    setTimeout(() => {
      ElMessage.warning(
        `共选择${selection.length}首，将跳过${breakCount}首试听歌曲`,
      )
    }, 2000)
  }

  for (const item of selection) {
    try {
      if (!fee && !free.includes(item.fee)) continue
      const params = { id: item.id, level }
      const response = await API_song_url(params)
      const first = response.data[0]
      if (first.code !== 200) throw new Error(`【${item.name}】歌曲url失败`)
      cacheJoin.setItem(activeIndex.label, item.id)
      const title = titleWithDuplicate(
        `${item.name}-${item.ar[0].name}-${item.al.name}`,
        first.type,
      )
      downloadFile(title, first.url)
    } catch (error) {
      console.error(error)
      ElMessage.error('下载文件错误：' + error)
    } finally {
      tableRef.value[index].toggleRowSelection(item, false)
    }
  }
}

const clearRecord = () => {
  cacheJoin.removeItem(activeIndex.label)
  ElMessage.success('清空成功')
}

const tableRowStyle = ({ row }) => {
  const inActive = cacheJoin.getItem(activeIndex.label).includes('' + row.id)
  return inActive ? 'background-color: #E6E8EB' : ''
}

const activeTabs = (pane, _ev) => {
  activeIndex.oldIndex = activeIndex.index
  activeIndex.index = pane.index
  activeIndex.label = pane.props.label
  tableRef.value[activeIndex.oldIndex].clearSelection()
}

const downloadBefore = (row = null) => {
  downloadDialog.visible = true
  downloadDialog.row = row
}

const downloadDialogClose = () => {
  dialogFormRef.value.resetFields()
  downloadDialog.row = null
  downloadDialog.form = {
    level: 'exhigh',
    fee: false,
  }
}

onMounted(getList)
</script>

<template>
  <el-tabs
    tab-position="left"
    style="height: calc(100vh - 60px - 10px)"
    @tab-click="activeTabs"
  >
    <el-row class="px-2.5 py-1" :gutter="10" justify="end">
      <el-col :span="1.5">
        <el-button type="primary" @click="getList">刷新列表</el-button>
        <el-button
          type="success"
          :disabled="table.sels.length < 1"
          @click="downloadBefore()"
        >
          批量下载
        </el-button>
        <el-button type="warning" @click="clearRecord">清空下载历史</el-button>
      </el-col>
    </el-row>

    <template v-for="(item, index) in table.datas" :key="index">
      <el-tab-pane :label="item[0]" class="h-full">
        <el-table
          ref="tableRef"
          v-loading="table.loading"
          :data="item[1]"
          style="width: 100%"
          height="100%"
          :header-cell-style="{ background: '#cbd5e1' }"
          :row-style="tableRowStyle"
          @selection-change="(sels) => (table.sels = sels)"
        >
          <el-table-column type="index" label="#" />
          <el-table-column type="selection" width="50" />
          <el-table-column prop="name" label="歌曲标题" />

          <el-table-column prop="dt" label="时长">
            <template #default="{ row, column: col }">
              {{ timestampFormat(row[col.property]) }}
              <el-tag v-if="![0, 8].includes(row.fee)" plnia type="warning">
                {{ music_type[row.fee] }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="ar[0].name" label="歌手" />
          <el-table-column prop="al.name" label="专辑" />
          <el-table-column prop="id" label="ID" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-link
                type="primary"
                :underline="false"
                @click="downloadBefore(row)"
              >
                下载
              </el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </template>
  </el-tabs>

  <el-dialog
    v-model="downloadDialog.visible"
    title="音质类型"
    width="30%"
    @close="downloadDialogClose"
  >
    <el-form ref="dialogFormRef" :model="downloadDialog.form">
      <el-form-item label="下载试听">
        <el-switch v-model="downloadDialog.form.fee" />
      </el-form-item>

      <el-form-item label="音质等级">
        <el-radio-group v-model="downloadDialog.form.level">
          <el-radio
            v-for="item in levelOptions"
            :label="item.value"
            :key="item.value"
            size="large"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button
        type="primary"
        @click="downloadDialog.row ? download() : batchClick()"
      >
        {{ downloadDialog.row ? '下载' : '批量下载' }}
      </el-button>
      <el-button @click="downloadDialog.visible = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
:deep(.el-tabs__content) {
  height: 100%;
}
</style>
