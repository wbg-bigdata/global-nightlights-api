const _ = require("lodash");
const errors = require("@feathersjs/errors");

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports = function() {
  const app = this;

  app.get("/observations", async function(req, res) {
    const sequelize = app.get("sequelizeClient");

    let err;
    const geojson = {
      type: "FeatureCollection",
      features: []
    };

    // Validate "nearby" parameter
    const { nearby } = req.query;
    if (!nearby) {
      err = new errors.BadRequest('Missing "nearby" parameter.');
    } else {
      const position = nearby.split(",");
      if (
        !position ||
        position.length !== 2 ||
        !isNumeric(position[0]) ||
        !isNumeric(position[1])
      ) {
        err = new errors.BadRequest(
          'Invalid "nearby" parameter, should be a pair of decimal values separated with comma (x,y).'
        );
      }
    }

    // Get positions
    const nearestPositionsQuery = `
      SELECT *
      FROM positions
      ORDER BY geometry <-> st_setsrid(st_makepoint(${nearby}),4326)
      LIMIT 1;
    `;

    let positions;
    try {
      const results = await sequelize.query(nearestPositionsQuery);
      positions = results[0];
      // console.log(p
    } catch (sequelizeError) {
      if (sequelizeError) return res.status(500).json({ message: "Internal error." });
    }

    if (positions.length > 0) {
      // Get positions ids for observations query
      const positionIds = _.map(positions, p => p.id);

      // Add "data" property
      positions = _.map(positions, p => {
        p.data = [];
        return p;
      });

      // Transform positions array to object
      positions = _.keyBy(positions, p => p.id);

      // Prepare query
      const observationsQuery = `
      SELECT "positionId", year, month, day, rade9
      FROM observations
      WHERE "positionId" = ANY(ARRAY['${positionIds.join("','")}']);
      `;

      try {
        // Query observations
        const results = await sequelize.query(observationsQuery);
        const observations = results[0];

        // Add observations to respective position
        observations.forEach(o => {
          if (positions[o.positionId] && positions[o.positionId].data) {
            positions[o.positionId].data.push(o);
          }
        });

        // Format positions as GeoJSON features
        _.forEach(positions, p => {
          const feature = {
            type: "Feature",
            geometry: p.geometry
          };

          // Remove duplicated geometry
          delete p.geometry;

          // Remove duplicated field
          p.data = _.map(p.data, d => {
            delete d.positionId;
            return d;
          });

          // Copy properties
          feature.properties = p;

          // Add feature
          geojson.features.push(feature);
        });

      } catch (sequelizeError) {
        if (sequelizeError) return res.status(500).json({ message: "Internal error." });
      }
    }

    if (err)
      return res.status(err.code).json(err.toJSON());
    else
      return res.json(geojson);
  });
};
