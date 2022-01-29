DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles  -- SELECT list can be empty for this
      WHERE rolname = 'birdybop') THEN

      CREATE ROLE birdybop LOGIN PASSWORD 'birdybop';
   END IF;
END
$do$;
