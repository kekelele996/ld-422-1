<template>
  <el-alert
    v-if="expiryStatus === 'expired'"
    type="error"
    show-icon
    :closable="false"
    :title="`${name} 已过期 ${Math.abs(daysRemaining)} 天`"
  />
  <el-alert
    v-else-if="expiryStatus === 'warning'"
    type="warning"
    show-icon
    :closable="false"
    :title="`${name} 即将过期（剩余 ${daysRemaining} 天）`"
  />
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  daysRemaining: number;
  expiryStatus: "normal" | "warning" | "expired";
}>();
</script>
