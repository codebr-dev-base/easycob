import vine from '@vinejs/vine'

/**
 * Validates the user's creation action
 */
export const createUserValidator = vine.compile(
    vine.object({
        email: vine.string().trim().email(),
        name: vine.string().trim(),
        cpf: vine.string().trim().nullable().optional(),
        phone: vine.string().trim().nullable().optional(),
        is_actived: vine.boolean().optional(),
        password: vine
            .string()
            .confirmed({
                confirmationField: 'password_confirmation'
            }),
        passwordExpiresAt: vine.date().optional()
    })
)

/**
 * Validates the user's update action
 */
export const updateUserValidator = vine.compile(
    vine.object({
        email: vine.string().trim().email(),
        name: vine.string().trim(),
        cpf: vine.string().trim().nullable().optional(),
        phone: vine.string().trim().nullable().optional(),
        is_actived: vine.boolean().optional()
    })
)

/**
 * Validates the user's update action
 */
export const updatePasswordValidator = vine.compile(
    vine.object({
        password: vine
            .string()
            .confirmed({
                confirmationField: 'password_confirmation'
            }),
        passwordExpiresAt: vine.date().optional()
    })
)



