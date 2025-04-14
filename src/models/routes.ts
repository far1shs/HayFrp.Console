export const routes = [
    {
        path: "/",
        component: () => import("../views/index.vue"),
    }, {
        path: "/account/login",
        component: () => import("../views/account/login.vue"),

    }, {
        path: "/account/register",
        component: () => import("../views/account/register.vue"),
    }, {
        path: "/dash",
        redirect: "/dash/home",
        component: () => import("../views/dash/dash.vue"),
        children: [
            {
                path: "/dash/home",
                component: () => import("../views/dash/home.vue"),
            }, {
                path: "/dash/tunnel",
                component: () => import("../views/dash/tunnel.vue"),
            }, {
                path: "/dash/download",
                component: () => import("../views/dash/download.vue"),
            }, {
                path: "/dash/status",
                component: () => import("../views/dash/status.vue"),
            }, {
                path: "/dash/user",
                component: () => import("../views/dash/user.vue"),
            },
        ]
    }
]