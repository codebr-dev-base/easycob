import vine from '@vinejs/vine'

export const createClientMailValidator = vine.compile(
    vine.object({
      cod_credor_des_regis: vine.string(),
      contact: vine.string(),
      type: vine.string(),
    })
  )