import env from '#start/env';
import { defineConfig } from 'adonisjs-jobs';

const jobsConfig = defineConfig({
  connection: {
    host: env.get('REDIS_HOST', 'localhost'),
    port: env.get('REDIS_PORT', 6379),
    password: env.get('REDIS_PASSWORD'),
  },

  queue: env.get('REDIS_QUEUE', 'default'),

  queues: [
    'LoadCsv',
    'LoadXlsx',
    'SendEmail',
    'SendEmailExternal',
    'SendSms',
    'SendRecupera',
    'ResendRecupera',
    'SendRecupera:EME:RolimDeMoura',
    'SendRecupera:EME:Ariquemes',
    'SendRecupera:EME:PimentaBueno',
    'SendRecupera:EME:Buritis',
    'SendRecupera:EME:Teresina',
    'SendRecupera:EME:Timon',
    'SendRecupera:EME:SaoFrancisco',
    'SendRecupera:EME:Manaus',
    'SendRecupera:EME:Prolagos',
    'SendRecupera:SMS:RolimDeMoura',
    'SendRecupera:SMS:Ariquemes',
    'SendRecupera:SMS:PimentaBueno',
    'SendRecupera:SMS:Buritis',
    'SendRecupera:SMS:Teresina',
    'SendRecupera:SMS:Timon',
    'SendRecupera:SMS:SaoFrancisco',
    'SendRecupera:SMS:Manaus',
    'SendRecupera:SMS:Prolagos',
    'SendInvoice',
  ],

  options: {
    /**
     * The total number of attempts to try the job until it completes.
     */
    attempts: 0,

    /**
     * Backoff setting for automatic retries if the job fails
     */
    backoff: {
      type: 'exponential',
      delay: 5000,
    },

    /**
     * If true, removes the job when it successfully completes
     * When given a number, it specifies the maximum amount of
     * jobs to keep, or you can provide an object specifying max
     * age and/or count to keep. It overrides whatever setting is used in the worker.
     * Default behavior is to keep the job in the completed set.
     */
    removeOnComplete: {
      age: 8 * 3600, // keep up to 12 hour
    },

    /**
     * If true, removes the job when it fails after all attempts.
     * When given a number, it specifies the maximum amount of
     * jobs to keep, or you can provide an object specifying max
     * age and/or count to keep. It overrides whatever setting is used in the worker.
     * Default behavior is to keep the job in the failed set.
     */
    removeOnFail: {
      age: 12 * 3600, // keep up to 12 hours
    },
  },

  workerOptions: {
    maxStalledCount: 5, // Permite 5 tentativas antes de falhar
    stalledInterval: 60000, // Verifica a cada 60s se há jobs travados
    lockDuration: 120000, // Mantém o lock por 2 minutos
    lockRenewTime: 60000, // Renova o lock a cada 1 minuto
  },
});

export default jobsConfig;
