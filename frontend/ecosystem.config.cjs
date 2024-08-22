//const severPath = "/Users/thiago/Projects/Yuan/easycob/frontend/";
const severPath = "/data/app/easycob/frontend/";

require("dotenv").config({ path: `${severPath}.env` });

module.exports = {
  apps: [
    {
      name: "front",
      port: "4000",
      script: "./.output/server/index.mjs",
      cwd: severPath,
      instances: 4,
      exec_mode: "cluster",
      autorestart: true,
    },
  ],
};

/*       env: {
        TZ: "America/Fortaleza",
        AUTH_SECRET:
          "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        API_BASE_URL: "http://192.168.1.194:4444",
        NUXT_PUBLIC_API_BASE: "http://192.168.1.194:4444",
        BASE_URL: "http://192.168.1.194:4000",
      }, */
