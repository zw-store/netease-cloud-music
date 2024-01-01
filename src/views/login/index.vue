<!--
 * Copyright ©
 * #  
 * @author: zw
 * @date: 2023-12-30 
 -->

<script setup name="LoginModal">
import { API_login } from '@/api/login'
import { setToken } from '@/utils/auth'
import { useUserStoreWithOut } from '@/store/modules/user'

const user_store = useUserStoreWithOut()
const router = useRouter()
const visible = ref(true)
const form = reactive({
  phone: '',
  password: '',
})

const rules = {
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const submit = async () => {
  try {
    const res = await API_login({ ...form })
    if (res.code !== 200) throw new Error(res.message)
    setToken(res)
    user_store.setUserInfoAction(res)
    router.push({ path: '/' })
  } catch (error) {
    console.error(error)
  }
}

const reset = () => {
  form.phone = ''
  form.password = ''
}
</script>

<template>
  <el-dialog
    title="网易云音乐登录"
    v-model="visible"
    width="25%"
    align-center
    center
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :show-close="false"
  >
    <el-form :model="form" :rules="rules">
      <el-form-item>
        <el-input v-model="form.phone" placeholder="手机号" clearable />
      </el-form-item>

      <el-form-item>
        <el-input
          type="password"
          show-password
          v-model="form.password"
          placeholder="密码"
          clearable
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button type="primary" @click="submit">登录</el-button>
      <el-button type="danger" @click="reset">重置</el-button>
    </template>
  </el-dialog>
</template>
