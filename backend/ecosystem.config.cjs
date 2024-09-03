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
      script: 'ace.js',
      args: 'jobs:listen --queue=LoadCsv',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendEmail',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendEmail',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendSms',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendSms',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:ResendRecupera',
      script: 'ace.js',
      args: 'jobs:listen --queue=ResendRecupera',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    // Filas SendRecupera:EME
    {
      name: 'queue:SendRecupera_SMS_RolimDeMoura',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera_SMS_RolimDeMoura',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera_SMS_Ariquemes',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera_SMS_Ariquemes',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera_SMS_PimentaBueno',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera_SMS_PimentaBueno',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera_SMS_Buritis',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera_SMS_Buritis',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera_SMS_Teresina',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera_SMS_Teresina',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera_SMS_Timon',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera_SMS_Timon',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera_SMS_SaoFrancisco',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera_SMS_SaoFrancisco',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera_SMS_Manaus',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera_SMS_Manaus',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera_SMS_Prolagos',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera_SMS_Prolagos',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    // Filas SendRecupera:SMS
    {
      name: 'queue:SendRecupera_SMS_RolimDeMoura',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera_SMS_RolimDeMoura',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera_SMS_Ariquemes',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera_SMS_Ariquemes',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera_SMS_PimentaBueno',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera_SMS_PimentaBueno',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera_SMS_Buritis',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera_SMS_Buritis',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera_SMS_Teresina',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera_SMS_Teresina',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera_SMS_Timon',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera_SMS_Timon',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera_SMS_SaoFrancisco',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera_SMS_SaoFrancisco',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera_SMS_Manaus',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera_SMS_Manaus',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera_SMS_Prolagos',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera_SMS_Prolagos',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendInvoice',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendInvoice',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
  ],
};
