TRUNCATE TABLE public.last_actions RESTART IDENTITY;

INSERT INTO
    public.last_actions (
        action_id,
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
    id AS action_id,
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
FROM actions AS combined
WHERE
    id IN (
        SELECT
            max_id
        FROM
            (
                SELECT DISTINCT
                    cod_credor_des_regis,
                    MAX(id) AS max_id
                FROM actions AS combined_sub
                WHERE
                    retornotexto = 'RETORNO OK'
                GROUP BY
                    cod_credor_des_regis
            ) AS subquery
    );
