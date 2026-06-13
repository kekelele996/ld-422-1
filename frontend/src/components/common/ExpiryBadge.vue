<template>
  <el-tag :type="tagType" effect="light" size="small">
    <template v-if="status === 'expired'">已过期 {{ Math.abs(daysRemaining) }} 天</template>
    <template v-else-if="status === 'warning'">临期（剩余 {{ daysRemaining }} 天）</template>
    <template v-else>正常（剩余 {{ daysRemaining }} 天）</template>
  </el-tag>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getDaysRemaining, getExpiryStatus } from "../utils/calculateExpiry";

const props = defineProps<{ expiryDate: string }>();

const daysRemaining = computed(() => getDaysRemaining(props.expiryDate));
const status = computed(() => getExpiryStatus(props.expiryDate));
const tagType = computed(() => {
  if (status.value === "expired") return "danger";
  if (status.value === "warning") return "warning";
  return "success";
});
</script>
