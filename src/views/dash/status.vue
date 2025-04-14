<template>
  <div style="display: flex; flex-direction: column; gap: 15px">
    <div class="card backdrop-filter"
         style="position: fixed; z-index: 1"
         :style="{width: screenWidth < 750 ? 'calc(100% - 30px)' : 'calc(100% - 300px)'}">
      <div style="display: flex; align-items: center; justify-content: space-between">
        <div style="display: flex; align-items: center; gap: 8px">
          <Button label="刷新"
                  @click="getNodeInfo(false)"
                  :loading="loading"
                  :disabled="isUpdate"
                  size="small"
                  variant="outlined"
                  style="height: 32px; font-size: 14px">
            <template #icon>
              <i-refresh :size="16" style="margin-top: 4px"/>
            </template>
          </Button>

          <Checkbox inputId="update" size="small" v-model="isUpdate" @click="getNodeInfo(true)" binary/>
          <label for="update" style="font-size: 14px"> 自动更新 </label>
        </div>

        <Skeleton v-if="loading" width="100px" height="30px"/>
        <div v-else class="card" style="padding: 5px 10px; display: flex; align-items: center">
          <span style="font-size: 14px">共 {{ data.number }} 个节点</span>
        </div>
      </div>
    </div>

    <div style="height: 54px"></div>

    <div v-if="loading" style="display: flex; flex-direction: column; gap: 15px">
      <Skeleton style="height: 54px" v-for="_ in 20"/>
    </div>

    <div v-else
         v-for="(item, index) in data.servers"
         class="card item"
         style="display: flex; flex-direction: column; min-height: 54px"
         :style="{ animationDelay: `${index * 0.1}s` }">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; flex-direction: column;">
          <span
              style="font-size: 14px; font-weight: bold; text-align: left; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;"
              :style="{width: screenWidth < 750 ? `${screenWidth - 150}px` : `${screenWidth - 450}px`}">
            {{ item.name }}
          </span>
          <span style="font-size: 12px; text-align: left; color: var(--p-button-secondary-color)">
            {{ item.id }} · {{ item.version }}
          </span>
        </div>

        <Tag :severity="status(item.status)">{{ item.status }}</Tag>
      </div>

      <div class="info" :style="{'max-height': isUpdate ? '100px' : ''}">
        <div class="divider" style="margin: 10px 0"></div>
        <div style="display: flex; flex-direction: column; gap: 8px">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; gap: 8px">
              <Tag style="width: auto; font-size: 12px;">CPU {{ removePercentage(item.cpu_usage) }}%</Tag>
              <Tag style="width: auto; font-size: 12px;">RAM {{ removePercentage(item.ram_usage) }}%</Tag>
              <div v-show="screenWidth > 1000" style="display: flex; gap: 8px">
                <Tag style="width: auto; font-size: 12px;">入网 {{ formatBytes(item.total_traffic_in) }}</Tag>
                <Tag style="width: auto; font-size: 12px;">出网 {{ formatBytes(item.total_traffic_out) }}</Tag>
              </div>
            </div>
            <Tag v-if="screenWidth > 1000" style="width: auto; font-size: 12px;">客户端 {{ item.client_counts }} 连接数
              {{ item.cur_conns }}
            </Tag>
            <Tag v-else style="width: auto; font-size: 12px;">客户端 {{ item.client_counts }}</Tag>
          </div>
          <div v-show="screenWidth < 1000" style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; gap: 8px">
              <Tag style="width: auto; font-size: 12px;">入网 {{ formatBytes(item.total_traffic_in) }}</Tag>
              <Tag style="width: auto; font-size: 12px;">出网 {{ formatBytes(item.total_traffic_out) }}</Tag>
            </div>
            <Tag style="width: auto; font-size: 12px;">连接数 {{ item.cur_conns }}</Tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import {onMounted, ref} from "vue";
import {useToast} from "primevue";
import {navigationSelect} from "../../models/navigation.ts";
import {screenWidth} from "../../models/screen.ts";

const toast = useToast();

const loading = ref(true);
const data = ref<any>();
const isUpdate = ref(false);

function status(status: string) {
  switch (status) {
    case "无负荷":
      return "success";
    case "低负荷":
      return "info";
    case "中负荷":
      return "warn";
    case "高负荷":
      return "danger";
  }
}

function formatBytes(bytes: number): string {
  if (bytes == 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, unitIndex);

  return `${parseFloat(size.toFixed(2))} ${units[unitIndex]}`;
}

function removePercentage(value: string): number {
  const numericValue = value.replace("%", "").trim();
  return parseFloat(numericValue);
}

function getNodeInfo(update: boolean) {
  if (!isUpdate.value && !update) loading.value = true;

  const req = axios.get("/node");
  req.then(res => {
    if (res.data.status === 200) {
      data.value = res.data;
    } else {
      toast.add({severity: "error", summary: "获取状态列表失败", detail: res.data.message, life: 3000});
    }
  });
  req.catch(err => toast.add({severity: "error", summary: "错误", detail: err.message, life: 3000}));
  req.finally(() => {
    loading.value = false;
    if (isUpdate.value) setTimeout(() => {
      if (isUpdate.value) getNodeInfo(false)
    }, 3000);
  });
}

onMounted(() => {
  navigationSelect.value = "status";
  getNodeInfo(false);
});
</script>

<style scoped>
.item {
  position: relative;
  overflow: hidden;
  transition: max-height 0.2s ease-in-out;

  opacity: 0;
  transform: translateY(-20px);
  animation: slideIn 0.3s ease-in-out forwards;
}

.item .info {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.7s ease-in-out;
}

.item:hover .info {
  max-height: 100px;
  transition-delay: 0.1s;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>