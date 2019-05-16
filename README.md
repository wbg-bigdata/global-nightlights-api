# Nightlights Data Service 

Data service for Nightlights platform.

## Install Dependencies

To set up a development environment install the following on your system:

- [nvm](https://github.com/creationix/nvm)
- [Docker](https://www.docker.com/)

Clone this repository locally and activate target Node.js version:

```
nvm install
```

Install Node.js dependencies:

```
npm install
```

## Configuring the database

By default, the connection string set in [config/development.json](config/development.json) will be used. If you want to use a different database, advance to the next section.

To start the development database, run:

    npm run start-dev-db

Create the tables by running:

    npm run migrate-dev-db

### Using a custom database

In order to perform operations in a different database, there are two ways to set a custom PostgreSQL connection string:

**Option 1** - Via environment variable. Run the following on terminal, replacing `<your-connection-string>` with a valid [PostgreSQL connection string](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING):

```
export PG_CONNECTION_STRING=<your-connection-string>
```

**Option 2** - Via config file. Create file `config/local.json` as the example:

```
{
  "pgConnectionString": "postgres://nightlights:nightlights@localhost:15432/nightlights"
}
```

## Ingesting data

The data service uses two tables: positions and observations. The first stores the coordinates and metadata for locations, while the second holds luminosity readings over time.

### Data format

Both tables can be populated from csv files. They might include headers identifying parameters, and, if they don't, the column positions will be used.

**Positions csv:** 

1. `id`: position identifier, generally a [ISO 3166-1 alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) code following by a sequential integer (e.g. GHA1, GHA2, GHA3...)
2. `geometry`: coordinates as WKT Point (example: `SRID=4326;POINT(-0.2657591 11.1633172)`)
3. `population`: self-describing, can be integer or decimal
4. `n_sets`: number of settlements within 15 arcsecond pixel, ranging from 1-225

**Observations csv:** 

1. `positionId`: foreign key to positions table 
2. `scannet_at`: [ISO 8601 timestamp](https://en.wikipedia.org/wiki/ISO_8601)  (example: `2012-04-01T02:08`)
3. `rade9`: decimal
4. `rad`: mean annual brightness, decimal

### Using the command line tool

There are two commands available: `ingest-positions` and `ingest-observations`. A valid connection string must be set, as described in [Configuring the database](#configuring-the-database) section. All command should be run for this repository root directory and follow the pattern:

    node ./cli/ <command-name> <options> <files>

Parameters description:

- `command-name`: valid options are `ingest-positions` or `ingest-observations`
- `options`: use `--no-headers` when csv files does not include headers
- `files`: a valid [glob](https://en.wikipedia.org/wiki/Glob_%28programming%29) matching target files


#### Examples: positions

Ingest a positions file that does not have headers:

    node ./cli/ ingest-positions --no-headers <data-dir>/positions.csv

Ingest a positions file that has headers (`--no-headers` is omitted):

    node ./cli/ ingest-positions <data-dir>/positions.csv

Ingest multiple positions files where their names start with "positions":

    node ./cli/ ingest-positions <data-dir>/**/positions*.csv

#### Examples: observations    

Ingest a observations file that does not have headers:

    node ./cli/ ingest-observations --no-headers <data-dir>/observations.csv

Ingest a observations file that headers (`--no-headers` is omitted):

    node ./cli/ ingest-observations <data-dir>/observations.csv

Ingest multiple observations files where their names start with "observations":

    node ./cli/ ingest-observations <data-dir>/**/observations*.csv

### Development server

The development database must be started and migrated before running the development server. Run:

    npm run dev

Access the service at [localhost:3000](http://localhost:3000)

### Access the API

The route `/observations` is only one available at the moment. The client must pass `nearby` parameter as a pair of coordinates separated by a comma. Example:

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
