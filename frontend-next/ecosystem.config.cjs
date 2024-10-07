//const severPath = "/Users/thiago/Projects/Yuan/easycob/frontend/";
const severPath = "/data/app/easycob/frontend-next/";

require("dotenv").config({ path: `${severPath}.env` });

module.exports = {
  apps: [
    {
      name: "frontend-next", // Nome da aplicação
      script: "npm", // O comando para rodar
      args: "start", // Argumento para o comando (nesse caso, 'npm start')
      cwd: severPath, // Caminho para a aplicação Next.js
      env: {
        NODE_ENV: "production", // Define a variável de ambiente NODE_ENV como 'production'
        PORT: 4000, // Define a porta em que a aplicação será executada
      },
      instances: 1, // Número de instâncias, 1 para execução única
      autorestart: true, // Habilita o reinício automático em caso de falha
      watch: false, // Desabilita o watch, útil para produção
      max_memory_restart: "1G", // Reinicia se usar mais de 1GB de memória
    },
  ],
};

/*       

    {
      name: "frontend-next",
      port: "4000",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: severPath,
      instances: 4,
      exec_mode: "cluster",
      autorestart: true,
    },


env: {
        TZ: "America/Fortaleza",
        AUTH_SECRET:
          "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        API_BASE_URL: "http://192.168.1.194:4444",
        NUXT_PUBLIC_API_BASE: "http://192.168.1.194:4444",
        BASE_URL: "http://192.168.1.194:4000",
      }, */
