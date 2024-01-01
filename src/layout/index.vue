<template>
  <el-container direction="vertical">
    <HeaderBox>
      <slot name="header" />
    </HeaderBox>

    <el-container>
      <AsiderBox>
        <slot name="asider" />
      </AsiderBox>

      <MainBox>
        <!-- <slot /> -->
        <router-view />
      </MainBox>
    </el-container>
  </el-container>
</template>

<script>
import { HeaderBox, AsiderBox, MainBox } from './modules'

export default {
  name: 'customLayout',
  components: { HeaderBox, AsiderBox, MainBox },
}
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
  .el-container .el-container {
    height: calc(100% - 60px);
  }
}
</style>
