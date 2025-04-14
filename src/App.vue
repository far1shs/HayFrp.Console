<template>
  <div>
    <router-view/>

    <Toast style="margin: -10px -10px 0 0" :style="{width: screenWidth < 750 ? `${screenWidth - 20}px` : '380px'}">
      <template #container="slotProps">
        <div style="display: flex; flex-direction: column; padding: 10px">
          <div style="display: flex; justify-content: space-between;">
            <span >
              {{ slotProps.message.summary }}
            </span>

            <div style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center"
                 @click="slotProps.closeCallback">
              <i-close style="margin-top: 3px"/>
            </div>
          </div>

          <div v-show="slotProps.message.detail" style="font-size: 14px; opacity: 0.5; margin-top: 5px">
            {{ slotProps.message.detail }}
          </div>
        </div>
      </template>
    </Toast>
  </div>
</template>

<script setup lang="ts">
import {screenWidth} from "./models/screen.ts";
</script>
