# Global Night Lights Data Service 

## Prerequisites

Node.js 8+, PostgreSQL and Docker are required. 

### Clone locally and install modules

    git clone <repository_url>
    cd <repository_path>
    yarn

### Database setup

1. Download the latest PostgreSQL dump.
2. Start the database container:

    `docker-compose up`
3. Use `pg_restore` to import data, replacing `DUMP_FILE_PATH` with the path of downloaded dump file:

```
pg_restore --host localhost --port 15432 --username "nightlights" --dbname "nightlights" --no-password  --verbose <DUMP_FILE_PATH>
```

### Configuration

The server should run without any configuration. These are enviroment variables available if you need to change default settings:

- HOST: host name;
- PORT: service port;
- DB_CONNECTION_STRING: connection string to a PostgreSQL database.

Another configuration option is to create file `config/development.json` to extend options available on `config/default.json`. Check [@feathersjs/configuration docs](https://docs.feathersjs.com/api/configuration.html) to learn more about configuration options.

### Start development server

    yarn dev

### Access the API

Query example:

  * [http://localhost:3030/observations?nearby=-1.285400390625,8.233237111274565]()

## License

[MIT](LICENSE)
