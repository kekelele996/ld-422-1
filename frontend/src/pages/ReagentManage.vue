<template>
  <section class="reagent-manage">
    <div class="page-header">
      <h2>试剂管理</h2>
      <div class="filter-bar">
        <el-radio-group v-model="filterExpiry" size="default">
          <el-radio-button value="all">全部</el-radio-button>
          <el-radio-button value="warning">临期</el-radio-button>
          <el-radio-button value="expired">已过期</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <el-table :data="filteredReagents" stripe style="width: 100%" @row-click="openDetail">
      <el-table-column prop="name" label="试剂名称" min-width="120" />
      <el-table-column prop="casNo" label="CAS号" min-width="110" />
      <el-table-column prop="hazardLevel" label="危险等级" width="110">
        <template #default="{ row }">
          <StatusBadge :value="row.hazardLevel" />
        </template>
      </el-table-column>
      <el-table-column label="库存" width="130">
        <template #default="{ row }">
          <span :class="{ 'text-danger': row.stock < row.minStock }">
            {{ row.stock }} {{ row.unit }}
            <el-tag v-if="row.stock < row.minStock" type="danger" size="small" effect="light" style="margin-left: 4px">
              库存不足
            </el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="supplier" label="供应商" min-width="100" />
      <el-table-column prop="location" label="存放位置" min-width="100" />
      <el-table-column prop="expiryDate" label="保质期截止" width="120" />
      <el-table-column label="保质期状态" width="180">
        <template #default="{ row }">
          <ExpiryBadge :expiry-date="row.expiryDate" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click.stop="openDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <EmptyState v-if="filteredReagents.length === 0" description="暂无符合条件的试剂" />

    <el-drawer
      v-model="detailVisible"
      :title="selectedReagent?.name ?? '试剂详情'"
      direction="rtl"
      size="560px"
    >
      <template v-if="selectedReagent">
        <div class="detail-section">
          <StockAlert
            :name="selectedReagent.name"
            :stock="selectedReagent.stock"
            :min-stock="selectedReagent.minStock"
          />
          <ExpiryAlert
            :name="selectedReagent.name"
            :days-remaining="computedDaysRemaining"
            :expiry-status="computedExpiryStatus"
            style="margin-top: 12px"
          />
        </div>

        <el-descriptions :column="1" border style="margin-top: 20px">
          <el-descriptions-item label="试剂名称">{{ selectedReagent.name }}</el-descriptions-item>
          <el-descriptions-item label="CAS号">{{ selectedReagent.casNo }}</el-descriptions-item>
          <el-descriptions-item label="分子式">{{ selectedReagent.formula }}</el-descriptions-item>
          <el-descriptions-item label="纯度">{{ selectedReagent.purity }}</el-descriptions-item>
          <el-descriptions-item label="危险等级">
            <StatusBadge :value="selectedReagent.hazardLevel" />
          </el-descriptions-item>
          <el-descriptions-item label="存储条件">{{ selectedReagent.storageCondition }}</el-descriptions-item>
          <el-descriptions-item label="供应商">{{ selectedReagent.supplier }}</el-descriptions-item>
          <el-descriptions-item label="存放位置">{{ selectedReagent.location }}</el-descriptions-item>
          <el-descriptions-item label="当前库存">
            <span :class="{ 'text-danger': selectedReagent.stock < selectedReagent.minStock }">
              {{ selectedReagent.stock }} {{ selectedReagent.unit }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="最低库存阈值">
            {{ selectedReagent.minStock }} {{ selectedReagent.unit }}
          </el-descriptions-item>
          <el-descriptions-item label="保质期截止日期">
            {{ selectedReagent.expiryDate }}
          </el-descriptions-item>
          <el-descriptions-item label="剩余天数">
            <span :style="{ color: daysRemainingColor, fontWeight: 600 }">
              {{ daysRemainingText }}
            </span>
          </el-descriptions-item>
        </el-descriptions>
      </template>
    </el-drawer>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useReagentStore } from "../stores/reagentStore";
import type { Reagent } from "../types/reagent";
import { getDaysRemaining, getExpiryStatus, getExpiryStatusText } from "../utils/calculateExpiry";
import StatusBadge from "../components/common/StatusBadge.vue";
import StockAlert from "../components/common/StockAlert.vue";
import ExpiryAlert from "../components/common/ExpiryAlert.vue";
import EmptyState from "../components/common/EmptyState.vue";
import ExpiryBadge from "../components/common/ExpiryBadge.vue";

const reagentStore = useReagentStore();
const filterExpiry = ref<"all" | "warning" | "expired">("all");
const detailVisible = ref(false);
const selectedReagent = ref<Reagent | null>(null);

const filteredReagents = computed(() => {
  if (filterExpiry.value === "all") return reagentStore.items;
  return reagentStore.items.filter((r) => getExpiryStatus(r.expiryDate) === filterExpiry.value);
});

const computedDaysRemaining = computed(() => {
  if (!selectedReagent.value) return 0;
  return selectedReagent.value.daysRemaining ?? getDaysRemaining(selectedReagent.value.expiryDate);
});

const computedExpiryStatus = computed(() => {
  if (!selectedReagent.value) return "normal" as const;
  return selectedReagent.value.expiryStatus ?? getExpiryStatus(selectedReagent.value.expiryDate);
});

const daysRemainingText = computed(() => {
  return getExpiryStatusText(computedExpiryStatus.value, computedDaysRemaining.value);
});

const daysRemainingColor = computed(() => {
  if (computedExpiryStatus.value === "expired") return "#f56c6c";
  if (computedExpiryStatus.value === "warning") return "#e6a23c";
  return "#67c23a";
});

function openDetail(row: Reagent) {
  selectedReagent.value = row;
  detailVisible.value = true;
}

onMounted(() => {
  reagentStore.load();
});
</script>

<style scoped>
.reagent-manage {
  padding: 20px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.page-header h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}
.text-danger {
  color: #f56c6c;
  font-weight: 600;
}
.detail-section {
  margin-bottom: 8px;
}
</style>
