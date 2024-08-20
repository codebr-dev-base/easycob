require("dotenv").config({ path: "/data/docker/frontend/.env" });
module.exports = {
  apps: [
    {
      name: "front",
      port: "3000",
      script: "./.output/server/index.mjs",
      cwd: "/data/docker/frontend/",
      instances: 4,
      exec_mode: "cluster",
      autorestart: true,
      env: {
        TZ: "America/Fortaleza",
        AUTH_SECRET:
          "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        API_BASE_URL: "http://192.168.1.194:3333",
        NUXT_PUBLIC_API_BASE: "http://192.168.1.194:3333",
        BASE_URL: "http://192.168.1.194:300",
      },
    },
  ],
};
