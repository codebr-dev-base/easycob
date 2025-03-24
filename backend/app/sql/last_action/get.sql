TRUNCATE TABLE public.last_actions RESTART IDENTITY;

INSERT INTO last_actions (
    action_id,
    action_uuid,
    cod_credor_des_regis,
    matricula_contrato,
    des_regis,
    cod_credor,
    tipo_contato,
    contato,
    channel,
    des_contr,
    type_action_id,
    description,
    sync,
    result_sync,
    user_id,
    val_princ,
    dat_venci,
    day_late,
    retorno,
    retornotexto,
    synced_at,
    created_at,
    updated_at
)
SELECT
    a.id AS action_id,
    a.uuid AS action_uuid,
    a.cod_credor_des_regis,
    a.matricula_contrato,
    a.des_regis,
    a.cod_credor,
    a.tipo_contato,
    a.contato,
    a.channel,
    a.des_contr,
    a.type_action_id,
    a.description,
    a.sync,
    a.result_sync,
    a.user_id,
    a.val_princ,
    a.dat_venci,
    a.day_late,
    a.retorno,
    a.retornotexto,
    a.synced_at,
    a.created_at,
    a.updated_at
FROM
    actions a
WHERE
    a.created_at = (
        SELECT
            MAX(created_at)
        FROM
            actions a2
        WHERE
            a2.cod_credor_des_regis = a.cod_credor_des_regis
            AND a2.created_at >= NOW() - INTERVAL '11 days' -- Filtra registros dos últimos 11 dias
    );
