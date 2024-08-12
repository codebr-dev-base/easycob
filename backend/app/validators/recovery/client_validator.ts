import vine from '@vinejs/vine'

export const updateClientValidator = vine.compile(
    vine.object({
      des_regis: vine.string(),
      nom_clien: vine.string(),
      des_cpf: vine.string(),
      des_ender_resid: vine.string(),
      des_numer_resid: vine.string().optional(),
      des_compl_resid: vine.string().optional(),
      des_bairr_resid: vine.string(),
      des_cidad_resid: vine.string(),
      des_estad_resid: vine.string(),
    })
  )