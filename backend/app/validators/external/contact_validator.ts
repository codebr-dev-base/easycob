import vine from '@vinejs/vine';

export const contactValidator = vine.compile(
  vine.object({
    desContr: vine.string(),
    tipoContato: vine.string(),
    contato: vine.string(),
    isWhatsapp: vine.boolean().optional(),
    block: vine.boolean().optional(),
    blockAll: vine.boolean().optional(),
    cpc: vine.boolean().optional(),
  })
);
