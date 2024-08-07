import vine from '@vinejs/vine'
import { DateTime } from 'luxon'


export const createActionValidator = vine.compile(
  vine.object({
    cod_credor_des_regis: vine.string(),
    des_contr: vine.string(),
    des_regis: vine.string(),
    cod_credor: vine.string(),
    matricula_contrato: vine.number(),
    tipo_contato: vine.string(),
    contato: vine.string(),
    type_action_id: vine.number(),
    description: vine.string().optional(),
    val_princ: vine.number().optional(),
    dat_venci: vine.date({ formats: { utc: true } }).optional().transform((value) => {
      return DateTime.fromJSDate(value);
    }),
    day_late: vine.number().optional(),
    channel: vine.string().optional(),
  })
)