<template>
  <div style="display: flex; flex-direction: column; gap: 15px">
    <Message>
      推荐绑定河影狐账号进一步提升安全性与便捷性
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
              <i-plan :size="16" style="margin-top: 4px"/>
            </template>
          </Button>

          <Button @click="router.push('/dash/user')"
                  v-tooltip.bottom="{value: '更多', showDelay: 1000}"
                  variant="text"
                  style="width: 32px; height: 32px">
            <template #icon>
              <i-right :size="16" style="margin-top: 4px"/>
            </template>
          </Button>
        </div>
      </div>
    </div>

    <div class="card">
      <div style="display: flex; align-items: center; justify-content: space-between">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center">
            <i-key :size="28" style="margin-left: 3px; margin-top: 5px"/>
          </div>
          <div style="display: flex; flex-direction: column;">
            <span style="font-size: 14px; font-weight: bold; text-align: left">
              密钥
            </span>
            <span style="font-size: 12px; text-align: left; margin-top: -3px; color: var(--p-button-secondary-color)">
              不给看
            </span>
          </div>
        </div>

        <div style="display: flex; gap: 5px">
          <Button :loading="loading.sign"
                  v-tooltip.bottom="{value: '复制', showDelay: 1000}"
                  variant="text"
                  style="width: 32px; height: 32px">
            <template #icon>
              <i-plan :size="16" style="margin-top: 2px"/>
            </template>
          </Button>

          <Button v-tooltip.bottom="{value: '重置', showDelay: 1000}"
                  variant="text"
                  style="width: 32px; height: 32px">
            <template #icon>
              <i-right :size="16" style="margin-top: 2px"/>
            </template>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive} from "vue";
import {navigationSelect} from "../../models/navigation.ts";
import {userData} from "../../models/user.ts";
import axios from "axios";
import {getCookie} from "typescript-cookie";
import {useRouter} from "vue-router";
import {useToast} from "primevue";

const router = useRouter();
const toast = useToast();

const loading = reactive({
  sign: false,
});

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

function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  const maskedLocalPart = localPart.slice(0, 2) + '****' + localPart.slice(-1);
  return `${maskedLocalPart}@${domain}`;
}

onMounted(() => {
  navigationSelect.value = "user";
});
</script>