const severPath = '/data/app/easycob/backend/';
// const severPath = '/Users/thiago/Projects/Yuan/easycob/backend/';

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
      name: 'queue:LoadCsv',
      script: './build/ace',
      cwd: severPath,
      args: 'jobs:listen --queue=LoadCsv',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera',
      script: './build/ace',
      cwd: severPath,
      args: 'jobs:listen --queue=SendRecupera',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendEmailRecupera',
      script: './build/ace',
      cwd: severPath,
      args: 'jobs:listen --queue=SendEmailRecupera',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendSmsRecupera',
      script: './build/ace',
      cwd: severPath,
      args: 'jobs:listen --queue=SendSmsRecupera',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendEmail',
      script: './build/ace',
      cwd: severPath,
      args: 'jobs:listen --queue=SendEmail',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendSms',
      script: './build/ace',
      cwd: severPath,
      args: 'jobs:listen --queue=SendSms',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendInvoice',
      script: './build/ace',
      cwd: severPath,
      args: 'jobs:listen --queue=SendInvoice',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
  ],
};
