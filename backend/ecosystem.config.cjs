const severPath = '/data/app/easycob/backend/';
//const severPath = '/Users/thiago/Projects/Yuan/easycob/backend/';

module.exports = {
  apps: [
    {
      name: 'backend',
      script: './build/bin/server.js',
      cwd: severPath,
      instances: 4,
      exec_mode: 'cluster',
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queueLoadCsv',
      script: './build/ace.js',
      cwd: severPath,
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
      script: './build/ace.js',
      cwd: severPath,
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
      script: './build/ace.js',
      cwd: severPath,
      args: 'queue:listen --queue=ActionsEmail',
      instances: 16,
      exec_mode: 'cluster',
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queueActionsSms',
      script: './build/ace.js',
      cwd: severPath,
      args: 'queue:listen --queue=ActionsSms',
      instances: 16,
      exec_mode: 'cluster',
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queueSendEmail',
      script: './build/ace.js',
      cwd: severPath,
      args: 'queue:listen --queue=SendEmail',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queueSendSms',
      script: './build/ace.js',
      cwd: severPath,
      args: 'queue:listen --queue=SendSms',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queueSendInvoice',
      script: './build/ace.js',
      cwd: severPath,
      args: 'queue:listen --queue=SendInvoice',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
  ],
};
