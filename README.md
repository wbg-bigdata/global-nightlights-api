# Global Night Lights Data Service 

A visualization platform.

## Installing

Node.js 8+ is required. 

### Clone locally and install modules

    git clone <repository_url>
    cd <repository_path>
    yarn

### Configure

Create file `config/development.json` and set PostgreSQL connection string as bellow:

```json
{
  "postgres": "postgres://nightlights:nightlights@localhost:5432/nightlights"
}
```

Check [@feathersjs/configuration docs](https://docs.feathersjs.com/api/configuration.html) to learn more about configuration options.

### Start development server

    yarn dev

### Access the API

Example query:

  * [localhost:3030/observations?nearby=-1.285400390625,8.233237111274565]()

## License

[MIT](LICENSE)
