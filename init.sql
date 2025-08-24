CREATE
  DATABASE benicio_db;
CREATE
  DATABASE benicio_db_development;
CREATE
  DATABASE benicio_db_testing;

GRANT ALL PRIVILEGES ON DATABASE
  benicio_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE
  benicio_db_development TO postgres;
GRANT ALL PRIVILEGES ON DATABASE
  benicio_db_testing TO postgres;
