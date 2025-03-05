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
      node_args: '--max-old-space-size=4096', // Adicione esta linha
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
      node_args: '--max-old-space-size=4096', // Adicione esta linha
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendEmailExternal',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendEmailExternal',
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
      name: 'queue:SendRecupera:EME:RolimDeMoura',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera:EME:RolimDeMoura',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera:EME:Ariquemes',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera:EME:Ariquemes',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera:EME:PimentaBueno',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera:EME:PimentaBueno',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera:EME:Buritis',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera:EME:Buritis',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera:EME:Teresina',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera:EME:Teresina',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera:EME:Timon',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera:EME:Timon',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera:EME:SaoFrancisco',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera:EME:SaoFrancisco',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera:EME:Manaus',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera:EME:Manaus',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera:EME:Prolagos',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera:EME:Prolagos',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    // Filas SendRecupera:SMS
    {
      name: 'queue:SendRecupera:SMS:RolimDeMoura',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera:SMS:RolimDeMoura',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera:SMS:Ariquemes',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera:SMS:Ariquemes',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera:SMS:PimentaBueno',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera:SMS:PimentaBueno',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera:SMS:Buritis',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera:SMS:Buritis',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera:SMS:Teresina',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera:SMS:Teresina',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera:SMS:Timon',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera:SMS:Timon',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera:SMS:SaoFrancisco',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera:SMS:SaoFrancisco',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera:SMS:Manaus',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera:SMS:Manaus',
      instances: 1,
      autorestart: true,
      env: {
        TZ: 'America/Fortaleza',
      },
    },
    {
      name: 'queue:SendRecupera:SMS:Prolagos',
      script: 'ace.js',
      args: 'jobs:listen --queue=SendRecupera:SMS:Prolagos',
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
    {
      name: 'queue:LoadXlsx',
      script: 'ace.js',
      args: 'jobs:listen --queue=LoadXlsx',
      instances: 1,
      autorestart: true,
      node_args: '--max-old-space-size=8192', // Adicione esta linha
      env: {
        TZ: 'America/Fortaleza',
      },
    },
  ],
};
