# Global Night Lights Data Service 

A visualization platform.

## Installing

Node.js 8+ is required. 

### Clone locally and install modules

    git clone <repository_url>
    cd <repository_path>
    yarn

### Configure

Add a PostgresSQL connection string at `config/default.json`:

```json
{
  "host": "localhost",
  "port": 3030,
  "public": "../public/",
  "postgres": "postgres://nightlights:nightlights@localhost:15432/nightlights" <- Change here
}
```

### Start development server

    yarn dev

### Access the API

Example query:

  * [localhost:3030/observations?nearby=-1.285400390625,8.233237111274565]()

## License

[MIT](LICENSE)
