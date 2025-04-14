<template>
  <div>
    <div v-if="loading"
         style="height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 15px">
      <ProgressSpinner style="width: 80px; height: 80px"/>
      <span style="font-size: 14px; font-weight: bold; opacity: 0.5">{{ status }}</span>
    </div>

    <div v-else>
      <header>
        <h4>HayFrp Console</h4>

        <div v-show="screenWidth > 750"
             style="position: fixed; display: flex; align-items: center; gap: 5px; left: calc(50% - 185px)">
          <Button v-for="item in navigation"
                  @click="navigationClick(item.value)"
                  :label="item.label"
                  size="small"
                  variant="text"
                  style="height: 32px; font-size: 14px"
                  :severity="navigationSelect == item.value ? undefined : 'secondary'">
            <template #icon>
              <icon-park :size="16" style="margin-top: 4px" :type="item.icon"/>
            </template>
          </Button>
        </div>

        <div style="display: flex; gap: 5px; align-items: center">
          <user-popover/>

          <Button @click="navigationPopover.toggle($event)"
                  v-show="screenWidth < 750"
                  v-tooltip.bottom="{value: '导航', showDelay: 1000}"
                  variant="text"
                  style="width: 32px; height: 32px">
            <template #icon>
              <i-hamburger-button :size="16" style="margin-top: 4px"/>
            </template>
          </Button>
        </div>

        <Popover ref="navigationPopover"
                 :unstyled="true"
                 style="margin-left: 5px; margin-top: 8px"
                 :style="{width: `${screenWidth - 20}px`}">
          <div class="card backdrop-filter item">
            <Button v-for="item in navigation"
                    @click="navigationClick(item.value)"
                    :label="item.label"
                    size="small"
                    variant="text"
                    style="width: 100%; height: 32px; font-size: 14px; justify-content: left"
                    :severity="navigationSelect == item.value ? undefined : 'secondary'">
              <template #icon>
                <icon-park :size="16" style="margin-top: 4px" :type="item.icon"/>
              </template>
            </Button>
          </div>
        </Popover>
      </header>

      <div style="height: 60px"></div>

      <div :style="{margin: `15px ${screenWidth < 750 ? '15px' : '150px'}`}">
        <router-view/>
        <ScrollTop :threshold="150"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {IconPark} from "@icon-park/vue-next/es/all";
import {screenWidth} from "../../models/screen.ts";
import {onMounted, ref} from "vue";
import {getCookie, removeCookie} from "typescript-cookie";
import axios from "axios";
import {useToast} from "primevue";
import {userData} from "../../models/user.ts";
import {navigationSelect, navigation} from "../../models/navigation.ts";
import UserPopover from "../../components/user-popover.vue";

const router = useRouter();
const toast = useToast();

const loading = ref(true);
const status = ref("正在验证会话");
const navigationPopover = ref();


function navigationClick(value: string) {
  navigationSelect.value = value;
  navigationPopover.value.hide();
  router.push(`/dash/${value}`);
}

onMounted(async () => {
  const token = getCookie("token");
  if (token == null) {
    router.push("/account/login");
    return;
  }

  try {
    const checkRes = await axios.post("/user", {
      type: "csrf",
      csrf: token,
    });

    if (checkRes.data.status !== 200) {
      router.push("/account/login");
      toast.add({
        severity: "error",
        summary: checkRes.data.message,
        life: 3000
      });
      return;
    }

    status.value = "获取用户数据";

    const infoRes = await axios.post("/user", {
      type: "info",
      csrf: token,
    });

    if (infoRes.data.status !== true) {
      router.push("/account/login");
      toast.add({
        severity: "error",
        summary: infoRes.data.message,
        life: 3000
      });
      return;
    }

    userData.value = infoRes.data;

    const avatarRes = await axios.post("/avatar", {
      csrf: token,
    });

    if (avatarRes.data.status === 200) {
      userData.value.avatar = avatarRes.data.url;
    } else {
      toast.add({
        severity: "warn",
        summary: "获取头像失败",
        detail: avatarRes.data.message,
        life: 3000
      });
    }

    loading.value = false;
  } catch (err) {
    removeCookie("token");
    router.push("/account/login");
    toast.add({
      severity: "error",
      summary: "错误",
      detail: err,
      life: 3000
    });
  }
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