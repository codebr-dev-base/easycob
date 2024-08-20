import quasarConfig from "./config/quasar.config";
import authConfig from "./config/auth";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL,
      urlBase: process.env.BASE_URL,
      authSecret: process.env.AUTH_SECRET,
    },
  },
  app: {
    head: {
      title: "EasyCob",
    },
  },
  css: ["~/assets/css/main.css"],
  modules: ["nuxt-quasar-ui", "@sidebase/nuxt-auth"],
  quasar: quasarConfig,
  auth: authConfig,
  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: '@use "@/assets/sass/quasar.variables.sass" as *\n',
        },
      },
    },
  },
  devtools: { enabled: true },
  routeRules: {
    "/operator/campaign/email/template/*": { ssr: false },
  },
});
