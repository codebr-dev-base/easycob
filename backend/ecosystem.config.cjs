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
      node_args: '--max-old-space-size=4096', // Ajuste para 4GB
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:LoadCsv',
      script: './build/ace.js',
      cwd: severPath,
      args: 'queue:listen --queue=LoadCsv',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      node_args: '--max-old-space-size=4096', // Ajuste para 4GB
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera',
      script: './build/ace.js',
      cwd: severPath,
      args: 'queue:listen --queue=SendRecupera',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      node_args: '--max-old-space-size=4096', // Ajuste para 4GB
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendEmailRecupera',
      script: './build/ace.js',
      cwd: severPath,
      args: 'queue:listen --queue=SendEmailRecupera',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      node_args: '--max-old-space-size=4096', // Ajuste para 4GB
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendSmslRecupera',
      script: './build/ace.js',
      cwd: severPath,
      args: 'queue:listen --queue=SendSmsRecupera',
      instances: 8,
      exec_mode: 'cluster',
      autorestart: true,
      node_args: '--max-old-space-size=4096', // Ajuste para 4GB
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendEmail',
      script: './build/ace.js',
      cwd: severPath,
      args: 'queue:listen --queue=SendEmail',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      node_args: '--max-old-space-size=4096', // Ajuste para 4GB
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendSms',
      script: './build/ace.js',
      cwd: severPath,
      args: 'queue:listen --queue=SendSms',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      node_args: '--max-old-space-size=4096', // Ajuste para 4GB
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendInvoice',
      script: './build/ace.js',
      cwd: severPath,
      args: 'queue:listen --queue=SendInvoice',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      node_args: '--max-old-space-size=4096', // Ajuste para 4GB
      env: {
        TZ: 'America/Fortaleza',
      },
    },
  ],
};
