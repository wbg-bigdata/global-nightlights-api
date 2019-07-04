const db = require("../lib/knex");
const fs = require("fs-extra");
const { join } = require("path");
const { print } = require("./utils");

// The country codes file was obtained here:
// https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes
const countriesPath = join(__dirname, "..", "lib", "countries.json");

/**
 * Commander program
 *
 * Usage: update-country
 *
 * Update bounding boxes of countries based on available positions
 *
 */
module.exports = async command => {
  try {
    await db.transaction(async trx => {
      print(`Updating countries...`);

      if (command.seed) {
        print(`  Ingesting seed file...`);
        print(`    Reading countries.json...`);
        let countries = await fs.readJSON(countriesPath);

        // Clear country list
        print(`    Clearing current list of countries...`);
        await trx("countries").del();

        // Format countries from countries.json
        countries = countries.map(c => {
          return {
            id: c["alpha-3"],
            name: c["name"]
          };
        });

        // Insert countries
        print(`    Inserting countries found...`);
        await trx("countries").insert(countries);
      }

      // Get existing country codes at positions table
      const { rows: countries } = await trx.raw(`
        SELECT
          left(id, 3) as id,
          ST_Extent(geometry) as bbox
        FROM
          positions
        GROUP BY
          left(id, 3);
      `);

      print(`  ${countries.length} countries with positions, updating: `);

      // Clear current bboxes
      await trx.raw(`UPDATE countries set bbox = null;`);

      // Update countries found
      for (let i = 0; i < countries.length; i++) {
        const country = countries[i];
        print(`    - ${country.id}`);
        await trx("countries")
          .update({ bbox: country.bbox })
          .where({ id: country.id });
      }

      print(`Done!`);
    });
  } catch (error) {
    print(`An error has occurred, no data was written:`);
    print(`  ${error.detail || error.message}`);
  }
};
