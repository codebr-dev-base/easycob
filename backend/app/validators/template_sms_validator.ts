import vine from '@vinejs/vine'

export const createTemplateSmsValidator = vine.compile(
    vine.object({
        name: vine.string(),
        template: vine.string(),
    })
)