import vine from '@vinejs/vine';
import { DateTime } from 'luxon';


export const confirmationNegotiationInvoiceValidator = vine.compile(
    vine.object({
        datPayment: vine.date().transform((value) => {
            return DateTime.fromJSDate(value);
        }).optional().requiredIfExists('valPayment'),
        valPayment: vine.number().optional().requiredIfExists('datPayment'),
        followingStatus: vine.string().optional(),
        datBreach: vine.date().transform((value) => {
            return DateTime.fromJSDate(value);
        }).optional(),
    })
);

export const updateNegotiationInvoiceValidator = vine.compile(
    vine.object({
        datEntraPayment: vine.date().transform((value) => {
            return DateTime.fromJSDate(value);
        }).optional().requiredIfExists('valEntraPayment'),
        valEntraPayment: vine.number().optional().requiredIfExists('datEntraPayment'),
        followingStatus: vine.string().optional(),
        datBreach: vine.date().transform((value) => {
            return DateTime.fromJSDate(value);
        }).optional(),
    })
);