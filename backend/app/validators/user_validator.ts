import vine from '@vinejs/vine';

/**
 * Validates the user's creation action
 */
export const createUserValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    name: vine.string().trim(),
    cpf: vine.string().trim().nullable().optional(),
    phone: vine.string().trim().nullable().optional(),
    isActived: vine.boolean().optional(),
    password: vine.string().confirmed({
      confirmationField: 'passwordConfirmation',
    }),
    passwordExpiresAt: vine.date().optional(),
  })
);

/**
 * Validates the user's update action
 */
export const updateUserValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    name: vine.string().trim(),
    cpf: vine.string().trim().nullable().optional(),
    phone: vine.string().trim().nullable().optional(),
    isActived: vine.boolean().optional(),
  })
);

/**
 * Validates the user's update action
 */
export const updatePasswordValidator = vine.compile(
  vine.object({
    password: vine.string().confirmed({
      confirmationField: 'passwordConfirmation',
    }),
  })
);
