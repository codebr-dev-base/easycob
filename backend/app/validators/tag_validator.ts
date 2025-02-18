import vine from '@vinejs/vine';

export const createTagValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    validity: vine.number().withoutDecimals().positive(),
    color: vine.string().regex(/^#([0-9A-Fa-f]{3}){1,2}$/),
  })
);

export const updateTagValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255).optional(),
    validity: vine.number().withoutDecimals().positive().optional(),
    color: vine
      .string()
      .regex(/^#([0-9A-Fa-f]{3}){1,2}$/)
      .optional(),
  })
);
