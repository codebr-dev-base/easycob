import vine from '@vinejs/vine';
import { DateTime } from 'luxon';

export const updatePromiseOfPaymentValidator = vine.compile(
  vine.object({
    datPayment: vine
      .date()
      .transform((value) => {
        return DateTime.fromJSDate(value);
      })
      .optional()
      .requiredIfExists('valPayment'),
    valPayment: vine.number().optional().requiredIfExists('datPayment'),
    followingStatus: vine.string().optional(),
    datBreach: vine
      .date()
      .transform((value) => {
        return DateTime.fromJSDate(value);
      })
      .optional(),
  })
);
