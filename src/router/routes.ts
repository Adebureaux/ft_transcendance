import { useQuasar } from "quasar";
import { useChatStore } from "src/stores/chat";
import { RouteRecordRaw } from "vue-router";
import api from "../services/api.service";
import WsService from "../services/ws.service";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    meta: { requiresAuth: true },

    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/",
        meta: { requiresAuth: true },
        name: "index",
        component: () => import("pages/Index/Index.vue"),
      },
      {
        path: "/conversation/:channel_id",
        meta: { requiresAuth: true },
        component: () => import("pages/Conversation/Conversation.vue"),
        beforeEnter: async (to, from, next) => {
          const storeChat = useChatStore();
          try {
            if (storeChat?.socket.connected) {
              console.log("connected");

              await storeChat.join(to.params.channel_id);
            } else {
              console.log("not connected");
              await storeChat.socket.connect();
              await storeChat.join(to.params.channel_id);
            }
            console.log("try:", to);
            next();
          } catch (error) {
            // api.vue.$notifyCenter.send({
            //   type: 'negative',
            //   message: 'Bad Password !',
            // })
            next(from);
          }
        },
      },
      {
        path: "/profile/:username",
        meta: { requiresAuth: true },
        component: () => import("pages/Profile/Profile.vue"),
      },
      {
        path: "/sandbox",
        meta: { requiresAuth: true },

        component: () => import("pages/Sandbox.vue"),
      },
      {
        path: "/game/:gameId",
        name: "game",
        meta: { requiresAuth: true },

        component: () => import("pages/Game/Game.vue"),
        beforeEnter: async (to, from, next) => {
          await api.axiosInstance
            .get(`/games/play/${to.params.gameId}`)
            .then((res) => {
              console.log(res.status);
              if (res.status == 404) {
                next({ name: "GameError" });
              } else next();
            })
            .catch(() => {
              next({ name: "GameError" });
            });
        },
      },
      {
        path: "/game3d/:gameId",
        name: "game3d",
        meta: { requiresAuth: true },

        component: () => import("pages/Game/Game3d.vue"),
        beforeEnter: async (to, from, next) => {
          await api.axiosInstance
            .get(`/games/play/${to.params.gameId}`)
            .then((res) => {
              console.log(res.status);
              if (res.status == 404) {
                next({ name: "GameError" });
              } else next();
            })
            .catch(() => {
              next({ name: "GameError" });
            });
        },
      },
      {
        path: "/spectate/:gameId",
        name: "spectate",
        meta: { requiresAuth: true },

        component: () => import("pages/Game/Spectate.vue"),
        beforeEnter: async (to, from, next) => {
          console.log(to.params.gameId);
          await api.axiosInstance
            .get(`/games/watch/${to.params.gameId}`)
            .then((res) => {
              console.log(res.status);
              if (res.status == 404) {
                if (from.name === "game") {
                  next({ name: "GameError" });
                }
                next({ name: "GameError" });
              } else next();
            })
            .catch(() => {
              next({ name: "GameError" });
            });
        },
      },
      {
        path: "/spectate3d/:gameId",
        name: "spectate3d",
        meta: { requiresAuth: true },

        component: () => import("pages/Game/Spectate3d.vue"),
        beforeEnter: async (to, from, next) => {
          await api.axiosInstance
            .get(`/games/watch/${to.params.gameId}`)
            .then((res) => {
              console.log(res.status);
              if (res.status == 404) {
                next({ name: "GameError" });
              } else next();
            })
            .catch(() => {
              next({ name: "GameError" });
            });
        },
      },
    ],
  },

  {
    path: "/login",
    meta: { requiresAuth: false },
    component: () => import("layouts/LoginLayout.vue"),
    children: [{ path: "", component: () => import("pages/Auth.vue") }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/game-error",
    name: "GameError",
    meta: { requiresAuth: true },
    component: () => import("pages/GameError.vue"),
  },
  {
    path: "/:catchAll(.*)*",
    name: "404",
    meta: { requiresAuth: false },
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
