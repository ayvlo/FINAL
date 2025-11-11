-- Initialize PostgreSQL extensions and database for Ayvlo

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "btree_gist";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create database for OpenFGA
CREATE DATABASE openfga;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ayvlo TO ayvlo;
GRANT ALL PRIVILEGES ON DATABASE openfga TO ayvlo;

-- Log success
DO $$
BEGIN
    RAISE NOTICE 'PostgreSQL initialization complete';
    RAISE NOTICE 'Database: ayvlo';
    RAISE NOTICE 'User: ayvlo';
    RAISE NOTICE 'Extensions: uuid-ossp, citext, btree_gist, pgcrypto, pg_stat_statements';
END $$;
