const db = require("./db");
const { print, readCsv, ls } = require("./utils");

/**
 * Commander program
 *
 * Usage: ingest-observations [options] <glob>
 *
 * Ingests observations files
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

        let observations = await readCsv(file, options);

        observations = observations.map(p => {
          if (!command.headers) {
            p = {
              positionId: p[0],
              scanned_at: p[1],
              rade9: p[2],
              rad: p[3]
            };
          }

          if (!p.hasOwnProperty("positionId"))
            throw Error(
              "Missing headers. Please refer to ingest instructions."
            );

          // Parse numbers
          p.rade9 = parseFloat(p.rade9);
          p.rad = parseFloat(p.rad);

          return p;
        });

        print(`    Saving to database...`);

        await db.transaction(async trx => {
          await trx.batchInsert("observations", observations);
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
