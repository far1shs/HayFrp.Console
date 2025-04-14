<template>
  <div>
    <header>
      <h4>HayFrp Console</h4>

      <div style="display: flex; gap: 8px; align-items: center">
        <h4 @click="router.push('/account/register')" style="cursor: pointer">注册账号</h4>
      </div>
    </header>

    <div style="height: 60px;"></div>

    <div style="height: calc(100vh - 100px); display: flex; align-items: center; justify-content: center;">
      <div>
        <h3 style="text-align: center">登录</h3>
        <div style="display: flex; flex-direction: column; gap: 10px">
          <InputText placeholder="用户名/手机号/邮箱" v-model="data.user" style="width: 300px"/>
          <Password @keydown.enter="login" placeholder="密码" :feedback="false" v-model="data.passwd" :inputStyle="{width: '300px'}"/>
          <Button @click="login" :loading="loading" label="登录" style="width: 300px; margin-top: 15px"/>
          <Button :disabled="true" variant="text" style="width: 300px;" label="河影狐账号登录"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, reactive, ref} from "vue";
import {useToast} from "primevue";
import axios from "axios";
import {getCookie, setCookie} from "typescript-cookie";

const router = useRouter();
const toast = useToast();

const loading = ref(false);
const data = reactive({
  type: "login",
  user: "",
  passwd: "",
});

function login() {
  loading.value = true;
  const req = axios.post("/user", data);
  req.then(res => {
    if (res.data.status === 200) {
      setCookie("token", res.data.token, {expires: 7});
      router.push("/dash");
      toast.add({severity: "success", summary: "登录成功", detail: `欢迎回来! ${data.user}`, life: 3000});
    } else {
      toast.add({severity: "error", summary: "登录失败", detail: res.data.message, life: 3000});
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
  req.finally(() => loading.value = false);
}

onMounted(() => {
  if (getCookie("token") != null) {
    // router.push("/dash");
  }
});
</script>