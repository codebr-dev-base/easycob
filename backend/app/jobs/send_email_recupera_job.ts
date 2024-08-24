import SendRecuperaJob from './send_recupera_job.js';

export default class SendEmailRecuperaJob extends SendRecuperaJob {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url;
  }

}