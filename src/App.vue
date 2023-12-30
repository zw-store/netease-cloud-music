<script setup lang="ts">
const Primary = ref('Primary')

onMounted(() => {
  console.log('mounted')
})
</script>

<template>
  <el-button type="primary">Primary</el-button>
</template>
