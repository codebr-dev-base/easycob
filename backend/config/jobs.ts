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
    'SendEmail',
    'SendSms',
    'SendRecupera',
    'ResendRecupera',
    'SendRecupera_EME_RolimDeMoura',
    'SendRecupera_EME_Ariquemes',
    'SendRecupera_EME_PimentaBueno',
    'SendRecupera_EME_Buritis',
    'SendRecupera_EME_Teresina',
    'SendRecupera_EME_Timon',
    'SendRecupera_EME_SaoFrancisco',
    'SendRecupera_EME_Manaus',
    'SendRecupera_EME_Prolagos',
    'SendRecupera_SMS_RolimDeMoura',
    'SendRecupera_SMS_Ariquemes',
    'SendRecupera_SMS_PimentaBueno',
    'SendRecupera_SMS_Buritis',
    'SendRecupera_SMS_Teresina',
    'SendRecupera_SMS_Timon',
    'SendRecupera_SMS_SaoFrancisco',
    'SendRecupera_SMS_Manaus',
    'SendRecupera_SMS_Prolagos',
    'SendInvoice'
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
      age: 12 * 3600, // keep up to 12 hour
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
    }
  },
});

export default jobsConfig;