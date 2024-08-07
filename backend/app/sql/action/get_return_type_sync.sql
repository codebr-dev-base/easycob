SELECT DISTINCT
    CASE
        WHEN POSITION('.' IN retornotexto) > 0 THEN SUBSTRING(
            retornotexto
            FROM
                1 FOR POSITION('.' IN retornotexto) - 1
        )
        ELSE retornotexto
    END AS retornotexto
FROM
    public.actions;