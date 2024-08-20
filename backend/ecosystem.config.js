module.exports = {
  apps: [
    {
      name: 'backend',
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
      name: 'queueLoadCsv',
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
      name: 'queueActionsOparation',
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
      name: 'queueActionsEmail',
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
      name: 'queueActionsSms',
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
      name: 'queueSendEmail',
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
      name: 'queueSendSms',
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
      name: 'queueSendInvoice',
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
