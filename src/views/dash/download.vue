<template>
  <div style="display: flex; flex-direction: column; gap: 15px">
    <div class="card backdrop-filter"
         style="position: fixed; z-index: 1"
         :style="{width: screenWidth < 750 ? 'calc(100% - 30px)' : 'calc(100% - 300px)'}">
      <div style="display: flex; align-items: center; justify-content: space-between">
        <Button label="刷新"
                @click="getDownloadList"
                :loading="loading"
                size="small"
                variant="outlined"
                style="height: 32px; font-size: 14px">
          <template #icon>
            <i-refresh :size="16" style="margin-top: 3px"/>
          </template>
        </Button>

        <Select v-model="data.source"
                :options="data.download.source"
                :loading="loading"
                option-value="url"
                option-label="name"
                size="small"
                style="width: 150px; background: transparent"
                placeholder="下载源"/>
      </div>
    </div>

    <div style="height: 54px"></div>

    <div v-if="loading" style="display: flex; flex-direction: column; gap: 15px">
      <Skeleton style="height: 54px" v-for="_ in 20"/>
    </div>

    <div v-else
         v-for="(item, index) in data.download.lists"
         class="card item"
         style="display: flex; align-items: center; justify-content: space-between"
         :style="{ animationDelay: `${index * 0.1}s` }">
      <div style="display: flex; flex-direction: column;">
        <span
            style="font-size: 14px; font-weight: bold; text-align: left; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;"
            :style="{width: screenWidth < 750 ? `${screenWidth - 150}px` : 'auto'}">
          {{ item.name }}
        </span>
        <span style="font-size: 12px; text-align: left; color: var(--p-button-secondary-color)">
          {{ item.version }} · {{ item.arch }}
        </span>
      </div>

      <div style="display: flex; gap: 8px">
        <Button @click="copyUrl(item)"
                v-tooltip.bottom="{value: '复制链接', showDelay: 1000}"
                variant="text"
                style="width: 32px; height: 32px">
          <template #icon>
            <i-copy :size="16" style="margin-top: 3px;"/>
          </template>
        </Button>
        <Button @click="download(item)"
                v-tooltip.bottom="{value: '下载', showDelay: 1000}"
                variant="text"
                style="width: 32px; height: 32px">
          <template #icon>
            <i-download :size="16" style="margin-top: 2px;"/>
          </template>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import {onMounted, reactive, ref} from "vue";
import {useToast} from "primevue";
import {navigationSelect} from "../../models/navigation.ts";
import {screenWidth} from "../../models/screen.ts";

const toast = useToast();

const loading = ref(true);
const data = reactive<any>({
  download: {},
  source: "https://down.hxit.top/HayFrp/Releases/"
});

function copyUrl(item: any) {
  navigator.clipboard.writeText(`${data.source}${item.url}`).then(() => {
    toast.add({severity: "success", summary: "复制成功", detail: "", life: 3000});
  }).catch(err => {
    toast.add({severity: "error", summary: "复制失败", detail: err.message, life: 3000});
  });
}

function download(item: any) {
  window.open(`${data.source}${item.url}`, "_blank");
}

function getDownloadList() {
  loading.value = true;
  data.download = {};
  data.source = "https://down.hxit.top/HayFrp/Releases/";
  const req = axios.get("/downlist");
  req.then(res => {
    if (res.data.status === 200) {
      console.log(res.data)
      data.download = res.data;
    } else {
      toast.add({severity: "error", summary: "获取下载列表失败", detail: res.data.message, life: 3000});
    }
  });
  req.catch(err => {
    toast.add({severity: "error", summary: "错误", detail: err.message, life: 3000});
  });
  req.finally(() => loading.value = false);
}

onMounted(() => {
  navigationSelect.value = "download";
  getDownloadList();
});
</script>

<style scoped>
.item {
  opacity: 0;
  transform: translateY(-20px);
  animation: slideIn 0.3s ease-in-out forwards;
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