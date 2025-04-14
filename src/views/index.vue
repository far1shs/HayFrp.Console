<template>
  <div>
    <header>
      <h4>HayFrp Console</h4>

      <div style="display: flex; gap: 8px; align-items: center">
        <h4 @click="router.push('/dash')" style="cursor: pointer">仪表盘</h4>
      </div>
    </header>

    <div style="height: 60px"></div>

    <div
        style="display: flex; align-items: center; justify-content: center; flex-direction: column; height: calc(100vh - 60px)">
      <h3>HayFrp Console 5.0</h3>
      <span style="font-size: 14px; opacity: 0.5">这次使用河影狐的设计样式主打一个 "简" !</span>
      <Button @click="router.push('/dash')"
              variant="text"
              label="进入仪表盘"
              style="margin-top: 20px;" size="small"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";

const router = useRouter();
</script>
