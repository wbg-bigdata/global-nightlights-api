const config = require("config");
const pgConnectionString = config.get("pgConnectionString");
module.exports = require("knex")(pgConnectionString);
