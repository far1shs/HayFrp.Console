import {createApp} from "vue";
import PrimeVue from "primevue/config";
import App from "./App.vue";
import {definePreset} from "@primevue/themes";
import Aura from "@primevue/themes/aura";
import {install} from "@icon-park/vue-next/es/all";
import "./style.css";
import {createRouter, createWebHistory} from "vue-router";
import {routes} from "./models/routes.ts";
import axios from "axios";
import ToastService from "primevue/toastservice";
import {registerSW} from "virtual:pwa-register";

const app = createApp(App);
const aura = definePreset(Aura, {
    semantic: {
        primary: {
            50: "{zinc.50}",
            100: "{zinc.100}",
            200: "{zinc.200}",
            300: "{zinc.300}",
            400: "{zinc.400}",
            500: "{zinc.500}",
            600: "{zinc.600}",
            700: "{zinc.700}",
            800: "{zinc.800}",
            900: "{zinc.900}",
            950: "{zinc.950}"
        },
        colorScheme: {
            light: {
                primary: {
                    color: "{zinc.950}",
                    inverseColor: "#ffffff",
                    hoverColor: "{zinc.900}",
                    activeColor: "{zinc.800}"
                },
                highlight: {
                    background: "{zinc.950}",
                    focusBackground: "{zinc.700}",
                    color: "#ffffff",
                    focusColor: "#ffffff"
                }
            },
            dark: {
                primary: {
                    color: "{zinc.50}",
                    inverseColor: "{zinc.950}",
                    hoverColor: "{zinc.100}",
                    activeColor: "{zinc.200}"
                },
                highlight: {
                    background: "rgba(250, 250, 250, .16)",
                    focusBackground: "rgba(250, 250, 250, .24)",
                    color: "rgba(255,255,255,.87)",
                    focusColor: "rgba(255,255,255,.87)"
                }
            }
        }
    }
});
const router = createRouter({
    history: createWebHistory(),
    routes
})

axios.defaults.baseURL = "https://hayfrp-api.rivfox.com";
axios.defaults.timeout = 10000;
install(app, "i");

// 检测系统主题
const themeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

// 初始设置
function setTheme(isDarkMode: boolean) {
    if (isDarkMode) {
        document.documentElement.classList.add("dark");
        app.config.globalProperties.$theme = "dark";
    } else {
        app.config.globalProperties.$theme = "light";
    }
}

// 监听主题变化
themeMediaQuery.addEventListener("change", (event) => {
    setTheme(event.matches);
});

// 初始化
setTheme(themeMediaQuery.matches);

app.use(PrimeVue, {
    theme: {
        preset: aura
    }
});
app.use(PrimeVue);
app.use(ToastService);
app.use(router);
app.mount("#app");
registerSW();