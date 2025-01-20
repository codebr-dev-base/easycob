import vine from '@vinejs/vine';

export const createClientMailValidator = vine.compile(
  vine.object({
    codCredorDesRegis: vine.string(),
    contact: vine.string(),
    type: vine.string(),
  })
);
