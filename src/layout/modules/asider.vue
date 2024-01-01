<template>
  <el-aside width="200px">
    <slot />
  </el-aside>
</template>

<script setup name="AsiderBox"></script>

<style lang="scss" scoped>
.el-aside {
  color: var(--el-text-color-primary);
  background: #d3dce6;
}
</style>
