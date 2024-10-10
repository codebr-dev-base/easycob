import SendRecuperaJob from './send_recupera_job.js';

export default class SendSmsRecuperaJob extends SendRecuperaJob {
  queueName = 'SendSmsRecupera';
}
