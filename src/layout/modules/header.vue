<!--
 * Copyright ©
 * #  
 * @author: zw
 * @date: 2023-02-11 
 -->

<template>
  <el-header>
    <slot />
  </el-header>
</template>

<script setup name="HeaderBox"></script>

<style lang="scss" scoped>
.el-header {
  color: var(--el-text-color-primary);
  background: #d3dce6;
}
</style>
