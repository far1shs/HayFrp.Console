import {defineConfig} from "vite"
import vue from "@vitejs/plugin-vue"
import Components from "unplugin-vue-components/vite";
import {PrimeVueResolver} from "@primevue/auto-import-resolver";
import {VitePWA} from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        Components({
            resolvers: [
                PrimeVueResolver()
            ]
        }),
        VitePWA({
            registerType: "autoUpdate",
            manifest: {
                name: "HayFrp Console",
                short_name: "HayFrp Console",
                description: "HayFrp Console PWA APP",
                theme_color: "#ffffff",
                background_color: "#ffffff",
                start_url: "/dash",
                icons: [
                    {
                        src: "favicon.ico",
                        sizes:"256x256",
                        type: "image/ico",
                    },
                ],
            },
            workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png}"],
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
            },
        }),
    ]
})
