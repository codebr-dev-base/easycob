SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'base_externa'
AND table_name = 'tbl_base_dataset';
