<template>
  <div class="card">
    <div style="display: flex; align-items: center; justify-content: space-between">
      <div style="display: flex; align-items: center; gap: 10px;">
        <!--        <div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center">-->
        <!--          <icon-park :size="28" style="margin-left: 3px; margin-top: 5px"/>-->
        <!--        </div>-->
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
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import {IconPark} from "@icon-park/vue-next/es/all";

defineProps({
  icon: String,
  title: String,
  desc: String
})
</script>