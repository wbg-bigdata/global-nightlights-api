const logger = require("../logger");

module.exports = function() {
  const app = this;

  app.get("/countries", async function(req, res) {
    try {
      const db = app.get("sequelizeClient");

      const [countries] = await db.query(`
          SELECT *
          FROM countries
          WHERE bbox IS NOT NULL
          ORDER BY name;
      `);

      return res.json({countries});
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({ message: "Internal error." });
    }
  });
};
