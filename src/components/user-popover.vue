<template>
  <Button @click="infoPopover.toggle($event)" size="small" variant="text" style="padding: 5px">
    <img src="https://q1.qlogo.cn/g?b=qq&nk=629065357&s=100"
         class="avatar"/>
    <span style="font-weight: bold;">{{ userData.username }}</span>
  </Button>

  <Popover ref="infoPopover"
           :unstyled="true"
           style="margin-top: 8px"
           :style="{width: screenWidth < 750 ? `${screenWidth - 20}px` : '380px', 'margin-left': screenWidth < 750 ? '10px' : '5px'}">
    <div class="card backdrop-filter item">
      <div style="display: flex; align-items: center; justify-content: space-between">
        <div style="display: flex; align-items: center; gap: 10px; height: 42px">
          <img src="https://q1.qlogo.cn/g?b=qq&nk=629065357&s=100"
               class="avatar"
               style="width: 32px; height: 32px"/>
          <div style="display: flex; flex-direction: column;">
            <span style="font-size: 14px; font-weight: bold; text-align: left">
              {{ userData.username }}
            </span>
            <span style="font-size: 12px; opacity: 0.5; text-align: left;">
              {{ maskEmail(userData.email) }}
            </span>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 5px">
          <Button v-show="false" severity="secondary" variant="text" style="width: 32px; height: 32px;">
            <i-share style="margin-left: 4px; margin-top: 4px"/>
          </Button>
          <Button severity="danger" variant="text" style="width: 32px; height: 32px;">
            <i-logout style="margin-left: 1px; margin-top: 4px"/>
          </Button>
        </div>
      </div>

      <div class="divider"></div>

      <div style="display: flex; flex-direction: column; gap: 5px"
           :style="{'margin-top': getOS() == 'iOS' ? '10px' : ''}">
        <Button @click="pushUrl('/dash/user')"
                label="管理账号"
                size="small"
                variant="text"
                style="height: 32px; font-size: 14px; justify-content: left">
          <template #icon>
            <i-tool :size="16" style="margin-top: 3px"/>
          </template>
        </Button>

        <Button @click="pushUrl('/dash/help')"
                label="帮助/反馈"
                size="small"
                variant="text"
                style="height: 32px; font-size: 14px; justify-content: left">
          <template #icon>
            <i-help :size="16" style="margin-top: 3px"/>
          </template>
        </Button>
      </div>

      <div class="divider"></div>

      <div style="display: flex; justify-content: space-between; gap: 5px; font-size: 12px; opacity: 0.5; margin: 0 5px"
           :style="{'margin-top': getOS() == 'iOS' ? '10px' : ''}">
        <span>
          <a href="https://learn.hayfrp.com/privacy-policy.html" target="_blank">隐私政策</a> · <a
            href="https://learn.hayfrp.com/terms.html" target="_blank">用户协议</a>
        </span>
        <a>HayFrp</a>
      </div>
    </div>
  </Popover>
</template>

<script setup lang="ts">
import {screenWidth} from "../models/screen.ts";
import {ref} from "vue";
import {userData} from "../models/user.ts";
import {useRouter} from "vue-router";

const router = useRouter();
const infoPopover = ref();

function pushUrl(url: string) {
  router.push(url);
  infoPopover.value.hide();
}

// function openUrl(url: string, target: string) {
//   window.open(url, target);
//   infoPopover.value.hide();
// }

function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  const maskedLocalPart = localPart.slice(0, 2) + '****' + localPart.slice(-1);
  return `${maskedLocalPart}@${domain}`;
}

function getOS(): string {
  const userAgent = navigator.userAgent;

  if (/Windows/i.test(userAgent)) {
    return "Windows";
  } else if (/Macintosh|MacIntel|MacPPC|Mac68K/i.test(userAgent)) {
    return "MacOS";
  } else if (/Linux/i.test(userAgent)) {
    return "Linux";
  } else if (/Android/i.test(userAgent)) {
    return "Android";
  } else if (/iOS|iPhone|iPad|iPod/i.test(userAgent)) {
    return "iOS";
  } else {
    return "Unknown OS";
  }
}
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