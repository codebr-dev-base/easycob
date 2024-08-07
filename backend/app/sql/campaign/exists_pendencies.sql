      EXISTS (
        SELECT 1
        FROM public.campaign_lots cl
        WHERE cl.campaign_id = c.id
        AND cl.contato IS NOT NULL
        AND cl.messageid IS NULL
        AND cl.valid = true
      ) AS pendencies