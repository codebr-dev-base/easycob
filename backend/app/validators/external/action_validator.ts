import vine from '@vinejs/vine';

export const createActionValidator = vine.compile(
  vine.object({
    desContr: vine.string(),
    tipoContato: vine.string(),
    contato: vine.string(),
    typeActionId: vine.number(),
    description: vine.string().optional(),
    channel: vine.string().optional(),
  })
);
