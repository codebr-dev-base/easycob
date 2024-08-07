import vine from '@vinejs/vine'

export const createContactValidator = vine.compile(
    vine.object({
      cod_credor_des_regis: vine.string(),
      tipo_contato: vine.string(),
      contato: vine.string(),
      is_whatsapp: vine.boolean(),
      block: vine.boolean(),
      block_all: vine.boolean(),
      cpc: vine.boolean().optional(),
    })
  )