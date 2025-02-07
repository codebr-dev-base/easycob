const severPath = "/data/app/easycob/frontend/";

require("dotenv").config({ path: `${severPath}.env` });

module.exports = {
  apps: [
    {
      name: "frontend", // Nome da aplicação
      script: "npm", // O comando para rodar
      args: "run start", // Argumento para o comando (nesse caso, 'npm start')
      cwd: severPath, // Caminho para a aplicação Next.js
      watch: false,
      env: {
        NODE_ENV: "production", // Define a variável de ambiente NODE_ENV como 'production'
        PORT: 4000, // Define a porta em que a aplicação será executada
      },
      instances: 1, // Número de instâncias, 1 para execução única
      autorestart: true, // Habilita o reinício automático em caso de falha
    },
  ],
};
//watch: false, // Desabilita o watch, útil para produção
//max_memory_restart: "1G", // Reinicia se usar mais de 1GB de memória
