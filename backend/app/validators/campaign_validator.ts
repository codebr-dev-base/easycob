import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const createCampaignValidator = vine.compile(
    vine.object({
      date: vine.date({ formats: { utc: true } }).transform((value) => {
        return DateTime.fromJSDate(value);
      }),
      name: vine.string(),
      message: vine.string().optional(),
      single_send: vine.boolean(),
      num_whatsapp: vine.string().optional(),
      type: vine.string().optional(),
      subject: vine.string().optional(),
      email: vine.string().optional(),
      template_external_id: vine.number().optional(),
    })
  )