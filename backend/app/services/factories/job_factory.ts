import SendSmsJob from '#jobs/send_sms_job'
import SendEmailJob from '#jobs/send_email_job'

import { Job } from 'adonisjs-jobs'

type Registry = Record<
  string,
  {
    className: new () => Job
    queueName: string
  }
>

class JobFactory<R extends Registry> {
  private registry: R
  constructor(registry: R) {
    this.registry = registry
  }

  getJob<K extends keyof typeof this.registry>(key: K) {
    return this.registry[key]
  }
}

export const jobFactory = new JobFactory({
  SMS: {
    className: SendSmsJob,
    queueName: 'SendSms',
  },
  EMAIL: {
    className: SendEmailJob,
    queueName: 'SendEmail',
  },
} as const)
