import vine from '@vinejs/vine';
import { DateTime } from 'luxon';

export const createActionValidator = vine.compile(
  vine.object({
    codCredorDesRegis: vine.string(),
    desContr: vine.string(),
    desRegis: vine.string(),
    codCredor: vine.string(),
    matriculaContrato: vine.number(),
    tipoContato: vine.string(),
    contato: vine.string(),
    typeActionId: vine.number(),
    description: vine.string().optional(),
    valPrinc: vine.number().optional(),
    datVenci: vine
      .date({ formats: { utc: true } })
      .optional()
      .transform((value) => {
        return DateTime.fromJSDate(value);
      }),
    dayLate: vine.number().optional(),
    channel: vine.string().optional(),
    wallet: vine.string().optional(),
  })
);
