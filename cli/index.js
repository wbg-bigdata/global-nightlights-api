const program = require("commander");
const config = require("config");
const pkg = require("../package");
const ingestPositionsCmd = require("./ingest-positions");
const ingestObservationsCmd = require("./ingest-observations");

const { print } = require("./utils");

const pgConnectionString = config.get("pgConnectionString");

const actionHandler = fn => async (...args) => {
  if (!pgConnectionString || pgConnectionString.length === 0) {
    print("ERROR: A PostgreSQL connection string is needed, please check README.md.");
    print();
    process.exit(1);
  }

  try {
    await fn(...args);
    process.exit(0);
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      print("ERROR: Failed to connect to the database.");
      print("Check the connection string");
      process.exit(1);
    }

    if (error.userError) {
      error.details.forEach(row => console.log(row)); // eslint-disable-line
    } else {
      console.log(error); // eslint-disable-line
    }
    process.exit(1);
  }
};

program.description("Ingest tool for Global Nightlights").version(pkg.version);

program
  .command("ingest-positions <path>")
  .description("Ingest positions files.")
  .option('--no-headers', 'Input file does not have headers.')
  .action(actionHandler(ingestPositionsCmd));

program
  .command("ingest-observations <path>")
  .description("Ingest observations files.")
  .option('--no-headers', 'Input file does not have headers.')
  .action(actionHandler(ingestObservationsCmd));

program.parse(process.argv);
