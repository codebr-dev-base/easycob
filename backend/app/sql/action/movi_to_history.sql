SELECT MAX(id) FROM public.history_actions;
ALTER SEQUENCE public.history_actions_id_seq RESTART WITH 5995690;

INSERT INTO public.history_actions (
    cod_credor_des_regis,
    matricula_contrato,
    des_regis,
    cod_credor,
    tipo_contato,
    contato,
    type_action_id,
    description,
    sync,
    result_sync,
    user_id,
    synced_at,
    created_at,
    updated_at,
    val_princ,
    dat_venci,
    day_late,
    retorno,
    retornotexto,
    des_contr,
    channel,
    "double",
    unification_check,
    pecld
)
SELECT
    cod_credor_des_regis,
    matricula_contrato,
    des_regis,
    cod_credor,
    tipo_contato,
    contato,
    type_action_id,
    description,
    sync,
    result_sync,
    user_id,
    synced_at,
    created_at,
    updated_at,
    val_princ,
    dat_venci,
    day_late,
    retorno,
    retornotexto,
    des_contr,
    channel,
    "double",
    unification_check,
    pecld
FROM public.actions
WHERE type_action_id NOT IN (1, 2, 3)
AND created_at < '2024-09-01';

DELETE FROM public.actions
WHERE type_action_id NOT IN (1, 2, 3)
AND created_at < '2024-09-01';
