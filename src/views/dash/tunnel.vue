<template>
  <div style="display: flex; flex-direction: column; gap: 15px">
    <div class="card backdrop-filter"
         style="position: fixed; z-index: 1"
         :style="{width: screenWidth < 750 ? 'calc(100% - 30px)' : 'calc(100% - 300px)'}">
      <div style="display: flex; align-items: center; justify-content: space-between">
        <div style="display: flex; align-items: center; gap: 8px">
          <Button label="刷新"
                  @click="getTunnel"
                  :loading="loading"
                  size="small"
                  variant="outlined"
                  style="height: 32px; font-size: 14px">
            <template #icon>
              <i-refresh :size="16" style="margin-top: 3px"/>
            </template>
          </Button>
          <new-tunnel-drawer/>
        </div>

        <Skeleton v-if="loading" width="100px" height="30px"/>
        <div v-else class="card" style="padding: 5px 10px; display: flex; align-items: center">
          <span v-if="data.tunnel.length != 0" style="font-size: 14px">共 {{ data.tunnel.proxies.length }} 个隧道</span>
          <span v-else style="font-size: 14px">你还没有隧道</span>
        </div>
      </div>
    </div>

    <div style="height: 54px"></div>

    <div v-if="loading" style="display: flex; flex-direction: column; gap: 15px">
      <Skeleton style="height: 54px" v-for="_ in 20"/>
    </div>

    <div v-else-if="data.tunnel.length === 0"
         style="height: calc(100vh - 160px); display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 10px">
      <i-all-application :size="54"/>
      <span style="font-size: 14px">这里空空的什么也没有</span>
      <new-tunnel-drawer/>
    </div>

    <div v-else
         v-for="item in data.tunnel.proxies"
         class="card item"
         style="display: flex; flex-direction: column; min-height: 54px">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; flex-direction: column;">
          <span
              style="font-size: 14px; font-weight: bold; text-align: left; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;"
              :style="{width: screenWidth < 750 ? `${screenWidth - 150}px` : 'auto'}">
            {{ item.proxy_name }} · {{ item.id }}
          </span>
          <div
              style="font-size: 12px; height: 15px; text-align: left; color: var(--p-button-secondary-color); display: flex; align-items: center">
            <span>{{ item.local_ip }}:{{ item.local_port }}</span>
            <i-switch style="margin: 3px 2px 0 3px"/>
            <span>{{ item.remote_port }}</span>
          </div>
        </div>

        <div style="display: flex;align-items: center; gap: 8px">
          <div class="tool">
            <Button @click="copyUrl(item)"
                    v-tooltip.bottom="{value: '复制地址', showDelay: 1000}"
                    variant="text"
                    style="width: 32px; height: 32px">
              <template #icon>
                <i-copy :size="16" style="margin-top: 3px;"/>
              </template>
            </Button>
            <Button @click="deleteTunnel(item.id)"
                    v-tooltip.bottom="{value: '删除', showDelay: 1000}"
                    variant="text"
                    style="width: 32px; height: 32px">
              <template #icon>
                <i-delete :size="16" style="margin-top: 3px;"/>
              </template>
            </Button>
          </div>
          <ToggleSwitch style="margin-top: 1px" :model-value="item.status"/>
        </div>
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
import {getCookie} from "typescript-cookie";
import NewTunnelDrawer from "../../components/new-tunnel-drawer.vue";

const toast = useToast();

const loading = ref(true);
const data = reactive<any>({
  tunnel: [],
});

function copyUrl(item: any) {
  navigator.clipboard.writeText(`${item.node_domain}:${item.remote_port}`).then(() => {
    toast.add({severity: "success", summary: "复制成功", detail: "", life: 3000});
  }).catch(err => {
    toast.add({severity: "error", summary: "复制失败", detail: err.message, life: 3000});
  });
}

function deleteTunnel(id: string) {
  loading.value = true;
  const req = axios.post("/proxy", {
    type: "remove",
    id: id,
    csrf: getCookie("token")
  });
  req.then(res => {
    if (res.data.status === 200) {
      toast.add({severity: "success", summary: "删除隧道成功", detail: "", life: 3000});
      getTunnel();
    } else {
      toast.add({severity: "error", summary: "获取删除隧道失败", detail: res.data.message, life: 3000});
    }
  });
  req.catch(err => {
    toast.add({severity: "error", summary: "错误", detail: err.message, life: 3000});
  });
  req.finally(() => loading.value = false);
}

function getTunnel() {
  loading.value = true;
  data.tunnel = [];
  const req = axios.post("/proxy", {
    type: "list",
    csrf: getCookie("token")
  });
  req.then(res => {
    if (res.data.status === 200) {
      data.tunnel = res.data;
    } else if (res.data.status === 404) {

    } else {
      toast.add({severity: "error", summary: "获取隧道列表失败", detail: res.data.message, life: 3000});
    }
  });
  req.catch(err => {
    toast.add({severity: "error", summary: "错误", detail: err.message, life: 3000});
  });
  req.finally(() => loading.value = false);
}

onMounted(() => {
  navigationSelect.value = "tunnel";
  getTunnel();
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
  transition: max-height 0.75s ease-in-out;
}

.item:hover .info {
  max-height: 100px;
  transition-delay: 0.1s;
}

.item .tool {
  display: flex;
  gap: 8px;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
}

.item:hover .tool {
  visibility: visible;
  opacity: 1;
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