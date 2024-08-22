import vine from '@vinejs/vine';

export const contactValidator = vine.compile(
  vine.object({
    codCredorDesRegis: vine.string(),
    tipoContato: vine.string(),
    contato: vine.string(),
    isWhatsapp: vine.boolean(),
    block: vine.boolean(),
    blockAll: vine.boolean(),
    cpc: vine.boolean().optional(),
  })
)

