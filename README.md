# Global Night Lights Data Service 

## Prerequisites

Node.js 10+, PostgreSQL and Docker are required. 

### Clone locally and install modules

    git clone <repository_url>
    cd <repository_path>
    yarn

### Database setup

1. Download the latest [PostgreSQL dump](https://wbg-bigdata.github.io/global-nightlights-api/about/).
2. Start the database container:

    `docker-compose up`
3. Use `pg_restore` to import data, replacing `DUMP_FILE_PATH` with the path of downloaded dump file:

```
pg_restore --host localhost --port 15432 --username "nightlights" --dbname "nightlights" --no-password  --verbose <DUMP_FILE_PATH>
```

### Configuration

Changing configuration settings is optional. These are environment variables available:

- HOST: host name;
- PORT: service port;
- DB_CONNECTION_STRING: connection string to a PostgreSQL database.

Another configuration option is to create file `config/development.json`. It will extend settings defined on `config/default.json`. Check [@feathersjs/configuration docs](https://docs.feathersjs.com/api/configuration.html) to learn more.

### Start development server

    yarn dev

### Access the API

The route `/observations` is only one avaible at the moment. The client must pass `nearby` parameter as a pair of coordinates separated by a comma. Example:

  * [http://localhost:3030/observations?nearby=-1.285400390625,8.233237111274565]()

The result will be a GeoJSON object containing the nearest feature to the coordinates passed. Its properties will contain observation data like in this example:

```
{
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [-1.36992582, 8.15081722]
        },
        "properties": {
            "id": "s100451",
            "x": "-1.36992582",
            "y": "8.15081722",
            "dist2010": 720,
            "prp_sets": "0.04444444",
            "prp_sets_dist1": "0.875",
            "prp_sets_dist3": "0.33333333",
            "data": [{
                "rade9": "0.05272794",
                "rad": "8.5929698900000009",
                "li": "0",
                "lc_type": 9,
                "total_hh": 2481,
                "e_hh": 865,
                "e_rate": "0.34865",
                "scanned_at": "2012-04-23T01:04:00.000Z"
            }, {
                "rade9": "0.24038182",
                "rad": "8.57699871",
                "li": "0",
                "lc_type": 9,
                "total_hh": 2481,
                "e_hh": 865,
                "e_rate": "0.34865",
                "scanned_at": "2012-04-24T00:47:00.000Z"
            }, {
                "rade9": "0.14193553",
                "rad": "8.92146778",
                "li": "0",
                "lc_type": 9,
                "total_hh": 2481,
                "e_hh": 865,
                "e_rate": "0.34865",
                "scanned_at": "2012-04-29T00:50:00.000Z"
           }]
        }
    }]
}
```

## License

[MIT](LICENSE)
