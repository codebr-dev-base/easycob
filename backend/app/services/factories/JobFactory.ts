import SendEmailJob from '#jobs/send_email_job'
import SendSmsJob from '#jobs/send_sms_job'

export class JobFactory {
  private kindToJobMap = {
    SMS: {
      className: SendSmsJob,
      queueName: 'SendSms' as const,
    },
    EMAIL: {
      className: SendEmailJob,
      queueName: 'SendEmail' as const,
    },
  }

  getJob<K extends keyof typeof this.kindToJobMap>(kind: K) {
    const { className: jobClass, queueName } = this.kindToJobMap[kind]
    return {
      dispatch: (dispatchOptions: { campaign_id: number; user_id: number }) => {
        return jobClass.dispatch(dispatchOptions, {
          queueName,
        })
      },
    }
  }
}
