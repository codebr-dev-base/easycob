const severPath = "/data/app/easycob/frontend/";

require("dotenv").config({ path: `${severPath}.env` });

module.exports = {
  apps: [
    {
      name: "frontend", // Nome da aplicação
      script: "npm", // O comando para rodar
      args: "run start", // Argumento para o comando (nesse caso, 'npm start')
      cwd: severPath, // Caminho para a aplicação Next.js
      instances: 1, // Número de instâncias, 1 para execução única
      exec_mode: 'cluster',
      watch: false,
      autorestart: true, // Habilita o reinício automático em caso de falha
      env: {
        NODE_ENV: "production", // Define a variável de ambiente NODE_ENV como 'production'
        PORT: 4000, // Define a porta em que a aplicação será executada
        TZ: 'America/Fortaleza',
      },
    },
  ],
};
//watch: false, // Desabilita o watch, útil para produção
//max_memory_restart: "1G", // Reinicia se usar mais de 1GB de memória
