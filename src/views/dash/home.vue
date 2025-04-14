<template>
  <div style="display: flex; flex-direction: column; gap: 15px">
    <Message>
      <div style="font-size: 14px">
        欢迎使用 HayFrp Console 5.0 版本 Preview 5.0.0 河影狐开发
      </div>
    </Message>

    <div class="card">
      <div style="display: flex; align-items: center; justify-content: space-between">
        <div style="display: flex; align-items: center; gap: 10px;">
          <img :src="userData.avatar"
               class="avatar"
               style="width: 32px; height: 32px"/>
          <div style="display: flex; flex-direction: column;">
            <span style="font-size: 14px; font-weight: bold; text-align: left">
              {{ userData.username }} {{ userData.sprovider == "true" ? "服务商" : null }}
            </span>
            <span style="font-size: 12px; text-align: left; margin-top: -3px; color: var(--p-button-secondary-color)">
              {{ maskEmail(userData.email) }}
            </span>
          </div>
        </div>

        <div style="display: flex; gap: 5px">
          <Button @click="sign"
                  :loading="loading.sign"
                  v-tooltip.bottom="{value: '签到', showDelay: 1000}"
                  variant="text"
                  style="width: 32px; height: 32px">
            <template #icon>
              <i-plan :size="16" style="margin-top: 3px"/>
            </template>
          </Button>

          <Button @click="router.push('/dash/user')"
                  v-tooltip.bottom="{value: '更多', showDelay: 1000}"
                  variant="text"
                  style="width: 32px; height: 32px">
            <template #icon>
              <i-right :size="16" style="margin-top: 3px"/>
            </template>
          </Button>
        </div>
      </div>
    </div>

    <div class="card" style="padding: 15px">
      <MeterGroup style="font-size: 14px" :value="tunnelMeterGroup"/>
    </div>

    <div class="card" style="padding: 15px">
      <MeterGroup style="font-size: 14px" :value="trafficMeterGroup"/>
    </div>

    <div class="card" style="padding: 15px">
      <div v-if="loading.notice" style="display: flex; flex-direction: column; gap: 8px">
        <Skeleton v-for="_ in 20"/>
      </div>
      <div v-else v-html="data.notice" class="select"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive} from "vue";
import axios from "axios";
import {useToast} from "primevue";
import {userData} from "../../models/user.ts";
import { getCookie } from "typescript-cookie";
import {useRouter} from "vue-router";
import {navigationSelect} from "../../models/navigation.ts";

const router = useRouter();
const toast = useToast();

const loading = reactive({
  sign: false,
  notice: true,
});
const data = reactive({
  notice: "",
});

const tunnel = calculateTrafficPercentage(userData.value.proxies - userData.value.useproxies, userData.value.useproxies);
const tunnelMeterGroup = reactive([
  {label: `使用隧道 ${userData.value.useproxies}`, color: "#60a5fa", value: tunnel.usedPercentage},
  {
    label: `剩余隧道 ${userData.value.proxies - userData.value.useproxies}`,
    color: "var(--p-form-field-border-color)",
    value: tunnel.totalPercentage
  }
]);

const traffic = calculateTrafficPercentage(userData.value.traffic, userData.value.todaytraffic);
const trafficMeterGroup = reactive([
  {label: `今日使用 (${userData.value.todaytraffic} MB)`, color: "#60a5fa", value: traffic.usedPercentage},
  {label: `剩余流量 (${userData.value.traffic} MB)`, color: "var(--p-form-field-border-color)", value: traffic.totalPercentage}
]);

function sign() {
  loading.sign = true;
  const req = axios.post("/user", {
    type: "sign",
    csrf: getCookie("token"),
  });
  req.then(res => {
    if (res.data.status === 200) {
      toast.add({
        severity: "success",
        summary: "签到成功",
        detail: `获得流量: ${res.data.signflow} GB`,
        life: 3000
      });
    } else {
      toast.add({
        severity: "error",
        summary: "错误",
        detail: res.data.message,
        life: 3000
      });
    }
  });
  req.catch(err => {
    toast.add({
      severity: "error",
      summary: "错误",
      detail: err.message,
      life: 3000
    });
  });
  req.finally(() => loading.sign = false);
}

function getNotice() {
  const req = axios.get("/notice");
  req.then(res => {
    data.notice = res.data;
  });
  req.catch(err => {
    toast.add({
      severity: "error",
      summary: "错误",
      detail: err.message,
      life: 3000
    });
  });
  req.finally(() => loading.notice = false);
}

function calculateTrafficPercentage(total: number, used: number): { totalPercentage: number, usedPercentage: number } {
  const usedPercentage = (used / total) * 100;
  const totalPercentage = 100 - usedPercentage;
  return {totalPercentage, usedPercentage};
}

function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  const maskedLocalPart = localPart.slice(0, 2) + '****' + localPart.slice(-1);
  return `${maskedLocalPart}@${domain}`;
}

onMounted(() => {
  navigationSelect.value = "home";
  getNotice()
});
</script>