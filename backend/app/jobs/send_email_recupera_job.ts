import SendRecuperaJob from './send_recupera_job.js';

export default class SendEmailRecuperaJob extends SendRecuperaJob {
  queueName = 'SendEmailRecupera';
}