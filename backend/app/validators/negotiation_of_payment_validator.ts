import vine from '@vinejs/vine';
import { DateTime } from 'luxon';


export const updateNegotiationOfPaymentValidator = vine.compile(
  vine.object({
    datEntraPayment: vine.date().transform((value) => {
      return DateTime.fromJSDate(value);
    }),
    valEntraPayment: vine.number(),
  })
);