# Use a versão LTS do Node.js como imagem base
FROM node:lts

# Crie o diretório de trabalho e defina-o como o diretório de trabalho atual
WORKDIR /data/docker/frontend

# Instale build-essential e cron
RUN apt-get update && apt-get install -y build-essential cron

# Copie o arquivo package.json e package-lock.json (se existir)
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Instale o PM2 globalmente
RUN npm install -g pm2

# Copie o restante do código da aplicação
#COPY . .

# Copie o crontab file para o container
#COPY crontab /etc/cron.d/cron-job

# Ajuste as permissões do crontab
#RUN chmod 0644 /etc/cron.d/cron-job

# Aplica o crontab e inicia o cron
#RUN crontab /etc/cron.d/cron-job

# Exponha a porta que sua aplicação está usando
EXPOSE 3000 

# Use um script de entrada para iniciar cron e PM2
#CMD ["sh", "-c", "cron && pm2-runtime start ecosystem.config.cjs"]
CMD ["pm2-runtime", "start", "ecosystem.config.cjs"]
