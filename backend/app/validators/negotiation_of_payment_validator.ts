import vine from '@vinejs/vine'
import { DateTime } from 'luxon'


export const updateNegotiationOfPaymentValidator = vine.compile(
    vine.object({
      dat_entra_payment: vine.date().transform((value) => {
        return DateTime.fromJSDate(value);
      }),
      val_entra_payment: vine.number(),
    })
  )