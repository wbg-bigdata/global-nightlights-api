const db = require("../lib/knex");
const { print, readCsv, ls } = require("./utils");

/**
 * Commander program
 *
 * Usage: ingest-positions [options] <glob>
 *
 * Ingests positions files
 *
 */
module.exports = async (glob, command) => {
  try {
    print(`Initializing data ingest...`);

    const files = await ls(glob);

    if (files.length > 0) {
      print(`  Files found: ${files.length}`);

      for (const file of files) {
        print(`  File: ${file}`);
        print(`    Parsing...`);

        const options = {
          columns: command.headers
        };

        let positions = await readCsv(file, options);

        positions = positions.map(p => {
          if (!command.headers) {
            p = {
              id: p[0],
              geometry: p[1],
              population: p[2],
              n_sets: p[3]
            };
          }

          if (!p.hasOwnProperty("id"))
            throw Error(
              "Missing headers. Please refer to ingest instructions."
            );

          p.population = parseFloat(p.population);
          p.n_sets = parseFloat(p.n_sets);

          return p;
        });

        print(`    Saving to database...`);

        await db.transaction(async trx => {
          await trx.batchInsert("positions", positions);
        });

        print(`    Done!`);
      }
    } else {
      print("No files found.");
    }
  } catch (error) {
    print(`An error has occurred:`);
    print(`  ${error.detail || error.message}`);
  }
};
