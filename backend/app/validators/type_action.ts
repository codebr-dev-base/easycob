import vine from '@vinejs/vine';

export const createTypeActionValidator = vine.compile(
  vine.object({
    abbreviation: vine.string().trim().minLength(3).maxLength(255),
    name: vine.string().trim().minLength(3).maxLength(255),
    categoryActionId: vine.number().withoutDecimals().positive(),
    commissioned: vine.number(),
    type: vine.string().trim().minLength(3).maxLength(255),
    timelife: vine.number().withoutDecimals().positive(),
  })
);

export const updateTypeActionValidator = vine.compile(
  vine.object({
    abbreviation: vine.string().trim().minLength(3).maxLength(255).optional(),
    name: vine.string().trim().minLength(3).maxLength(255).optional(),
    categoryActionId: vine.number().withoutDecimals().positive().optional(),
    commissioned: vine.number().optional(),
    type: vine.string().trim().minLength(3).maxLength(255).optional(),
    timelife: vine.number().withoutDecimals().positive().optional(),
  })
);
