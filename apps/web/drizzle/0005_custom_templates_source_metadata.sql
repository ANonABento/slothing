ALTER TABLE custom_templates ADD COLUMN source_filename text;
ALTER TABLE custom_templates ADD COLUMN source_type text;
ALTER TABLE custom_templates ADD COLUMN updated_at text;
UPDATE custom_templates SET updated_at = created_at WHERE updated_at IS NULL;
