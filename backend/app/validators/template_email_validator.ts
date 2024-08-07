import vine from '@vinejs/vine'

export const createTemplateEmailValidator = vine.compile(
    vine.object({
        name: vine.string(),
        template: vine.string(),
    })
)