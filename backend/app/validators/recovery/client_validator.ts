import vine from '@vinejs/vine';

export const updateClientValidator = vine.compile(
  vine.object({
    desRegis: vine.string(),
    nomClien: vine.string(),
    desCpf: vine.string(),
    desEnderResid: vine.string(),
    desNumerResid: vine.string().optional(),
    desComplResid: vine.string().optional(),
    desBairrResid: vine.string(),
    desCidadResid: vine.string(),
    desEstadResid: vine.string(),
  })
);