<template>
  <Button @click="show = true"
          label="新建"
          size="small"
          variant="outlined"
          style="height: 32px; font-size: 14px">
    <template #icon>
      <i-add :size="16" style="margin-top: 3px"/>
    </template>
  </Button>

  <Drawer v-model:visible="show"
          :show-close-icon="false"
          :position="screenWidth < 500 ? 'bottom' : 'right'"
          :style="{width: screenWidth < 500 ? '100%' : '420px', height: screenWidth < 500 ? '100%' : '100%'}">
    <div style="margin: 14px -8px -8px -8px;">
      <div v-if="data.node == null" style="display: flex; flex-direction: column; gap: 12px">
        <div v-if="loading.node" style="display: flex; flex-direction: column; gap: 15px">
          <Skeleton style="height: 54px" v-for="_ in 20"/>
        </div>

        <div class="card item"
             v-else
             v-for="(item, index) in node"
             @click="data.node = item.id"
             style="display: flex; flex-direction: column; min-height: 54px; cursor: pointer"
             :style="{ animationDelay: `${index * 0.1}s` }">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; flex-direction: column;">
          <span
              style="font-size: 14px; font-weight: bold; text-align: left; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; width: 250px">
            {{ item.name }}
          </span>
              <span style="font-size: 12px; text-align: left; color: var(--p-button-secondary-color)">
            {{ item.id }} · {{ item.version }}
          </span>
            </div>

            <Tag :severity="status(item.status)">{{ item.status }}</Tag>
          </div>
        </div>
      </div>

      <div v-else>
        <label for="tunnel_name">隧道名</label>
        <InputText id="tunnel_name" placeholder="隧道名" size="small" class="input"/>
        <label for="tunnel_type">协议</label>
        <Select id="tunnel_type" optionLabel="name" placeholder="选择协议" size="small" class="input"
                style="width: 100%"/>
        <label for="local_ip">本地IP</label>
        <InputText id="local_ip" placeholder="本地IP" size="small" class="input"/>
        <label for="local_prot">本地端口</label>
        <InputNumber id="local_prot" placeholder="本地端口" size="small" class="input"/>
        <label for="remote_prot">远程端口</label>
        <InputNumber id="remote_prot" placeholder="远程端口" size="small" class="input"/>
        <label for="domain">域名</label>
        <InputNumber id="domain" placeholder="域名" size="small" class="input"/>

        <div class="divider"/>

        <label for="use_encryption">加密</label>
        <Select id="use_encryption" optionLabel="name" placeholder="加密" size="small" class="input"
                style="width: 100%"/>
        <label for="use_compression">压缩</label>
        <Select id="use_compression" optionLabel="name" placeholder="压缩" size="small" class="input"
                style="width: 100%"/>

        <div class="divider"/>

        <label for="sk">SK</label>
        <InputNumber id="sk" placeholder="SK" size="small" class="input"/>
        <label for="locations">locations</label>
        <InputNumber id="locations" placeholder="locations" size="small" class="input"/>
        <label for="header_X_From_Where">X-From-Where</label>
        <InputNumber id="header_X_From_Where" placeholder="X-From-Where" size="small" class="input"/>
        <label for="host_header_rewrite">HOST 重写</label>
        <InputNumber id="host_header_rewrite" placeholder="HOST 重写" size="small" class="input"/>
      </div>
    </div>

    <template #header>
      <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; margin: -10px">
        <div style="display: flex; align-items: center; gap: 8px">
          <Button @click="data.node = null"
                  v-show="data.node != null"
                  v-tooltip.bottom="{value: '返回', showDelay: 1000}"
                  severity="secondary"
                  variant="text"
                  style="width: 32px; height: 32px;">
            <i-left style="margin-top: 4px"/>
          </Button>

          <span
              style="font-size: 14px; font-weight: bold; text-align: left; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; width: 250px">
            {{ data.node != null ? node.find((item: any) => item.id == data.node).name : "选择节点" }}
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 8px">
          <Button @click="getNodeList"
                  :loading="loading.node"
                  v-show="data.node == null"
                  v-tooltip.bottom="{value: '刷新', showDelay: 1000}"
                  severity="secondary"
                  variant="text"
                  style="width: 32px; height: 32px;">
            <i-refresh style="margin-top: 4px"/>
          </Button>
          <Button @click="show = false"
                  v-tooltip.bottom="{value: '关闭', showDelay: 1000}"
                  severity="secondary"
                  variant="text"
                  style="width: 32px; height: 32px; margin-right: -18px">
            <i-close style="margin-top: 4px"/>
          </Button>
        </div>
      </div>
      <div class="divider" style="width: 100%; position: fixed; top: 43px; left: 0"></div>
    </template>

    <template #footer v-if="data.node != null">
      <div>
        <div class="divider" style="width: 100%; position: fixed; bottom: 48px; left: 0"></div>
        <div style="width: 100%; margin: -10px">
          <Button style="width: calc(100% + 20px)">创建</Button>
        </div>
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import {screenWidth} from "../models/screen.ts";
import {onMounted, reactive, ref} from "vue";
import axios from "axios";
import {useToast} from "primevue";
import {getCookie} from "typescript-cookie";

const toast = useToast();

const show = ref(false);
const loading = reactive({
  node: true,
  new: false
});
const node = ref<any>();
const data = reactive<any>({
  type: "add",
  csrf: getCookie("token"),
  proxy_name: null,
  proxy_type: null,
  node: null,
  remote_port: null,
  use_encryption: "false",
  use_compression: "false",
  sk: null,

});

function getNodeList() {
  loading.node = true;
  const req = axios.get("/node");
  req.then(res => {
    if (res.data.status == 200) node.value = res.data.servers;
    else toast.add({severity: "error", summary: "获取状态列表失败", detail: res.data.message, life: 3000});
  });
  req.catch(err => toast.add({severity: "error", summary: "错误", detail: err.message, life: 3000}));
  req.finally(() => loading.node = false);
}

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

onMounted(() => getNodeList());
</script>

<style scoped>
label {
  font-size: 14px;
}

.input {
  width: 100%;
  margin: 5px 0;
}

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