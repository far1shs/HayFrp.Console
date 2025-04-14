import {reactive, ref} from "vue";

export const navigationSelect = ref("");

export const navigation = reactive([
    {
        label: "主页",
        value: "home",
        icon: "home",
    }, {
        label: "隧道",
        value: "tunnel",
        icon: "all-application",
    }, {
        label: "下载",
        value: "download",
        icon: "download",
    }, {
        label: "状态",
        value: "status",
        icon: "server",
    }, {
        label: "账号",
        value: "user",
        icon: "user",
    }
]);
