module.exports = {
  apps: [
    {
      name: 'easycob-backend',
      script: './build/server.js',
      cwd: '/data/docker/backend/',
      instances: 4,
      exec_mode: 'cluster',
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue',
      script: './build/ace',
      cwd: '/data/docker/backend/',
      args: 'queue:listen --queue=LoadCsv',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue',
      script: './build/ace',
      cwd: '/data/docker/backend/',
      args: 'queue:listen --queue=ActionsOparation',
      instances: 8,
      exec_mode: 'cluster',
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue',
      script: './build/ace',
      cwd: '/data/docker/backend/',
      args: 'node ace queue:listen --queue=ActionsEmail',
      instances: 16,
      exec_mode: 'cluster',
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue',
      script: './build/ace',
      cwd: '/data/docker/backend/',
      args: 'node ace queue:listen --queue=ActionsSms',
      instances: 16,
      exec_mode: 'cluster',
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue',
      script: './build/ace',
      cwd: '/data/docker/backend/',
      args: 'node ace queue:listen --queue=SendEmail',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue',
      script: './build/ace',
      cwd: '/data/docker/backend/',
      args: 'node ace queue:listen --queue=SendSms',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue',
      script: './build/ace',
      cwd: '/data/docker/backend/',
      args: 'node ace queue:listen --queue=SendSms',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue',
      script: './build/ace',
      cwd: '/data/docker/backend/',
      args: 'node ace queue:listen --queue=SendInvoice',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
  ],
};