import vine from '@vinejs/vine';
import { DateTime } from 'luxon';



export const updatePromiseOfPaymentValidator = vine.compile(
    vine.object({
        dat_payment: vine.date().transform((value) => {
            return DateTime.fromJSDate(value);
        }).optional().requiredIfExists('val_payment'),
        val_payment: vine.number().optional().requiredIfExists('dat_payment'),
        following_status: vine.string().optional(),
        dat_breach: vine.date().transform((value) => {
            return DateTime.fromJSDate(value);
        }).optional(),
    })
);