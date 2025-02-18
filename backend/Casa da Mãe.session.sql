SELECT "l".*,
  la.synced_at AS last_action,
  la.pecld AS pecld,
  ta.name AS last_action_name,
  t.name AS tag_name,
  t.color AS tag_color
FROM "recupera"."redistribuicao_carteira_base" AS "l"
  LEFT JOIN "public"."last_actions" AS "la" ON "l"."cod_credor_des_regis" = "la"."cod_credor_des_regis"
  AND "l"."des_contr" = "la"."des_contr"
  LEFT JOIN "public"."type_actions" AS "ta" ON "la"."type_action_id" = "ta"."id"
  LEFT JOIN (
    SELECT ct.client_id,
      ct.tag_id,
      ct.updated_at
    FROM clients_tags AS ct
    ORDER BY ct.updated_at DESC
    LIMIT 1
  ) AS lct ON l.cod_credor_des_regis = lct.client_id
  LEFT JOIN tags AS t ON lct.tag_id = t.id
  AND lct.updated_at >= NOW() - (t.validity || ' days')::INTERVAL
WHERE "l"."user_id" = 1
ORDER BY "l"."id" ASC
LIMIT 10 OFFSET 10;
