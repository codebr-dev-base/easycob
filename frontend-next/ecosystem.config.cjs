//const severPath = "/Users/thiago/Projects/Yuan/easycob/frontend/";
const severPath = "/data/app/easycob/frontend-next/";

require("dotenv").config({ path: `${severPath}.env` });

module.exports = {
  apps: [
    {
      name: 'NextAppEasycob',
      exec_mode: 'cluster',
      instances: 'max', // Or a number of instances
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 4000',
      env_local: {
        APP_ENV: 'local' // APP_ENV=local
      },
      env_dev: {
        APP_ENV: 'dev' // APP_ENV=dev
      },
      env_prod: {
        APP_ENV: 'prod' // APP_ENV=prod
      }
    }
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
