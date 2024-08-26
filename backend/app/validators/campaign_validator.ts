import vine from '@vinejs/vine';
import { DateTime } from 'luxon';

export const createCampaignValidator = vine.compile(
  vine.object({
    date: vine.date().transform((value) => {
      return DateTime.fromJSDate(value);
    }),
    name: vine.string(),
    message: vine.string().optional(),
    singleSend: vine.boolean(),
    numWhatsapp: vine.string().optional(),
    type: vine.string().optional(),
    subject: vine.string().optional(),
    email: vine.string().optional(),
    templateExternalId: vine.number().optional(),
  })
);