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

    <Button class="info" size="small" style="width: 32px; height: 32px">
      <i-info :size="18" style="margin-top: 2px"/>
    </Button>

    <footer>
      <span>Copyright © 2025 HayFrp and Far1sh.All Rights Reserved. 干草FRP与Far1sh版权所有 当前阶段 5.0 Preview 如果有bug等问题及时反馈</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";

const router = useRouter();
</script>

<style scoped>
.info {
  position: absolute;
  bottom: 18px;
  right: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

footer {
  /* position: absolute;
  bottom: 10px; */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  opacity: 0.5;
  font-size: 12px;
}
</style>