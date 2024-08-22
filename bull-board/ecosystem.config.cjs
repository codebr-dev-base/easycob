//const severPath = "/Users/thiago/Projects/Yuan/easycob/bull-board/";
const severPath = "/data/app/easycob/bull-board/";

require("dotenv").config({ path: `${severPath}.env` });

module.exports = {
  apps: [
    {
      name: "dashboard",
      port: "7777",
      script: "./bin/www",
      cwd: severPath,
      instances: 1,
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
